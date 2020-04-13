package com.softserve.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.DayOfWeek;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class DaysOfWeekWithClassesDTO {
    private DayOfWeek day;
    private List<ClassesInScheduleDTO> classes;
}
