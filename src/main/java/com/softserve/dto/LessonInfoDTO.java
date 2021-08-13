package com.softserve.dto;

import com.softserve.entity.enums.LessonType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class LessonInfoDTO {
    private Long id;
    private int hours;
    private SemesterDTO semester;
    private String linkToMeeting;
    private String subjectForSite;
    private LessonType lessonType;
    private SubjectDTO subject;
    private GroupDTO group;
    private TeacherDTO teacher;
    private boolean grouped;
}
