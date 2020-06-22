package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ScheduleForTemporaryTeacherDateRangeDTO {
    @JsonProperty(value = "class")
    private List<LessonTemporaryTeacherDTO> lessons;
}
