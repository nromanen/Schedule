package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class ClassesInScheduleForGroupDTO {
    @JsonProperty("class")
    private PeriodDTO period;
    private LessonsInScheduleDTO even;
    private LessonsInScheduleDTO odd;
}
