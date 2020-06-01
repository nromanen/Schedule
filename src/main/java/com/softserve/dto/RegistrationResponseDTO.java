package com.softserve.dto;

import com.softserve.entity.enums.Role;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegistrationResponseDTO {
    private String email;
    private Role role;
}
