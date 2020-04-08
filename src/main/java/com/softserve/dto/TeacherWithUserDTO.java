package com.softserve.dto;

import lombok.Data;

@Data
public class TeacherWithUserDTO {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private String position;
    private Integer userId;
}
