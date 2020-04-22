package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class ClassesInScheduleForTeacherDTO {
    @JsonProperty("classes")
    private List<ClassForTeacherScheduleDTO> periods;
}
