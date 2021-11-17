package com.softserve.service;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import com.softserve.dto.TeacherImportDTO;
import com.softserve.entity.Teacher;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface TeacherService extends BasicService<Teacher, Long> {
    Teacher save(TeacherDTO teacherDTO);

    Teacher update(TeacherForUpdateDTO teacherDTO);

    Teacher joinTeacherWithUser(Long teacherId, Long userId);
    List<Teacher> getDisabled();

    Teacher findByUserId(Long userId);

    List<Teacher> getAllTeacherWithoutUser();

    CompletableFuture<List<TeacherImportDTO>> saveFromFile(MultipartFile file, Long departmentId);

}

