package com.softserve.dto;

import lombok.*;

@Data
public class TeacherDTO {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private String position;
    private boolean disable;

}
