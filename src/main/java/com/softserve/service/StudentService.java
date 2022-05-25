package com.softserve.service;

import com.softserve.dto.StudentDTO;
import com.softserve.dto.StudentImportDTO;
import com.softserve.entity.Student;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface StudentService extends BasicService<Student, Long> {
    Student save(StudentDTO studentDTO);

    Student update(StudentDTO studentDTO);

    CompletableFuture<List<StudentImportDTO>> saveFromFile(MultipartFile file, Long groupId);

}
