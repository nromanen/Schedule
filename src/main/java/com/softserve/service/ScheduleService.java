package com.softserve.service;

import com.softserve.dto.CreateScheduleInfoDTO;
import com.softserve.dto.ScheduleForRoomDTO;
import com.softserve.dto.ScheduleForGroupDTO;
import com.softserve.dto.ScheduleForTeacherDTO;
import com.softserve.dto.ScheduleFullDTO;
import com.softserve.entity.Period;
import com.softserve.entity.Schedule;
import com.softserve.entity.Semester;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ScheduleService extends BasicService<Schedule, Long> {
    CreateScheduleInfoDTO getInfoForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId);

    List<ScheduleForGroupDTO> getFullScheduleForGroup(Long semesterId, Long groupId);

    ScheduleFullDTO getFullScheduleForSemester(Long semesterId);

    ScheduleForTeacherDTO getScheduleForTeacher(Long semesterId, Long teacherId);

    List<Schedule> getAllSchedulesByTeacherIdAndSemesterId(Long teacherId, Long semesterId);

    List<ScheduleForRoomDTO> getScheduleForRooms(Long semesterId);

    List<Schedule> getSchedulesBySemester(Long semesterId);

    Map<LocalDate, Map<Period, List<Schedule>>> scheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId);

    List<Schedule> copyScheduleFromOneToAnotherSemester(List<Schedule> schedules, Semester toSemester);
}

