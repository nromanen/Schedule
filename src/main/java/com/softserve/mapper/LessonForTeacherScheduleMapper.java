package com.softserve.mapper;

import com.softserve.dto.LessonForTeacherScheduleDTO;
import com.softserve.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonForTeacherScheduleMapper {

    @Mapping(source = "lessonType", target = "lessonType")
    LessonForTeacherScheduleDTO lessonToLessonForTeacherScheduleDTO(Lesson lesson);
}
