package com.softserve.dto;

import com.softserve.entity.enums.Role;
import lombok.*;

@Getter
@Setter
@ToString
public class UserDTO {
    private Long id;
    private String email;
    private Role role;
}
