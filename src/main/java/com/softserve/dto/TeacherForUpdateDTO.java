package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TeacherForUpdateDTO {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private String position;
    private String email;
    @JsonProperty("department")
    private DepartmentDTO departmentDTO;
    private boolean disable;
}
