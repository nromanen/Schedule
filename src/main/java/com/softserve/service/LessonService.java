package com.softserve.service;

import com.softserve.entity.Lesson;
import com.softserve.entity.Semester;
import com.softserve.entity.enums.LessonType;

import java.util.List;

public interface LessonService extends BasicService <Lesson, Long> {
    List<Lesson> getAllForGroup(Long groupId);
    List<Lesson> getLessonByTeacher(Long teacherId);
    List<LessonType> getAllLessonTypes();
    boolean isLessonForGroupExists(Lesson lesson);
    boolean isLessonForGroupExistsAndIgnoreWithId(Lesson lesson);
    List<Lesson> getLessonsBySemester(Long semesterId);
    List<Lesson> copyLessonsFromOneToAnotherSemester(List<Lesson> lessons, Semester toSemester);
    Lesson saveLessonDuringCopy(Lesson lesson);
}
