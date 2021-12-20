package com.softserve.mapper;

import com.softserve.dto.LessonInfoDTO;
import com.softserve.dto.LessonsInRoomScheduleDTO;
import com.softserve.dto.LessonsInScheduleDTO;
import com.softserve.entity.Lesson;
import com.softserve.entity.Schedule;
import com.softserve.entity.TemporarySchedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonsInScheduleMapper {

    @Mapping(source = "lessonType", target = "lessonType")
    LessonsInScheduleDTO lessonToLessonsInScheduleDTO(Lesson lesson);

    LessonsInRoomScheduleDTO lessonToLessonsInRoomScheduleDTO(Lesson lesson);

    LessonInfoDTO lessonToLessonsInTemporaryScheduleDTO(Lesson lesson);
    LessonInfoDTO lessonToLessonsInTemporaryScheduleDTO(TemporarySchedule temporarySchedule);

}
