package com.softserve.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherWithUserDTO extends TeacherBaseDTO {
    private Long userId;
}
