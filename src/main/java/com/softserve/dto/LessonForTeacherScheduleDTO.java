package com.softserve.dto;

import com.softserve.entity.enums.LessonType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class LessonForTeacherScheduleDTO {
    //@EqualsAndHashCode.Exclude
    private Long id;
    private String teacherForSite;
    private String subjectForSite;
    private LessonType lessonType;
   // @EqualsAndHashCode.Exclude
    private GroupDTO group;
    private String room;
}
