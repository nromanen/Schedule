package com.softserve.dto;

import com.softserve.entity.enums.LessonType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class LessonsInScheduleDTO {
    private String teacherForSite;
    private String subjectForSite;
    private String lessonType;
    private RoomForScheduleDTO room;
}
