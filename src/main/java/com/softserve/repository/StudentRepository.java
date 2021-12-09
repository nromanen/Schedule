package com.softserve.repository;

import com.softserve.entity.Student;

import java.util.Optional;

public interface StudentRepository extends BasicRepository <Student, Long> {
    Optional<Student> getExistingStudent (Student student);
    boolean isEmailInUse(String email);
    boolean isEmailForThisStudent(String email, Long id);

    Optional<Student> findByEmail(String email);
}
