package com.softserve.service.mapper;

import com.softserve.dto.PeriodDTO;
import com.softserve.dto.AddPeriodDTO;
import com.softserve.entity.Period;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PeriodMapper {

    @Mapping(target = "name", source = "class_name")
    Period convertToEntity(AddPeriodDTO addPeriodDTO);

    @Mapping(target = "class_name", source = "name")
    PeriodDTO convertToDto(Period entity);

    @Mapping(target = "name", source = "class_name")
    Period convertToEntity(PeriodDTO dto);
}
