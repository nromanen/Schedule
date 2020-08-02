package com.softserve.service;

import com.softserve.dto.*;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.LessonType;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface ScheduleService extends BasicService<Schedule, Long> {
    CreateScheduleInfoDTO getInfoForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId);

    List<ScheduleForGroupDTO> getFullScheduleForGroup(Long semesterId, Long groupId);

    ScheduleFullDTO getFullScheduleForSemester(Long semesterId);

    ScheduleForTeacherDTO getScheduleForTeacher(Long semesterId, Long teacherId);

    List<Schedule> getAllSchedulesByTeacherIdAndSemesterId(Long teacherId, Long semesterId);

    Map<Room, Map<DayOfWeek, Map<EvenOdd, Map<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>>>>> getScheduleForRooms(Long semesterId);

    List<Schedule> getSchedulesBySemester(Long semesterId);

    //Map<LocalDate, Map<Period, List<Schedule>>> scheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId);
    Map<LocalDate, Map<Period, Map<Schedule, TemporarySchedule>>>  temporaryScheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId);

    void deleteSchedulesBySemesterId(Long semesterId);

    Schedule saveScheduleDuringCopy(Schedule schedule);

    Schedule updateWithoutChecks(Schedule schedule);

    Long countInputLessonsInScheduleByLessonId(Long lessonId);

    boolean isLessonInScheduleByLessonIdPeriodIdEvenOddDayOfWeek(Long lessonId, Long periodId, EvenOdd evenOdd, DayOfWeek day);
}

