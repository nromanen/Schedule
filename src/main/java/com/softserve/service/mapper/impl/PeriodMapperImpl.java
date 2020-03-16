package com.softserve.service.mapper.impl;

import com.softserve.dto.PeriodDTO;
import com.softserve.dto.AddPeriodDTO;
import com.softserve.entity.Period;
import com.softserve.service.mapper.PeriodMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class PeriodMapperImpl implements PeriodMapper {

    ModelMapper modelMapper;

    @Autowired
    public PeriodMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public Period convertToEntity(PeriodDTO dto) {
        return Objects.isNull(dto) ? null : modelMapper.map(dto, Period.class);
    }

    @Override
    public PeriodDTO convertToDto(Period entity) {
        return Objects.isNull(entity) ? null : modelMapper.map(entity, PeriodDTO.class);
    }

    @Override
    public Period convertToEntity(AddPeriodDTO addPeriodDTO) {
        return Objects.isNull(addPeriodDTO) ? null : modelMapper.map(addPeriodDTO, Period.class);
    }
}
