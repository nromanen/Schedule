package com.softserve.service;

import com.softserve.dto.CreateScheduleInfoDTO;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;

public interface ScheduleService extends BasicService<Schedule, Long> {
    CreateScheduleInfoDTO getInfoForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId);
    boolean isConflictForGroupInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId);
    boolean isTeacherAvailableForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId);
}
