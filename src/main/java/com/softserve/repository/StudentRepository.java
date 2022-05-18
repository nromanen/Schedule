package com.softserve.repository;

import com.softserve.entity.Student;

import java.util.Optional;

public interface StudentRepository extends BasicRepository<Student, Long> {

    Optional<Student> getExistingStudent(Student student);

    /**
     * The method used for finding out if Student exists by email
     *
     * @param email String email used to find Student
     * @return boolean : if exists - true, else - false
     */
    boolean isEmailInUse(String email);

    /**
     * The method used for finding out if Student exists by email and id
     *
     * @param email String email used to find Student
     * @param id    Long id, which is used to find Student
     * @return boolean : if exists - true, else - false
     */
    boolean isEmailForThisStudent(String email, Long id);

    boolean isIdPresent(Long id);

}
