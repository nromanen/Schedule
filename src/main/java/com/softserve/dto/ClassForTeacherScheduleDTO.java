package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.softserve.entity.Lesson;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class ClassForTeacherScheduleDTO {
    @JsonProperty("class")
    private PeriodDTO period;
    private List<LessonForTeacherScheduleDTO> lessons;
}
