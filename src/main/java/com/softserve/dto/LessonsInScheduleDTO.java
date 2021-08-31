package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class LessonsInScheduleDTO {
    private TeacherDTO teacher;
    @EqualsAndHashCode.Exclude
    private String linkToMeeting;
    private String subjectForSite;
    private String lessonType;
    private RoomForScheduleDTO room;
    @EqualsAndHashCode.Exclude
    @JsonProperty("temporary_schedule")
    private TemporaryScheduleDTOForDashboard temporaryScheduleDTO;
}
