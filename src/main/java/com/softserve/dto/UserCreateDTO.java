package com.softserve.dto;

import lombok.*;


@Getter
@Setter
@ToString
public class UserCreateDTO {

    private Long id;
    private String email;
    private String password;
}
