package com.softserve.repository;

import com.softserve.entity.Lesson;
import java.util.List;

public interface LessonRepository extends BasicRepository <Lesson, Long>  {
    List <Lesson> getAllForGroup(Long groupId, Long semesterId);
    List<Lesson> getLessonByTeacher(Long teacherId, Long semesterId);
    Long countLessonDuplicates(Lesson lesson);
    Long countLessonDuplicatesWithIgnoreId(Lesson lesson);
    List<Lesson> getLessonsBySemester(Long semesterId);
    void deleteLessonBySemesterId(Long semesterId);
    List<Lesson> getLessonsBySubjectIdTeacherIdSemesterIdLessonTypeAndExcludeCurrentLessonId(Lesson lesson);
    List<Lesson> getGroupedLessonsByLesson(Lesson lesson);
    Integer updateLinkToMeeting(Lesson lesson);
    Lesson updateGrouped(Lesson oldLesson,Lesson updatedLesson, boolean isTeacherOrSubjectUpdated);
    Lesson deleteGrouped(Lesson lesson);
    int setGrouped(Long lessonId);
}
