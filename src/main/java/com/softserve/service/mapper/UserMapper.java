package com.softserve.service.mapper;

import com.softserve.dto.UserDTO;
import com.softserve.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toUserDTO(User user);

    List<UserDTO> toUserDTOs(List<User> users);

}
