package com.softserve.service;

import com.softserve.dto.CreateScheduleInfoDTO;
import com.softserve.dto.ScheduleForGroupDTO;
import com.softserve.dto.ScheduleForTeacherDTO;
import com.softserve.dto.ScheduleFullDTO;
import com.softserve.entity.Period;
import com.softserve.entity.Room;
import com.softserve.entity.Schedule;
import com.softserve.entity.TemporarySchedule;
import com.softserve.entity.enums.EvenOdd;

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

    List<ScheduleForGroupDTO> getFullScheduleForGroup(Long semesterId, Long groupId);

    ScheduleFullDTO getFullScheduleForSemester(Long semesterId);

    ScheduleForTeacherDTO getScheduleForTeacher(Long semesterId, Long teacherId);

    List<Schedule> getAllSchedulesByTeacherIdAndSemesterId(Long teacherId, Long semesterId);

    List<Schedule> getSchedulesBySemester(Long semesterId);

    Map<LocalDate, Map<Period, Map<Schedule, TemporarySchedule>>> temporaryScheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate,
                                                                                                         Long teacherId);

    void deleteSchedulesBySemesterId(Long semesterId);

    Schedule saveScheduleDuringCopy(Schedule schedule);

    Schedule updateWithoutChecks(Schedule schedule);

    Long countInputLessonsInScheduleByLessonId(Long lessonId);

    boolean isLessonInScheduleByLessonIdPeriodIdEvenOddDayOfWeek(Long lessonId, Long periodId, EvenOdd evenOdd, DayOfWeek day);

    void sendScheduleToTeachers(Long semesterId, Long[] teachersId, Locale language);

    void sendScheduleToTeacher(Long semesterId, Long teacherId, Locale language) throws MessagingException;

    Map<Room, List<Schedule>> getAllOrdered(Long semesterId);
}

