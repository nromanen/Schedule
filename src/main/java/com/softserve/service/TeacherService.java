package com.softserve.service;

import com.softserve.entity.Teacher;
import java.util.List;

public interface TeacherService extends BasicService<Teacher, Long> {
    List<Teacher> getAllTeachersWithWishes();
    Teacher getTeacherWithWishes(Long id);
}
