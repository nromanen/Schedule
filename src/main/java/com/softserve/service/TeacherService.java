package com.softserve.service;

import com.softserve.entity.Teacher;
import com.softserve.entity.TeacherWishes;

import java.util.List;

public interface TeacherService extends BasicService<Teacher, Long> {
    Teacher joinTeacherWithUser(Long teacherId, Long userId);
    List<Teacher> getAllTeachersWithWishes();
    Teacher getTeacherWithWishes(Long id);
    List<Teacher> getDisabled();
}
