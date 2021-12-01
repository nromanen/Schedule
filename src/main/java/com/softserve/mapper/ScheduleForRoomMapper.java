package com.softserve.mapper;

import com.softserve.dto.DaysOfWeekWithClassesForRoomDTO;
import com.softserve.dto.ScheduleForRoomDTO;

import com.softserve.dto.SchedulesAtDayOfWeek;
import com.softserve.dto.SchedulesInRoomDTO;
import com.softserve.entity.Room;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {RoomMapper.class})
public interface ScheduleForRoomMapper {

    List<ScheduleForRoomDTO> schedulesToScheduleForRoomDTO(List<SchedulesInRoomDTO> schedules);

    @Mapping(target = "room", source = "room", qualifiedBy = ToRoomDto.class)
    ScheduleForRoomDTO scheduleToScheduleForRoomDTO(SchedulesInRoomDTO schedules);


    List<DaysOfWeekWithClassesForRoomDTO> toDaysOfWeekWithClassesForRoomDTOS(List<SchedulesAtDayOfWeek> schedules);

    @Mapping(source = "dayOfWeek", target = "day")
    @Mapping(source = "schedules",target = "even", qualifiedBy = ToEven.class)
    @Mapping(source = "schedules", target = "odd", qualifiedBy = ToOdd.class)
    DaysOfWeekWithClassesForRoomDTO toDaysOfWeekWithClassesForRoomDTO(SchedulesAtDayOfWeek schedulesAtDayOfWeek);

}
