package com.softserve.service;

import com.softserve.dto.CreateScheduleInfoDTO;
import com.softserve.dto.ScheduleForGroupDTO;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;
import java.util.List;

public interface ScheduleService extends BasicService<Schedule, Long> {
    CreateScheduleInfoDTO getInfoForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId);
    List<ScheduleForGroupDTO> getFullSchedule(Long semesterId, Long groupId);

    List<ScheduleForGroupDTO> getScheduleForTeacher(Long semesterId, Long teacherId);
}
