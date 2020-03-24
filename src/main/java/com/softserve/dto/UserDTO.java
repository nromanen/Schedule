package com.softserve.dto;

import com.softserve.entity.enums.Role;
import lombok.*;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private Role role;
}
