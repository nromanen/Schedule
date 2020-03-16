package com.softserve.service.mapper;

import com.softserve.dto.PeriodDTO;
import com.softserve.dto.AddPeriodDTO;
import com.softserve.entity.Period;

public interface PeriodMapper extends Mapper<Period, PeriodDTO> {
    Period convertToEntity(AddPeriodDTO addPeriodDTO);
}
