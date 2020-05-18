package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ScheduleForTeacherDateRangeDTO {
    @JsonProperty(value = "class")
    private PeriodDTO period;
    private List<LessonTeacherDTO> lessons;
}
