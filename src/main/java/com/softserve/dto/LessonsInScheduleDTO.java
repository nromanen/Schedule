package com.softserve.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class LessonsInScheduleDTO {
    private String teacherForSite;
    private String subjectForSite;
    private String lessonType;
    private RoomForScheduleDTO room;

    @Override
    public int hashCode() {
        return (int) (teacherForSite.hashCode() + subjectForSite.hashCode() + lessonType.hashCode() + room.getId());
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

        return lesson.teacherForSite.equals(teacherForSite) &&
                lesson.subjectForSite.equals(subjectForSite) &&
                lesson.lessonType.equals(lessonType) &&
                lesson.room.equals(room);
    }
}
