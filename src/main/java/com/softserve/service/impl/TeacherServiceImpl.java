package com.softserve.service.impl;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import com.softserve.dto.TeacherImportDTO;
import com.softserve.dto.enums.ImportSaveStatus;
import com.softserve.entity.Department;
import com.softserve.entity.Teacher;
import com.softserve.entity.User;
import com.softserve.entity.enums.Role;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.exception.FieldNullException;
import com.softserve.mapper.TeacherMapper;
import com.softserve.repository.TeacherRepository;
import com.softserve.service.DepartmentService;
import com.softserve.service.MailService;
import com.softserve.service.TeacherService;
import com.softserve.service.UserService;
import com.softserve.util.CsvFileParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Transactional
@Service
@Slf4j
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserService userService;
    private final MailService mailService;
    private final TeacherMapper teacherMapper;
    private final DepartmentService departmentService;

    @Autowired
    public TeacherServiceImpl(TeacherRepository teacherRepository, UserService userService, MailService mailService,
                              TeacherMapper teacherMapper, DepartmentService departmentService ) {
        this.teacherRepository = teacherRepository;
        this.userService = userService;
        this.mailService = mailService;
        this.teacherMapper = teacherMapper;
        this.departmentService = departmentService;
    }

    /**
     * The method used for getting teacher by id
     * @param id Identity teacher id
     * @return target teacher
     * @throws EntityNotFoundException if teacher doesn't exist
     */
    @Override
    public Teacher getById(Long id) {
        log.info("Enter into getById of TeacherServiceImpl with id {}", id);
        return teacherRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Teacher.class, "id", id.toString()));
    }

    /**
     * Method gets information about teachers from Repository
     * @return List of all teachers
     */
    @Override
    public List<Teacher> getAll() {
        log.info("Enter into getAll()");
        return teacherRepository.getAll();
    }

    /**
     * Method save information for teacher in Repository
     * @param teacher Teacher entity
     * @return saved Teacher entity
     */
    @Override
    public Teacher save(Teacher teacher) {
        log.info("Enter into save method with entity:{}", teacher);
        return teacherRepository.save(teacher);
    }

    /**
     * Method save information for teacher in Repository and register user if email exists
     * @param teacherDTO TeacherDTO instance
     * @return saved Teacher entity
     */
    @Override
    public Teacher save(TeacherDTO teacherDTO) {
        log.info("Enter into save method with dto:{}", teacherDTO);
        Teacher teacher = teacherMapper.teacherDTOToTeacher(teacherDTO);
        if (isEmailNullOrEmpty(teacherDTO.getEmail())) {
            return save(teacher);
        }
        return save(registerTeacher(teacher, teacherDTO.getEmail()));
    }

    /**
     * Method updates information for an existing teacher in Repository and register user if email was added
     * @param teacherForUpdateDTO TeacherForUpdateDTO instance with info to be updated
     * @return updated Teacher entity
     */
    @Override
    public Teacher update(TeacherForUpdateDTO teacherForUpdateDTO) {
        log.info("Enter into update method with dto:{}", teacherForUpdateDTO);
        Teacher teacher =  teacherMapper.teacherForUpdateDTOToTeacher(teacherForUpdateDTO);
        if (isEmailNullOrEmpty(teacherForUpdateDTO.getEmail())) {
            return update(teacher);
        }
        Long userId = getById(teacherForUpdateDTO.getId()).getUserId();
        if (userId != null) {
            teacher.setUserId(userId);
            updateEmailInUserForTeacher(teacherForUpdateDTO.getEmail(), userId);
            return update(teacher);
        }
        return update(registerTeacher(teacher, teacherForUpdateDTO.getEmail()));
    }

    /**
     * Method updates information for an existing teacher in Repository
     * @param teacher Teacher entity with info to be updated
     * @return updated Teacher entity
     */
    @Override
    public Teacher update(Teacher teacher)
    {
        log.info("Enter into update method with entity:{}", teacher);
        return teacherRepository.update(teacher);
    }

    /**
     * Method deletes an existing teacher from Repository
     * @param teacher Teacher entity to be deleted
     * @return deleted Teacher entity
     */
    @Override
    public Teacher delete(Teacher teacher) {
        log.info("Enter into delete method with entity:{}", teacher);
        if (teacher.getUserId() != null) {
            User user = userService.getById(teacher.getUserId());
            user.setRole(Role.ROLE_USER);
            userService.update(user);
        }
        return teacherRepository.delete(teacher);
    }

    /**
     * The method used for getting all disabled teachers
     * @return list of disabled teachers
     */
    @Override
    public List<Teacher> getDisabled() {
        log.info("Enter into getAll of getDisabled");
        return teacherRepository.getDisabled();
    }

    /**
     * The method used for join Teacher and User
     * @param teacherId Long teacherId used to find Teacher by it
     * @param userId Long userId used to find User by it
     * @return Teacher entity
     * @throws EntityAlreadyExistsException when user already exist in some teacher/manager or teacher contains some userId
     */
    @Override
    public Teacher joinTeacherWithUser(Long teacherId, Long userId) {
        log.info("Enter into joinTeacherWithUser method with teacherId {} and userId:{}", teacherId, userId);
        User user = userService.getById(userId);
        Teacher getTeacher = getById(teacherId);

        if (user.getRole() != Role.ROLE_USER || getTeacher.getUserId() != null) {
            throw new EntityAlreadyExistsException("You cannot doing this action.");
        }

        getTeacher.setUserId(userId);
        user.setRole(Role.ROLE_TEACHER);
        userService.update(user);

        String message =  "Hello, " + user.getEmail() + ".\n" +
                "You received this email, because you now have all the teacher rights in the system.\n" +
                "Congratulations!";
        String subject = "You - Teacher";
        mailService.send(user.getEmail(), subject, message);

        return update(getTeacher);
    }


    /**
     * The method used for getting teacher by userId
     * @param userId Identity user id
     * @return Teacher entity
     * @throws EntityNotFoundException if teacher doesn't exist
     * @throws FieldNullException if userId is null
     */
    @Override
    public Teacher findByUserId(Long userId) {
        log.info("Enter into getByUserId with userId {}", userId);
        if(userId == null) {
            throw new FieldNullException(Teacher.class, "userId");
        }
        return teacherRepository.findByUserId(userId).orElseThrow(
                () -> new EntityNotFoundException(Teacher.class, "userId", String.valueOf(userId)));
    }

    /**
     * The method used for getting list of teachers from database, that don't registered in system
     * @return list of entities User
     */
    @Override
    public List<Teacher> getAllTeacherWithoutUser() {
        log.info("Enter into getAllTeacherWithoutUser of TeacherServiceImpl");
        return teacherRepository.getAllTeacherWithoutUser();
    }

    private Teacher registerTeacher(Teacher teacher, String email) {
            log.info("Enter into registerTeacher method with teacher {} and email:{}", teacher, email);
            User registeredUserForTeacher = userService.automaticRegistration(email, Role.ROLE_TEACHER);
            teacher.setUserId(registeredUserForTeacher.getId());
            return teacher;
    }

    private void updateEmailInUserForTeacher(String email, long userId) {
        log.info("Enter into updateEmailInUserForTeacher method with email {} and userId:{}", email, userId);
        User userForTeacher = userService.getById(userId);
        userForTeacher.setEmail(email);
        userService.update(userForTeacher);
    }

    private boolean isEmailNullOrEmpty(String email) {
        return email == null || email.isEmpty();
    }

    /**
     * Each line of the file should consist of five fields, separated by commas without spaceBar.
     * First line of the file is a header.
     * All subsequent lines contain data about teachers.
     * <p>
     * name,surname,patronymic,position,email
     * Test1,Test1,Test1,test1,test1@gmail.com
     * Test2,Test2,Test2,test2,test2@gmail.com
     * etc.
     * <p>
     *
     * @param file file with teachers data
     * @return list of created teachers.
     */
    @Override
    public List<TeacherImportDTO> saveFromFile(MultipartFile file, Long departmentId) {
        log.info("Enter into saveFromFile of TeacherServiceImpl with departmentId {}", departmentId);

        List<TeacherImportDTO> teachers = CsvFileParser.getTeachersFromFile(file);

       return teachers.stream().map(teacher -> saveTeacher(departmentId, teacher)).collect(Collectors.toList());
    }

    public TeacherImportDTO saveTeacher(Long departmentId, TeacherImportDTO teacher) {
        try{

            Optional<User> userOptional = userService.findSocialUser(teacher.getEmail());
            Teacher newTeacher = teacherMapper.teacherImportDTOToTeacher(teacher);
            Optional<Teacher> teacherFromBase = teacherRepository.getExistingTeacher(newTeacher);

            Department department = departmentService.getById(departmentId);

            if(userOptional.isEmpty() && teacherFromBase.isEmpty()){
                return registerAndSaveNewTeacher(teacher, newTeacher, department);
            }else if(userOptional.isEmpty()){
               return registerUserAndUpdateTeacher(teacher, teacherFromBase, department);
            }
            else if(teacherFromBase.isEmpty()){
                return  assignUserToNewTeacher( teacher, userOptional, newTeacher, department);
            }else{
                return  checkForEmptyFieldsOfExistingTeacher(teacher, userOptional, teacherFromBase, department);
            }
        }
        catch (ConstraintViolationException e) {
            teacher.setImportSaveStatus(ImportSaveStatus.VALIDATION_ERROR);
            log.error("Error occurred while saving teacher with email {}", teacher.getEmail(), e);
            return teacher;

        }
    }

    /**
     * The method used for assigning existing user to provided new teacher
     * @param teacher our teacher from file
     * @param userOptional our user from database
     * @param newTeacher our teacher which we will save to database
     * @param department department which provided from server
     */
    private TeacherImportDTO assignUserToNewTeacher(TeacherImportDTO teacher, Optional<User> userOptional, Teacher newTeacher, Department department) {
        log.debug("Enter to method if email EXIST and teacher DONT EXIST");
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

    /**
     * The method used for register provided user and update existed teacher
     * @param teacher our teacher from file
     * @param teacherFromBase our teacher from dataBase
     * @param department department which provided from server
     */
    private TeacherImportDTO registerUserAndUpdateTeacher(TeacherImportDTO teacher, Optional<Teacher> teacherFromBase, Department department) {
        log.debug("Enter to method if email DONT EXIST and teacher EXIST");
        if(teacherFromBase.isPresent()) {

            Teacher ourTeacherFromBase = getById(teacherFromBase.get().getId());
            Teacher registeredTeacher1 = registerTeacher(ourTeacherFromBase, teacher.getEmail());
            if (ourTeacherFromBase.getDepartment() == null) {
                registeredTeacher1.setDepartment(department);
            }
            if (ourTeacherFromBase.getUserId() == null) {
                registeredTeacher1.setUserId(registeredTeacher1.getUserId());
            }
            teacherRepository.update(registeredTeacher1);
            TeacherImportDTO savedTeacher = teacherMapper.teacherToTeacherImportDTO(registeredTeacher1);
            savedTeacher.setEmail(teacher.getEmail());
            savedTeacher.setImportSaveStatus(ImportSaveStatus.ALREADY_EXIST);
            return savedTeacher;
        }
        return null;
    }

    /**
     * The method used for register provided user and save provided teacher
     * @param teacher our teacher from file
     * @param newTeacher our teacher which we will save to database
     * @param department department which provided from server
     */
    private TeacherImportDTO registerAndSaveNewTeacher(TeacherImportDTO teacher, Teacher newTeacher, Department department) {
        log.debug("Enter to method if email and teacher DONT EXIST");

            Teacher registeredTeacher = registerTeacher(newTeacher, teacher.getEmail());
            registeredTeacher.setDepartment(department);
            teacherRepository.save(registeredTeacher);
            TeacherImportDTO savedTeacher = teacherMapper.teacherToTeacherImportDTO(registeredTeacher);
            savedTeacher.setEmail(teacher.getEmail());
            savedTeacher.setImportSaveStatus(ImportSaveStatus.SAVED);
            return savedTeacher;
    }

    /**
     * The method used for register provided user and save provided teacher
     * @param teacher our teacher from file
     * @param teacherFromBase our teacher from dataBase
     * @param userOptional our user from database
     * @param department department which provided from server
     */
    private TeacherImportDTO checkForEmptyFieldsOfExistingTeacher(TeacherImportDTO teacher, Optional<User> userOptional, Optional<Teacher> teacherFromBase, Department department) {
        log.debug("Enter to method if email EXIST and teacher EXIST");
        if (userOptional.isPresent() && teacherFromBase.isPresent()) {

            Teacher ourTeacherFromBase = getById(teacherFromBase.get().getId());
            if (ourTeacherFromBase.getDepartment() == null || ourTeacherFromBase.getUserId() == null) {
                if (ourTeacherFromBase.getDepartment() == null) {
                    ourTeacherFromBase.setDepartment(department);
                }
                if (ourTeacherFromBase.getUserId() == null) {
                    ourTeacherFromBase.setUserId(userOptional.get().getId());
                }
                teacherRepository.update(ourTeacherFromBase);
            }
            TeacherImportDTO existedTeacher = teacherMapper.teacherToTeacherImportDTO(ourTeacherFromBase);
            existedTeacher.setImportSaveStatus(ImportSaveStatus.ALREADY_EXIST);
            log.error("Teacher with current email exist ", new FieldAlreadyExistsException(Teacher.class, "email", teacher.getEmail()));
            return existedTeacher;
        }
        return null;
    }

}
