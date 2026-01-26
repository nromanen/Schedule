package com.softserve.service.impl;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import com.softserve.dto.TeacherImportDTO;
import com.softserve.dto.UserDataDTO;
import com.softserve.dto.enums.ImportSaveStatus;
import com.softserve.entity.Department;
import com.softserve.entity.Student;
import com.softserve.entity.Teacher;
import com.softserve.entity.User;
import com.softserve.entity.enums.Role;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.exception.FieldNullException;
import com.softserve.mapper.TeacherMapper;
import com.softserve.repository.DepartmentRepository;
import com.softserve.repository.StudentRepository;
import com.softserve.repository.TeacherRepository;
import com.softserve.service.TeacherService;
import com.softserve.service.UserService;
import com.softserve.util.CsvFileParser;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserService userService;
    private final DepartmentRepository departmentRepository;
    private final TeacherMapper teacherMapper;
    private final StudentRepository studentRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "teachers", key = "#id")
    public TeacherDTO getById(Long id) {
        log.info("Getting teacher by id: {}", id);
        Teacher teacher = findTeacherById(id);
        return teacherMapper.teacherToTeacherDTO(teacher);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "teachersList")
    public List<TeacherDTO> getAll() {
        log.info("Getting all teachers");
        List<Teacher> teachers = teacherRepository.getAll();
        return teacherMapper.teachersToTeacherDTOs(teachers);
    }

    @Override
    @CacheEvict(value = {"teachers", "teachersList"}, allEntries = true)
    public TeacherDTO save(TeacherDTO teacherDTO) {
        log.info("Saving teacher: {}", teacherDTO);
        Teacher teacher = teacherMapper.teacherDTOToTeacher(teacherDTO);

        if (!isEmailNullOrEmpty(teacherDTO.getEmail())) {
            teacher = registerTeacher(teacher, teacherDTO.getEmail());
        }

        Teacher saved = teacherRepository.save(teacher);
        return teacherMapper.teacherToTeacherDTO(saved);
    }

    @Override
    @CacheEvict(value = {"teachers", "teachersList"}, allEntries = true)
    public TeacherForUpdateDTO update(TeacherForUpdateDTO teacherForUpdateDTO) {
        log.info("Updating teacher: {}", teacherForUpdateDTO);
        Teacher teacher = teacherMapper.teacherForUpdateDTOToTeacher(teacherForUpdateDTO);

        if (isEmailNullOrEmpty(teacherForUpdateDTO.getEmail())) {
            Teacher updated = teacherRepository.update(teacher);
            return teacherMapper.teacherToTeacherForUpdateDTO(updated);
        }

        Teacher existingTeacher = findTeacherById(teacherForUpdateDTO.getId());
        Long userId = existingTeacher.getUserId();

        if (userId != null) {
            teacher.setUserId(userId);
            updateEmailInUserForTeacher(teacherForUpdateDTO.getEmail(), userId);
        } else {
            teacher = registerTeacher(teacher, teacherForUpdateDTO.getEmail());
        }

        Teacher updated = teacherRepository.update(teacher);
        return teacherMapper.teacherToTeacherForUpdateDTO(updated);
    }

    @Override
    @CacheEvict(value = {"teachers", "teachersList"}, allEntries = true)
    public void deleteById(Long id) {
        log.info("Deleting teacher by id: {}", id);
        Teacher teacher = findTeacherById(id);

        if (teacher.getUserId() != null) {
            User user = userService.getById(teacher.getUserId());
            user.setRole(Role.ROLE_USER);
            userService.update(user);
        }

        teacherRepository.delete(teacher);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getDisabled() {
        log.info("Getting disabled teachers");
        List<Teacher> teachers = teacherRepository.getDisabled();
        return teacherMapper.teachersToTeacherDTOs(teachers);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getAllTeacherWithoutUser() {
        log.info("Getting all teachers without user");
        List<Teacher> teachers = teacherRepository.getAllTeacherWithoutUser();
        return teacherMapper.teachersToTeacherDTOs(teachers);
    }

    @Override
    public List<TeacherImportDTO> saveFromFile(MultipartFile file, Long departmentId) {
        log.info("Importing teachers from file for department: {}", departmentId);
        List<TeacherImportDTO> teachers = CsvFileParser.getTeachersFromFile(file);
        return teachers.stream()
                .map(teacher -> saveTeacher(departmentId, teacher))
                .toList();
    }

    @Override
    public TeacherImportDTO saveTeacher(Long departmentId, TeacherImportDTO teacher) {
        try {
            Optional<User> userOptional = userService.findSocialUser(teacher.getEmail());
            Teacher newTeacher = teacherMapper.teacherImportDTOToTeacher(teacher);
            Optional<Teacher> teacherFromBase = teacherRepository.getExistingTeacher(newTeacher);

            Department department = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            Department.class, "id", departmentId.toString()));

            if (userOptional.isEmpty() && teacherFromBase.isEmpty()) {
                return registerAndSaveNewTeacher(teacher, newTeacher, department);
            } else if (userOptional.isEmpty()) {
                return registerUserAndUpdateTeacher(teacher, teacherFromBase, department);
            } else if (teacherFromBase.isEmpty()) {
                return assignUserToNewTeacher(teacher, userOptional, newTeacher, department);
            } else {
                return checkForEmptyFieldsOfExistingTeacher(teacher, userOptional, teacherFromBase, department);
            }
        } catch (ConstraintViolationException e) {
            teacher.setImportSaveStatus(ImportSaveStatus.VALIDATION_ERROR);
            log.error("Error occurred while saving teacher with email {}", teacher.getEmail(), e);
            return teacher;
        }
    }

    @Override
    @CacheEvict(value = {"teachers", "teachersList"}, allEntries = true)
    public void removeUserFromTeacher(Long userId) {
        log.info("Removing user association from teacher by userId: {}", userId);
        if (userId == null) {
            throw new FieldNullException(Teacher.class, "userId");
        }
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException(Teacher.class, "userId", String.valueOf(userId)));
        teacher.setUserId(null);
        teacherRepository.update(teacher);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDataDTO getUserDataByUserId(Long userId) {
        log.info("Getting user data for teacher by userId: {}", userId);
        if (userId == null) {
            return null;
        }
        return teacherRepository.findByUserId(userId)
                .map(teacherMapper::teacherToUserDataDTO)
                .orElse(null);
    }

    private Teacher findTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Teacher.class, "id", id.toString()));
    }

    private Teacher registerTeacher(Teacher teacher, String email) {
        log.debug("Registering teacher with email: {}", email);

        Optional<User> existingUser = userService.findByEmailOptional(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            if (user.getRole() == Role.ROLE_MANAGER) {
                throw new FieldAlreadyExistsException(User.class, "email",
                        "Email belongs to a manager account and cannot be used for teacher");
            }

            Optional<Teacher> teacherWithUserId = teacherRepository.findByUserId(user.getId());
            if (teacherWithUserId.isPresent() && !teacherWithUserId.get().getId().equals(teacher.getId())) {
                throw new FieldAlreadyExistsException(Teacher.class, "email",
                        "Email is already used by another teacher");
            }

            if (studentRepository.isEmailInUse(email)) {
                throw new FieldAlreadyExistsException(Student.class, "email",
                        "Email is already used by a student");
            }

            teacher.setUserId(user.getId());

            if (user.getRole() == Role.ROLE_USER) {
                user.setRole(Role.ROLE_TEACHER);
                userService.update(user);
            }

            return teacher;
        }

        User registeredUser = userService.automaticRegistration(email, Role.ROLE_TEACHER);
        teacher.setUserId(registeredUser.getId());
        return teacher;
    }

    private void updateEmailInUserForTeacher(String email, Long userId) {
        log.debug("Updating email for user: {}", userId);
        User user = userService.getById(userId);
        user.setEmail(email);
        userService.update(user);
    }

    private boolean isEmailNullOrEmpty(String email) {
        return email == null || email.isEmpty();
    }

    private TeacherImportDTO assignUserToNewTeacher(TeacherImportDTO teacher, Optional<User> userOptional,
                                                    Teacher newTeacher, Department department) {
        log.debug("Assigning existing user to new teacher");
        if (userOptional.isPresent()) {
            newTeacher.setUserId(userOptional.get().getId());
            newTeacher.setDepartment(department);
            teacherRepository.save(newTeacher);
            TeacherImportDTO savedTeacher = teacherMapper.teacherToTeacherImportDTO(newTeacher);
            savedTeacher.setEmail(teacher.getEmail());
            savedTeacher.setImportSaveStatus(ImportSaveStatus.SAVED);
            return savedTeacher;
        }
        return null;
    }

    private TeacherImportDTO registerUserAndUpdateTeacher(TeacherImportDTO teacher, Optional<Teacher> teacherFromBase,
                                                          Department department) {
        log.debug("Registering user and updating existing teacher");
        if (teacherFromBase.isPresent()) {
            Teacher existingTeacher = findTeacherById(teacherFromBase.get().getId());
            Teacher registeredTeacher = registerTeacher(existingTeacher, teacher.getEmail());

            if (existingTeacher.getDepartment() == null) {
                registeredTeacher.setDepartment(department);
            }

            teacherRepository.update(registeredTeacher);
            TeacherImportDTO savedTeacher = teacherMapper.teacherToTeacherImportDTO(registeredTeacher);
            savedTeacher.setEmail(teacher.getEmail());
            savedTeacher.setImportSaveStatus(ImportSaveStatus.ALREADY_EXIST);
            return savedTeacher;
        }
        return null;
    }

    private TeacherImportDTO registerAndSaveNewTeacher(TeacherImportDTO teacher, Teacher newTeacher,
                                                       Department department) {
        log.debug("Registering and saving new teacher");
        Teacher registeredTeacher = registerTeacher(newTeacher, teacher.getEmail());
        registeredTeacher.setDepartment(department);
        teacherRepository.save(registeredTeacher);
        TeacherImportDTO savedTeacher = teacherMapper.teacherToTeacherImportDTO(registeredTeacher);
        savedTeacher.setEmail(teacher.getEmail());
        savedTeacher.setImportSaveStatus(ImportSaveStatus.SAVED);
        return savedTeacher;
    }

    private TeacherImportDTO checkForEmptyFieldsOfExistingTeacher(TeacherImportDTO teacher, Optional<User> userOptional,
                                                                  Optional<Teacher> teacherFromBase, Department department) {
        log.debug("Checking existing teacher for empty fields");
        if (userOptional.isPresent() && teacherFromBase.isPresent()) {
            Teacher existingTeacher = findTeacherById(teacherFromBase.get().getId());

            if (existingTeacher.getDepartment() == null || existingTeacher.getUserId() == null) {
                if (existingTeacher.getDepartment() == null) {
                    existingTeacher.setDepartment(department);
                }
                if (existingTeacher.getUserId() == null) {
                    existingTeacher.setUserId(userOptional.get().getId());
                }
                teacherRepository.update(existingTeacher);
            }

            TeacherImportDTO existedTeacher = teacherMapper.teacherToTeacherImportDTO(existingTeacher);
            existedTeacher.setImportSaveStatus(ImportSaveStatus.ALREADY_EXIST);
            log.warn("Teacher with email {} already exists", teacher.getEmail());
            return existedTeacher;
        }
        return null;
    }
}
