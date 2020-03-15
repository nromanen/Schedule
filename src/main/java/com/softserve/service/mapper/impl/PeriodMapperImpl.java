package com.softserve.service.mapper.impl;

import com.softserve.dto.PeriodDTO;
import com.softserve.dto.SimplePeriodDTO;
import com.softserve.entity.Period;
import com.softserve.service.mapper.PeriodMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PeriodMapperImpl implements PeriodMapper {

    ModelMapper modelMapper;

    @Autowired
    public PeriodMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public Period convertToEntity(PeriodDTO dto) {
        return modelMapper.map(dto, Period.class);
    }

    @Override
    public PeriodDTO convertToDto(Period entity) {
        return modelMapper.map(entity, PeriodDTO.class);
    }

    @Override
    public Period convertToEntity(SimplePeriodDTO simpleDto) {
        return modelMapper.map(simpleDto, Period.class);
    }
}
