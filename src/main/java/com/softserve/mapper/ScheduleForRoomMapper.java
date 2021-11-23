package com.softserve.mapper;

import com.softserve.dto.DaysOfWeekWithClassesForRoomDTO;
import com.softserve.dto.ScheduleForRoomDTO;

import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class ScheduleForRoomMapper {

    private LessonsListInRoomScheduleMapper lessonsMapper;
    private RoomMapper roomMapper;

    public ScheduleForRoomMapper() {}

    @Autowired
    public void setLessonsMapper(LessonsListInRoomScheduleMapper lessonsMapper) {
        this.lessonsMapper = lessonsMapper;
    }

    @Autowired
    public void setRoomMapper(RoomMapper roomMapper) {
        this.roomMapper = roomMapper;
    }

    public abstract List<ScheduleForRoomDTO> schedulesToScheduleForRoomDTO(List<List<Schedule>> schedules);

    public ScheduleForRoomDTO scheduleToScheduleForRoomDTO(List<Schedule> schedules){
        ScheduleForRoomDTO scheduleForRoomDTO = new ScheduleForRoomDTO();

        scheduleForRoomDTO.setRoom(roomMapper.convertToDto(schedules.get(0).getRoom()));

        Set<DayOfWeek> dayOfWeeks = schedules.get(0).getLesson().getSemester().getDaysOfWeek();

        List<DaysOfWeekWithClassesForRoomDTO> list = new ArrayList<>();

        for (DayOfWeek dayOfWeek: dayOfWeeks) {
            list.add(toDaysOfWeekWithClassesForRoomDTO(schedules, dayOfWeek));
        }

        scheduleForRoomDTO.setSchedules(list);

        return scheduleForRoomDTO;
    }

    public DaysOfWeekWithClassesForRoomDTO toDaysOfWeekWithClassesForRoomDTO(List<Schedule> schedules,
                                                                              DayOfWeek dayName) {

        DaysOfWeekWithClassesForRoomDTO daysOfWeekWithClassesForRoomDTO = new DaysOfWeekWithClassesForRoomDTO();
        daysOfWeekWithClassesForRoomDTO.setDay(dayName);

        Map<Boolean, List<Schedule>> mapEven =
                schedules.stream()
                        .filter(Objects::nonNull)
                        .filter(s -> s.getDayOfWeek().equals(dayName))
                        .collect(Collectors.partitioningBy(x-> x.getEvenOdd().equals(EvenOdd.EVEN)));

        daysOfWeekWithClassesForRoomDTO.setEven(lessonsMapper.toLessonsInRoomScheduleDTO(mapEven.get(Boolean.TRUE)));
        daysOfWeekWithClassesForRoomDTO.setOdd(lessonsMapper.toLessonsInRoomScheduleDTO(mapEven.get(Boolean.FALSE)));
        return daysOfWeekWithClassesForRoomDTO;
    }

}
