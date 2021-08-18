package com.softserve.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class LessonInfoDTO extends LessonBaseDTO{
    private GroupDTO group;
    private TeacherDTO teacher;
    private boolean grouped;
}
