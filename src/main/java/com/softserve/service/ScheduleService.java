package com.softserve.service;

import com.softserve.dto.*;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.LessonType;

import javax.mail.MessagingException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public interface ScheduleService extends BasicService<Schedule, Long> {
    List<Schedule> schedulesForGroupedLessons(Schedule schedule);

    List<Schedule> getSchedulesForGroupedLessons(Schedule schedule);

    void checkReferences(Schedule schedule);

    CreateScheduleInfoDTO getInfoForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId);

    boolean isConflictForGroupInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId);

    List<Schedule> getFullScheduleForGroup(Long semesterId, Long groupId);

    List<Schedule> getFullScheduleForSemester(Long semesterId);

    List<Schedule> getScheduleForTeacher(Long semesterId, Long teacherId);

    List<Schedule> getAllSchedulesByTeacherIdAndSemesterId(Long teacherId, Long semesterId);

    Map<Room, List<Schedule>> getScheduleForRooms(Long semesterId);

    List<Schedule> getSchedulesBySemester(Long semesterId);


    List<Schedule> scheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId);

    void deleteSchedulesBySemesterId(Long semesterId);

    Schedule saveScheduleDuringCopy(Schedule schedule);

    Schedule updateWithoutChecks(Schedule schedule);

    Long countInputLessonsInScheduleByLessonId(Long lessonId);

    boolean isLessonInScheduleByLessonIdPeriodIdEvenOddDayOfWeek(Long lessonId, Long periodId, EvenOdd evenOdd, DayOfWeek day);

    void sendScheduleToTeachers(Long semesterId, Long[] teachersId, Locale language);

    void sendScheduleToTeacher(Long semesterId, Long teacherId, Locale language) throws MessagingException;
}

