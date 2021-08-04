package com.softserve.service;

import com.softserve.entity.Student;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface StudentService extends BasicService <Student, Long> {
    Student getByEmail(String email);
    Student getByUserId(Long userId);
    List<Student> saveFromFile(MultipartFile file, Long groupId) throws IOException;
}
