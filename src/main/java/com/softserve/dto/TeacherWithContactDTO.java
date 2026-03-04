package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class TeacherWithContactDTO extends TeacherBaseDTO {
    private String email;
    @JsonProperty("department")
    private DepartmentDTO departmentDTO;
}
