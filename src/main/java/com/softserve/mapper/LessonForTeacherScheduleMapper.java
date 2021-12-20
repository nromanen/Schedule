package com.softserve.mapper;

import com.softserve.dto.LessonForTeacherScheduleDTO;
import com.softserve.entity.Lesson;
import com.softserve.entity.Schedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {GroupMapper.class})
public interface LessonForTeacherScheduleMapper {

    List<LessonForTeacherScheduleDTO> lessonsToLessonForTeacherScheduleDTOs(List<Schedule> lessons);

    @Mapping(source = "lesson.lessonType", target = "lessonType")
    @Mapping(source = "lesson.id", target = "id")
    @Mapping(source = "lesson.linkToMeeting", target = "linkToMeeting")
    @Mapping(source = "lesson.subjectForSite", target = "subjectForSite")
    @Mapping(source = "lesson.group", target = "group")
    @Mapping(source = "room.name", target = "room")
    LessonForTeacherScheduleDTO lessonToLessonForTeacherScheduleDTO(Schedule lesson);
}
