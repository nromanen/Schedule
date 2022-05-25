package com.softserve.repository;

import com.softserve.entity.Teacher;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends BasicRepository<Teacher, Long> {

    List<Teacher> getDisabled();

    /**
     * The method used for getting teacher by userId
     *
     * @param userId Identity user id
     * @return Optional<Teacher> entity
     */
    Optional<Teacher> findByUserId(Long userId);

    /**
     * The method used for getting list of teachers from database, that don't registered in system
     *
     * @return list of entities Teacher
     */
    List<Teacher> getAllTeacherWithoutUser();

    Optional<Teacher> getExistingTeacher(Teacher teacher);

}
