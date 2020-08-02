package com.softserve.dto;

import com.softserve.entity.enums.LessonType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class GroupedLessonInfoDTO {
    private Long id;
    private int hours;
    private SemesterDTO semester;
    private String teacherForSite;
    private String subjectForSite;
    private LessonType lessonType;
    private SubjectDTO subject;
    private List<GroupDTO> groups;
    private TeacherNameDTO teacher;
    private boolean grouped;
}
