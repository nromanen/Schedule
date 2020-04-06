package com.softserve.service.mapper;

import com.softserve.dto.ScheduleSaveDTO;
import com.softserve.entity.Schedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ScheduleSaveMapper {

    @Mapping(source = "semester.id", target = "semesterId")
    @Mapping(source = "room.id", target = "roomId")
    @Mapping(source = "period.id", target = "periodId")
    @Mapping(source = "dayOfWeek", target = "dayOfWeek")
    @Mapping(source = "evenOdd", target = "evenOdd")
    @Mapping(source = "lesson.id", target = "lessonId")
    ScheduleSaveDTO scheduleToScheduleSaveDTO(Schedule schedule);

    @Mapping(source = "semesterId", target = "semester.id")
    @Mapping(source = "roomId", target = "room.id")
    @Mapping(source = "periodId", target = "period.id")
    @Mapping(source = "dayOfWeek", target = "dayOfWeek")
    @Mapping(source = "evenOdd", target = "evenOdd")
    @Mapping(source = "lessonId", target = "lesson.id")
    Schedule scheduleSaveDTOToSchedule(ScheduleSaveDTO scheduleSaveDTO);
}
