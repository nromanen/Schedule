package com.softserve.repository;

import com.softserve.entity.Lesson;
import java.util.List;

public interface LessonRepository extends BasicRepository <Lesson, Long>  {
    List <Lesson> getAllForGroup(Long groupId, Long semesterId);
    List<Lesson> getLessonByTeacher(Long teacherId, Long semesterId);
    Long countLessonDuplicates(Lesson lesson);
    Long countLessonDuplicatesWithIgnoreId(Lesson lesson);
    List<Lesson> getLessonsBySemester(Long semesterId);
}
