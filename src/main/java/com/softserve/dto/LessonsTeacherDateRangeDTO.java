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
public class LessonsTeacherDateRangeDTO {
    @JsonProperty(value = "subject_for_site")
    private String subjectForSite;
    @JsonProperty(value = "group_name")
    private String groupName;
    private RoomForScheduleDTO room;
}
