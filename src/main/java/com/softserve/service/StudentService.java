package com.softserve.service;

import com.softserve.dto.StudentForUpdateListDTO;
import com.softserve.entity.Student;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface StudentService extends BasicService <Student, Long> {
    CompletableFuture<List<Student>> saveFromFile(MultipartFile file, Long groupId);
    void updateStudentList(StudentForUpdateListDTO students);
}
