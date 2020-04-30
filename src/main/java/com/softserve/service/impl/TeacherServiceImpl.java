package com.softserve.service.impl;

import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.Role;
import com.softserve.entity.enums.WishStatuses;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.TeacherRepository;
import com.softserve.service.MailService;
import com.softserve.service.TeacherService;
import com.softserve.service.TeacherWishesService;
import com.softserve.service.UserService;
import com.softserve.service.PeriodService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

@Transactional
@Service
@Slf4j
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserService userService;
    private final MailService mailService;
    private final PeriodService periodService;
    private final TeacherWishesService teacherWishesService;

    @Autowired
    public TeacherServiceImpl(TeacherRepository teacherRepository, UserService userService, MailService mailService,
                              PeriodService periodService, TeacherWishesService teacherWishesService) {
        this.teacherRepository = teacherRepository;
        this.userService = userService;
        this.mailService = mailService;
        this.periodService = periodService;
        this.teacherWishesService = teacherWishesService;
    }

    /**
     * The method used for getting teacher by id
     *
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
        return teacherRepository.getAll();
    }

    @Override
    public Teacher save(Teacher object) {
        log.info("Enter into save method with entity:{}", object);
        Teacher teacher = teacherRepository.save(object);
        saveTeacherWishesByNewTeacher(teacher);
        return teacher;
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
     * Method save information for Teacher Wishes in Repository
     * @param teacher Teacher entity
     * @return saved TeacherWishes entity
     */
    private TeacherWishes saveTeacherWishesByNewTeacher(Teacher teacher)
    {
        log.info("Enter into saveTeacherWishesByNewTeacher method with entity:{}", teacher);
        List<Period> periods = periodService.getAll();
        Wishes[] teacherWishesArray= new Wishes[7];
        int index = 0;
        for(DayOfWeek day : DayOfWeek.values())
        {
            List<Wish> wishes = new ArrayList<>();
            for(Period period: periods){
                Wish wish = new Wish();
                wish.setClassName(period.getName());
                wish.setStatus(WishStatuses.OK);
                wishes.add(wish);
            }
            Wishes teacherWish = new Wishes();
            teacherWish.withDayOfWeek(day);
            teacherWish.setEvenOdd(EvenOdd.WEEKLY);
            teacherWish.setWishes(wishes);
            teacherWishesArray[index]=teacherWish;
            index++;
        }
        TeacherWishes teacherWishes = new TeacherWishes();
        teacherWishes.setTeacher(teacher);
        teacherWishes.setTeacherWishesList(teacherWishesArray);
        return teacherWishesService.save(teacherWishes);
    }

    /**
     * Method deletes an existing teacher from Repository
     * @param object Teacher entity to be deleted
     * @return deleted Teacher entity
     */
    @Override
    public Teacher delete(Teacher object) {
        log.info("Enter into delete method with entity:{}", object);
        return teacherRepository.delete(object);
    }
    /**
     * Method gets information about teachers with wishes from Repository
     * @return List of all teachers with wishes
     */
    @Override
    public List<Teacher> getAllTeachersWithWishes() {
        List<Teacher> teachers = teacherRepository.getAll();
        teachers.forEach(teacher -> Hibernate.initialize(teacher.getTeacherWishesList()));
        return teachers;
    }

    /**
     * The method used for getting teacher with wishes by id
     * @param id Identity teacher id
     * @return target teacher with wishes
     */
    @Override
    public Teacher getTeacherWithWishes(Long id) {
        Teacher teacher = this.getById(id);
        Hibernate.initialize(teacher.getTeacherWishesList());
        return teacher;
    }

    /**
     * The method used for join Teacher and User
     *
     * @param teacherId Long teacherId used to find Teacher by it
     * @param userId Long userId used to find User by it
     * @return Teacher entity
     *
     * @throws EntityAlreadyExistsException when user already exist in some teacher/manager or teacher contains some userId
     */
    @Override
    public Teacher joinTeacherWithUser(Long teacherId, Long userId) {
        log.info("Enter into joinTeacherWithUser method with teacherId {} and userId:{}", teacherId, userId);
        User user = userService.getById(userId);
        Teacher getTeacher = getById(teacherId);

        if (!user.getRole().equals(Role.ROLE_USER) || getTeacher.getUserId() != null) {
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
     * The method used for getting all disabled teachers
     *
     * @return list of disabled teachers
     */
    @Override
    public List<Teacher> getDisabled() {
        log.info("Enter into getAll of getDisabled");
        return teacherRepository.getDisabled();
    }

}
