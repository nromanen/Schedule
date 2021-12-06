package com.softserve.repository;

import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends BasicRepository<Schedule, Long> {
    Long conflictForGroupInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long groupId);

    Long conflictForTeacherInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long teacherId);

    List<Group> uniqueGroupsInScheduleBySemester(Long semesterID);

    List<Period> periodsForGroupByDayBySemester(Long semesterId, Long groupId, DayOfWeek day);

    Optional<Lesson> lessonForGroupByDayBySemesterByPeriodByWeek(Long semesterId, Long groupId, Long periodId, DayOfWeek day, EvenOdd evenOdd);

    Room getRoomForLesson(Long semesterId, Long periodId, Long lessonId, DayOfWeek day, EvenOdd evenOdd);

    List<DayOfWeek> getDaysWhenGroupHasClassesBySemester(Long semesterId, Long groupId);

    Long countSchedulesForGroupInSemester(Long semesterId, Long groupId);

    List<DayOfWeek> getDaysWhenTeacherHasClassesBySemester(Long semesterId, Long teacherId);

    List<Period> periodsForTeacherBySemesterByDayByWeek(Long semesterId, Long teacherId, DayOfWeek day, EvenOdd evenOdd);

    List<Lesson> lessonsForTeacherBySemesterByDayByPeriodByWeek(Long semesterId, Long teacherId, Long periodId, DayOfWeek day, EvenOdd evenOdd);

    List<Schedule> getAllSchedulesByTeacherIdAndSemesterId(Long teacherId, Long semesterId);

    Schedule getScheduleByObject(Schedule schedule);
    //rooms
    List<Schedule> getScheduleBySemester(Long semesterId);

    List<Schedule> scheduleForRoomBySemester(Long semesterId, Long roomId);

    List<Schedule> scheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId);

    void deleteSchedulesBySemesterId(Long semesterId);

    Long countInputLessonsInScheduleByLessonId(Long lessonId);

    Long countByLessonIdPeriodIdEvenOddDayOfWeek(Long lessonId, Long periodId, EvenOdd evenOdd, DayOfWeek day);

    List<Schedule> getAllOrdered(Long semesterId);
}
