package com.softserve.service;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import com.softserve.entity.Teacher;
import java.util.List;

public interface TeacherService extends BasicService<Teacher, Long> {
    Teacher save(TeacherDTO teacherDTO);

    Teacher update(TeacherForUpdateDTO teacherDTO);

    Teacher joinTeacherWithUser(Long teacherId, Long userId);

    List<Teacher> getAllTeachersWithWishes();

    Teacher getTeacherWithWishes(Long id);

    List<Teacher> getDisabled();

    Teacher findByUserId(int userId);

    List<Teacher> getAllTeacherWithoutUser();
}

