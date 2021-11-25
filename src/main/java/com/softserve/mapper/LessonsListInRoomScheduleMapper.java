package com.softserve.mapper;

import com.softserve.dto.LessonsInRoomScheduleDTO;
import com.softserve.dto.LessonsListInRoomScheduleDTO;
import com.softserve.entity.Lesson;
import com.softserve.entity.Schedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = GroupMapper.class)
public interface LessonsListInRoomScheduleMapper {

    @Mapping(source = "lessonType", target = "lessonType")
    @Mapping(source = "teacher.surname", target = "surname")
    @Mapping(source = "subjectForSite", target = "subjectName")
    @Mapping(source = "group",target = "group", qualifiedBy = ToGroupInRoom.class)
    LessonsListInRoomScheduleDTO lessonToLessonsListInRoomScheduleDTO(Lesson lesson);

    @Mapping(source = "period.id", target = "classId")
    @Mapping(source = "period.name", target = "className")
    @Mapping(target = "lessons",
            expression = "java(lessonToLessonsListInRoomScheduleDTO(schedule.getLesson()))")
    LessonsInRoomScheduleDTO scheduleToLessonsInRoomScheduleDTO(Schedule schedule);

    List<LessonsInRoomScheduleDTO> toLessonsInRoomScheduleDTO(List<Schedule> schedules);
}
