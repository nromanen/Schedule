package com.softserve.service.mapper;

import com.softserve.dto.PeriodDTO;
import com.softserve.dto.AddPeriodDTO;
import com.softserve.entity.Period;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PeriodMapper {
    Period convertToEntity(AddPeriodDTO addPeriodDTO);

    PeriodDTO convertToDto(Period entity);

    Period convertToEntity(PeriodDTO dto);
}
