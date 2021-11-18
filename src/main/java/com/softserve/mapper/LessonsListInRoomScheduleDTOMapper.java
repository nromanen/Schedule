package com.softserve.mapper;

import com.softserve.dto.LessonsListInRoomScheduleDTO;
import com.softserve.entity.Lesson;
import com.softserve.entity.Schedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonsListInRoomScheduleDTOMapper {

    @Mapping(source = "lessonType", target = "lessonType")
    @Mapping(source = "teacher.surname", target = "surname")
    @Mapping(source = "subjectForSite", target = "subjectName")
    LessonsListInRoomScheduleDTO lessonToLessonsListInRoomScheduleDTO(Lesson lesson);
}
