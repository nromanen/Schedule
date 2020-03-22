package com.softserve.dto;

import com.softserve.entity.Group;
import com.softserve.entity.Teacher;
import com.softserve.entity.enums.LessonType;
import lombok.Data;

@Data
public class LessonInfoDTO {
    private Long id;
    private int hours;
    private String teacherForSite;
    private String subjectForSite;
    private LessonType lessonType;
    private SubjectDTO subject;
    private GroupDTO group;
    private TeacherNameDTO teacher;

}
