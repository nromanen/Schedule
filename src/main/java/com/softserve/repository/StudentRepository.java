package com.softserve.repository;

import com.softserve.entity.Student;

public interface StudentRepository extends BasicRepository <Student, Long> {
    Student getById(Long id);
    Student findByEmail(String email);
    Student findByUserId(Long userId);
}
