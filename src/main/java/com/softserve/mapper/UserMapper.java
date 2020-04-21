package com.softserve.mapper;

import com.softserve.dto.RegistrationRequestDTO;
import com.softserve.dto.UserCreateDTO;
import com.softserve.dto.UserDTO;
import com.softserve.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toUserDTO(User user);
    User toUser(UserDTO userDTO);

    User toCreateUser(RegistrationRequestDTO registrationDTO);
    List<UserDTO> toUserDTOs(List<User> users);

    User toUser(UserCreateDTO userCreateDTO);
    UserCreateDTO toUserCreateDTO(User user);

}
