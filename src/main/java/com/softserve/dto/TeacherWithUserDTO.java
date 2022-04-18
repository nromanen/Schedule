package com.softserve.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherWithUserDTO {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private String position;
    private Long userId;
}
