package com.softserve.service.impl;

import com.softserve.entity.Teacher;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.TeacherRepository;
import com.softserve.service.TeacherService;
import com.softserve.service.TeacherWishesService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Transactional
@Service
@Slf4j
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;

    @Autowired
    public TeacherServiceImpl(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
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
        return teacherRepository.save(object);
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
}
