package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
public class LessonsInRoomScheduleDTO {
    @JsonProperty("class_id")
    private Long classId;

    @JsonProperty("class_name")
    private String className;

    private List<GroupDTOInRoomSchedule> groups;

    @JsonProperty("lesson_id")
    private Long lessonId;

    @JsonProperty("subject")
    private String subjectName;

    @JsonProperty("lesson_type")
    private String lessonType;

    private String surname;

}
