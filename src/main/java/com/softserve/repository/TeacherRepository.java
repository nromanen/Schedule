package com.softserve.repository;

import com.softserve.entity.Teacher;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends BasicRepository<Teacher, Long> {


    /**
     * Retrieves a teacher by user id.
     *
     * @param userId the id of the user
     * @return an Optional describing the teacher with the given user id or an empty Optional if none found
     */
    Optional<Teacher> findByUserId(Long userId);

    /**
     * Returns all teachers from database, that don't registered in system.
     *
     * @return the list of teachers
     */
    List<Teacher> getAllTeacherWithoutUser();

    /**
     * Finds a teacher by their full name (name, surname, and patronymic).
     *
     * @param name       the teacher's first name
     * @param surname    the teacher's surname
     * @param patronymic the teacher's patronymic
     * @return an {@link Optional} containing the found {@link Teacher},
     *         or empty if no match exists
     */
    Optional<Teacher> findByFullName(
            String name, String surname, String patronymic);

    /**
     * Retrieves all active teachers who have an associated user account with an email.
     *
     * @return a {@link List} of {@link Teacher} objects who have a linked user account,
     *         sorted by surname in ascending order; an empty list if none found
     */
    List<Teacher> getAllTeachersWithEmail();

}
