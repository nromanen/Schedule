package com.softserve.service;

import com.softserve.entity.Lesson;

import java.util.List;

public interface LessonService extends BasicService <Lesson, Long> {
    List<Lesson> getAllForGroup(Long groupId);
}
