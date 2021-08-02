package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class LessonsInScheduleDTO {
    private TeacherDTO teacher;
    private String linkToMeeting;
    private String subjectForSite;
    private String lessonType;
    private RoomForScheduleDTO room;
    @JsonProperty("temporary_schedule")
    private TemporaryScheduleDTOForDashboard temporaryScheduleDTO;

    @Override
    public int hashCode() {
        return (int) (teacher.hashCode() + subjectForSite.hashCode() + lessonType.hashCode() + room.getId());
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof LessonsInScheduleDTO)) {
            return false;
        }

        LessonsInScheduleDTO lesson = (LessonsInScheduleDTO) obj;

        return lesson.teacher.equals(teacher) &&
                lesson.subjectForSite.equals(subjectForSite) &&
                lesson.lessonType.equals(lessonType) &&
                lesson.room.equals(room);
    }
}
