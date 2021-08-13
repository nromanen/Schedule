package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDataDTO {
    @JsonProperty(value = "id")
    private Long teacherId;
    @JsonProperty(value = "name")
    private String teacherName;
    @JsonProperty(value = "surname")
    private String teacherSurname;
    @JsonProperty(value = "patronymic")
    private String teacherPatronymic;
    @JsonProperty(value = "position")
    private String teacherPosition;
    @JsonProperty(value = "department")
    private DepartmentDTO teacherDepartmentDTO;
}
