package com.softserve.mapper;

import com.softserve.dto.SchedulesAtDayOfWeek;
import com.softserve.dto.SchedulesInRoomDTO;
import com.softserve.entity.Room;
import com.softserve.entity.Schedule;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ConverterToSchedulesInRoom {
    public static List<SchedulesInRoomDTO> convertToSchedulesInRoom(Map<Room, List<Schedule>> schedules) {
        List<SchedulesInRoomDTO> schedulesInRoomDTOS = new ArrayList<>();
        for (Room room: schedules.keySet()) {
            SchedulesInRoomDTO schedulesInRoomDTO = new SchedulesInRoomDTO();
            schedulesInRoomDTO.setRoom(room);
            List<SchedulesAtDayOfWeek> schedulesAtDayOfWeeks = new ArrayList<>();
            for (DayOfWeek day: schedules.get(room).get(0).getLesson().getSemester().getDaysOfWeek()) {
                SchedulesAtDayOfWeek schedulesAtDayOfWeek = new SchedulesAtDayOfWeek();
                schedulesAtDayOfWeek.setDayOfWeek(day);
                schedulesAtDayOfWeek.setSchedules(
                        schedules.get(room).stream()
                                .filter(s->s.getDayOfWeek().equals(day))
                                .collect(Collectors.toList())
                );
                schedulesAtDayOfWeeks.add(schedulesAtDayOfWeek);
            }
            schedulesInRoomDTO.setSchedules(schedulesAtDayOfWeeks);
            schedulesInRoomDTOS.add(schedulesInRoomDTO);
        }
        return schedulesInRoomDTOS;
    }
}
