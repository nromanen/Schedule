package com.softserve.mapper;

import com.softserve.dto.LessonInfoDTO;
import com.softserve.dto.LessonsInScheduleDTO;
import com.softserve.dto.TeacherBaseDTO;
import com.softserve.entity.Lesson;
import com.softserve.entity.Teacher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = TeacherMapper.class)
public interface LessonsInScheduleMapper {

    @Mapping(target = "room", ignore = true)
    @Mapping(target = "temporaryScheduleDTO", ignore = true)
    LessonsInScheduleDTO lessonToLessonsInScheduleDTO(Lesson lesson);

    @Mapping(source = "semester.id", target = "semesterId")
    LessonInfoDTO lessonToLessonsInTemporaryScheduleDTO(Lesson lesson);

    TeacherBaseDTO teacherToTeacherBaseDTO(Teacher teacher);
}
