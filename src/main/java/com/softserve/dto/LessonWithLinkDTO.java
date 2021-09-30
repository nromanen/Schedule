package com.softserve.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LessonWithLinkDTO {
    private Long semesterId;
    private Long teacherId;
    private String linkToMeeting;
    private Long subjectId;
    private String lessonType;

}
