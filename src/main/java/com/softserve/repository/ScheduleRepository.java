package com.softserve.repository;

import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;


import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends BasicRepository<Schedule, Long> {
    Long conflictForGroupInSchedule(Long semesterId, java.time.DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long groupId);

    Long conflictForTeacherInSchedule(Long semesterId, java.time.DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long teacherId);

    List<Group> uniqueGroupsInScheduleBySemester(Long semesterID);

    List<Period> periodsForGroupByDayBySemester(Long semesterId, Long groupId, DayOfWeek day);

    Optional<Lesson> lessonForGroupByDayBySemesterByPeriodByWeek(Long semesterId, Long groupId, Long periodId, DayOfWeek day, EvenOdd evenOdd);

    Room getRoomForLesson(Long semesterId, Long lessonId, Long periodId, DayOfWeek day, EvenOdd evenOdd);

    List<String> getDaysWhenGroupHasClassesBySemester(Long semesterId, Long groupId);

    Long countSchedulesForGroupInSemester(Long semesterId, Long groupId);

    List<Schedule> getAllSchedulesByTeacherIdAndSemesterId(Long teacherId, Long semesterId);

    List<Group> uniqueGroupsInScheduleBySemesterByTeacher(Long semesterId, Long teacherId);

    List<String> getDaysWhenGroupHasClassesBySemesterByTeacher(Long semesterId, Long groupId, Long teacherId);

    List<Period> periodsForGroupByDayBySemesterByTeacher(Long semesterId, Long groupId, DayOfWeek day, Long teacherId);

    Optional<Lesson> lessonForGroupByDayBySemesterByPeriodByWeekByTeacher(Long semesterId, Long groupId, Long periodId, DayOfWeek day, EvenOdd evenOdd, Long teacherId);
}
