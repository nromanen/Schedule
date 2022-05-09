package com.softserve.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class TeacherNameDTO {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
}
