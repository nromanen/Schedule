package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.softserve.entity.*;
import com.softserve.entity.enums.LessonType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class TemporaryScheduleDTO {
    private Long id;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate date;

    private String teacherForSite;
    private String subjectForSite;
    private Teacher teacher;
    private LessonType lessonType;
    private Subject subject;
    private Group group;
    private Room room;
    private Period period;
    private boolean grouped;
    private boolean vacation;
}
