package com.softserve.mapper;

import com.softserve.dto.TemporaryScheduleDTO;
import com.softserve.dto.TemporaryScheduleSaveDTO;
import com.softserve.entity.TemporarySchedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;


@Mapper(componentModel = "spring")
public interface TemporaryScheduleMapper {

    @Mapping(source = "schedule.id", target = "scheduleId")
    TemporarySchedule convertToEntity(TemporaryScheduleSaveDTO dto);

    //@Mapping(target = "lesson.id", source = "lessonId")
    TemporaryScheduleDTO convertToDto(TemporarySchedule entity);

    List<TemporaryScheduleDTO> convertToDtoList(List<TemporarySchedule> schedules);
}
