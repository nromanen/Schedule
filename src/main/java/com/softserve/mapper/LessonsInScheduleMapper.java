package com.softserve.mapper;

import com.softserve.dto.LessonInfoDTO;
import com.softserve.dto.LessonsInRoomScheduleDTO;
import com.softserve.dto.LessonsInScheduleDTO;
import com.softserve.entity.Lesson;
import com.softserve.entity.TemporarySchedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonsInScheduleMapper {

    @Mapping(source = "lessonType", target = "lessonType")
    @Mapping(source = "teacher.id", target = "teacherId")
    @Mapping(target = "teacherForSite",
            expression = "java(" +
                    " org.apache.commons.lang3.StringUtils.join(" +
                    "lesson.getTeacher().getPosition()" +
                    ", \" \"," +
                    "lesson.getTeacher().getSurname()" +
                    ", \" \"," +
                    "lesson.getTeacher().getName().substring(0, 1)" +
                    ", \". \"" +
                    ", lesson.getTeacher().getPatronymic().substring(0, 1)" +
                    ", \". \"" +
                    ")" +
                    ")")
    LessonsInScheduleDTO lessonToLessonsInScheduleDTO(Lesson lesson);

    LessonsInRoomScheduleDTO lessonToLessonsInRoomScheduleDTO(Lesson lesson);

    LessonInfoDTO lessonToLessonsInTemporaryScheduleDTO(Lesson lesson);
    LessonInfoDTO lessonToLessonsInTemporaryScheduleDTO(TemporarySchedule temporarySchedule);




}
