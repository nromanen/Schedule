package com.softserve.repository;

import com.softserve.entity.Room;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends BasicRepository<Schedule, Long> {
   Long conflictForGroupInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long groupId);
   Long conflictForTeacherInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long teacherId);
   List<Room> getNotAvailableRooms(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);
   List<Room> getAvailableRooms(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);
}
