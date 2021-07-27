package com.softserve.service;

import com.softserve.entity.Student;

public interface StudentService extends BasicService <Student, Long> {
    Student getByEmail(String email);
    Student getByUserId(Long userId);
    void ifGroupExist(Long id);
}
