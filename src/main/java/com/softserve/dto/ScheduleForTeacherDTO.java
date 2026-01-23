package com.softserve.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class ScheduleForTeacherDTO implements Serializable {
    private SemesterDTO semester;
    private TeacherDTO teacher;
    private List<DaysOfWeekWithClassesForTeacherDTO> days;
}
