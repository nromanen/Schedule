package com.softserve.service;

import com.softserve.dto.TeacherDTO;
import com.softserve.entity.Teacher;
import java.util.List;

public interface TeacherService extends BasicService<Teacher, Long> {
    Teacher save(TeacherDTO teacherDTO);

    Teacher update(TeacherDTO teacherDTO);

    Teacher joinTeacherWithUser(Long teacherId, Long userId);

    List<Teacher> getAllTeachersWithWishes();

    Teacher getTeacherWithWishes(Long id);

    List<Teacher> getDisabled();

    Teacher findByUserId(int userId);

    List<Teacher> getAllTeacherWithoutUser();
}

