package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.DayOfWeek;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class DaysOfWeekWithClassesForTeacherDTO {
    private DayOfWeek day;
    @JsonProperty("even")
    private ClassesInScheduleForTeacherDTO evenWeek;
    @JsonProperty("odd")
    private ClassesInScheduleForTeacherDTO oddWeek;
}
