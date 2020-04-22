package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ClassesInScheduleForGroupDTO {
        @JsonProperty("class")
        private PeriodDTO period;
        private LessonInScheduleByWeekDTO weeks;
}
