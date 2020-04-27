package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class LessonsInRoomScheduleDTO {
    @JsonProperty("class_id")
    private Long classId;

    @JsonProperty("class_name")
    private String className;

    @JsonProperty("group_id")
    private Long groupId;

    @JsonProperty("group_name")
    private String groupName;

    @JsonProperty("lesson_id")
    private Long lessonId;

    @JsonProperty("subject")
    private String subjectName;

    @JsonProperty("lesson_type")
    private String lessonType;

    private String surname;

}
