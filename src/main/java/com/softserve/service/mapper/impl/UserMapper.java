package com.softserve.service.mapper.impl;

import com.softserve.dto.UserDTO;
import com.softserve.entity.User;
import com.softserve.service.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Component
public class UserMapper implements Mapper<User, UserDTO> {

    ModelMapper modelMapper;

    @Autowired
    public UserMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public User convertToEntity(UserDTO dto) {
        return Objects.isNull(dto) ? null : modelMapper.map(dto, User.class);
    }

    @Override
    public UserDTO convertToDto(User entity) {

        return Objects.isNull(entity) ? null : modelMapper.map(entity, UserDTO.class);
    }
}
