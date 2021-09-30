package com.softserve.repository;

import com.softserve.entity.Student;

import java.util.Optional;

public interface StudentRepository extends BasicRepository <Student, Long> {
    boolean isExistsByEmail(String email);

    boolean isExistsByEmailIgnoringId(String email, Long id);

    Optional<Student> findByEmail(String email);
}
