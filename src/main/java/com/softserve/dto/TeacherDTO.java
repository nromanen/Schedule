package com.softserve.dto;

import lombok.Data;

@Data
public class TeacherDTO {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private String position;
    private String email;
    private DepartmentDTO departmentDTO;
    private boolean disable;
}
