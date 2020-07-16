package com.softserve.mapper;

import com.softserve.dto.TemporaryScheduleDTO;
import com.softserve.dto.TemporaryScheduleDTOForDashboard;
import com.softserve.dto.TemporaryScheduleForArchiveDTO;
import com.softserve.dto.TemporaryScheduleSaveDTO;
import com.softserve.entity.TemporarySchedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;


@Mapper(componentModel = "spring")
public interface TemporaryScheduleMapper {

    @Mapping(source = "schedule.id", target = "scheduleId")
    TemporarySchedule convertToEntity(TemporaryScheduleSaveDTO dto);
    TemporaryScheduleDTO convertToDto(TemporarySchedule entity);
    TemporaryScheduleDTOForDashboard convertToDtoForDashboard(TemporarySchedule entity);

    @Named("temporary_schedule")
    List<TemporaryScheduleDTO> convertToDtoList(List<TemporarySchedule> schedules);

    @Named("temporary_schedule_for_archive")
    List<TemporaryScheduleForArchiveDTO> convertToNewDtoList(List<TemporarySchedule> schedules);
}
