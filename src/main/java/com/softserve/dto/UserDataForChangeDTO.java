package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDataForChangeDTO {
    @JsonProperty(value = "teacher_name")
    private String teacherName;
    @JsonProperty(value = "teacher_surname")
    private String teacherSurname;
    @JsonProperty(value = "teacher_patronymic")
    private String teacherPatronymic;
    @JsonProperty(value = "teacher_position")
    private String teacherPosition;
    @JsonProperty(value = "current_password")
    private String currentPassword;
    @JsonProperty(value = "new_password")
    private String newPassword;
}
