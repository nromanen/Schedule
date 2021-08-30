package com.softserve.service.impl;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import com.softserve.entity.Teacher;
import com.softserve.entity.User;
import com.softserve.entity.enums.Role;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.mapper.TeacherMapper;
import com.softserve.repository.TeacherRepository;
import com.softserve.service.MailService;
import com.softserve.service.TeacherService;
import com.softserve.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
@Slf4j
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserService userService;
    private final MailService mailService;
    private final TeacherMapper teacherMapper;

    @Autowired
    public TeacherServiceImpl(TeacherRepository teacherRepository, UserService userService, MailService mailService,
                              TeacherMapper teacherMapper) {
        this.teacherRepository = teacherRepository;
        this.userService = userService;
        this.mailService = mailService;
        this.teacherMapper = teacherMapper;
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
     * @param object Teacher entity
     * @return saved Teacher entity
     */
    @Override
    public Teacher save(Teacher object) {
        log.info("Enter into save method with entity:{}", object);
        return teacherRepository.save(object);
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
        Integer userId = getById(teacherForUpdateDTO.getId()).getUserId();
        if (userId != null) {
            teacher.setUserId(userId);
            updateEmailInUserForTeacher(teacherForUpdateDTO.getEmail(), userId.longValue());
            return update(teacher);
        }
        return update(registerTeacher(teacher, teacherForUpdateDTO.getEmail()));
    }

    /**
     * Method updates information for an existing teacher in Repository
     * @param object Teacher entity with info to be updated
     * @return updated Teacher entity
     */
    @Override
    public Teacher update(Teacher object)
    {
        log.info("Enter into update method with entity:{}", object);
        return teacherRepository.update(object);
    }

    /**
     * Method deletes an existing teacher from Repository
     * @param object Teacher entity to be deleted
     * @return deleted Teacher entity
     */
    @Override
    public Teacher delete(Teacher object) {
        log.info("Enter into delete method with entity:{}", object);
        if (object.getUserId() != null) {
            User user = userService.getById(object.getUserId().longValue());
            user.setRole(Role.ROLE_USER);
            userService.update(user);
        }
        return teacherRepository.delete(object);
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

        getTeacher.setUserId(Integer.parseInt(String.valueOf(userId)));
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
     */
    @Override
    public Teacher findByUserId(long userId) {
        log.info("Enter into getByUserId with userId {}", userId);
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
        User registeredUserForTeacher = userService.automaticRegistration(email, Role.ROLE_TEACHER);
        teacher.setUserId(registeredUserForTeacher.getId().intValue());
        return teacher;
    }

    private void updateEmailInUserForTeacher(String email, long userId) {
        User userForTeacher = userService.getById(userId);
        userForTeacher.setEmail(email);
        userService.update(userForTeacher);
    }

    private boolean isEmailNullOrEmpty(String email) {
        return email == null || email.isEmpty();
    }
}
