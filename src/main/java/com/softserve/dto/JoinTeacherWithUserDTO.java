package com.softserve.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinTeacherWithUserDTO {
    private long teacherId;
    private long userId;
}
