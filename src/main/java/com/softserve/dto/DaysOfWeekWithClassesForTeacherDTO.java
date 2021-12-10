package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.DayOfWeek;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class DaysOfWeekWithClassesForTeacherDTO {
    private DayOfWeek day;
    @JsonProperty("even")
    private List<ClassForTeacherScheduleDTO> even;
    @JsonProperty("odd")
    private List<ClassForTeacherScheduleDTO> odd;
}
