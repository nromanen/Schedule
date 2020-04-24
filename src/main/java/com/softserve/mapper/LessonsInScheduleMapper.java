package com.softserve.mapper;

import com.softserve.dto.LessonsInScheduleDTO;
import com.softserve.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonsInScheduleMapper {

    @Mapping(source = "lessonType", target = "lessonType")
    LessonsInScheduleDTO lessonToLessonsInScheduleDTO(Lesson lesson);
}
