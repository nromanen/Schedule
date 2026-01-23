package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;
import java.time.DayOfWeek;

@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class DaysOfWeekWithClassesForTeacherDTO implements Serializable {
    private DayOfWeek day;
    @JsonProperty("even")
    private ClassesInScheduleForTeacherDTO evenWeek;
    @JsonProperty("odd")
    private ClassesInScheduleForTeacherDTO oddWeek;
}
