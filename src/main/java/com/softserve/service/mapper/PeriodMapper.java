package com.softserve.service.mapper;

import com.softserve.dto.PeriodDTO;
import com.softserve.dto.SimplePeriodDTO;
import com.softserve.entity.Period;

public interface PeriodMapper extends Mapper<Period, PeriodDTO> {
    Period convertToEntity(SimplePeriodDTO simpleDto);
}
