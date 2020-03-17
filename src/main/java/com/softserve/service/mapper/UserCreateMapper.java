package com.softserve.service.mapper;

import com.softserve.dto.UserCreateDTO;
import com.softserve.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserCreateMapper {
    User toUser(UserCreateDTO userCreateDTO);
}
