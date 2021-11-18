package com.softserve.mapper;

import com.softserve.dto.LessonsInRoomScheduleDTO;
import com.softserve.entity.Schedule;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",
        uses = {LessonsListInRoomScheduleDTOMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface LessonsInRoomScheduleDTOMapper {

    @Mapping(source = "period.id", target = "classId")
    @Mapping(source = "period.name", target = "className")
    @Mapping(target = "lessons",
            expression = "java(lessonsListInRoomScheduleDTOMapper.lessonToLessonsListInRoomScheduleDTO(schedule.getLesson()))")
    LessonsInRoomScheduleDTO scheduleToLessonsInRoomScheduleDTO(Schedule schedule);
}
