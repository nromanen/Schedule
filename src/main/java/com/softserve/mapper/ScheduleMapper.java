package com.softserve.mapper;

import com.softserve.dto.ScheduleDTO;
import com.softserve.entity.Schedule;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {
    ScheduleDTO scheduleToScheduleDTO(Schedule schedule);
    Schedule scheduleDTOToSchedule(ScheduleDTO scheduleDTO);

    List<ScheduleDTO> scheduleToScheduleDTOs(List<Schedule> schedules);
}
