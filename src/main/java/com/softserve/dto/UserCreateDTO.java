package com.softserve.dto;

import lombok.*;


@Data
public class UserCreateDTO {

    private Long id;
    private String email;
    private String password;
}
