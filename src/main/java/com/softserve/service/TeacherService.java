package com.softserve.service;

import com.softserve.entity.Teacher;

import java.util.List;
import java.util.Optional;


public interface TeacherService extends BasicService<Teacher, Long> {
    List<Teacher> getAllWithWishes();
    Teacher getTeacherWithWishes(Long id);
}
