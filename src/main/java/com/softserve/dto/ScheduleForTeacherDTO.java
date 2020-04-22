package com.softserve.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ScheduleForTeacherDTO {
    private TeacherDTO teacher;
    private List<DaysOfWeekWithClassesForTeacherDTO> days;
}
