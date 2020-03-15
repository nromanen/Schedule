package com.softserve.service.mapper.impl;

import com.softserve.dto.CreateUserDTO;
import com.softserve.dto.UserDTO;
import com.softserve.entity.User;
import com.softserve.service.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class CreateUserMapper implements Mapper<User, CreateUserDTO> {

    ModelMapper modelMapper;

    @Autowired
    public CreateUserMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public User convertToEntity(CreateUserDTO dto) {
        return Objects.isNull(dto) ? null : modelMapper.map(dto, User.class);
    }

    @Override
    public CreateUserDTO convertToDto(User entity) {

        return Objects.isNull(entity) ? null : modelMapper.map(entity, CreateUserDTO.class);
    }
}
