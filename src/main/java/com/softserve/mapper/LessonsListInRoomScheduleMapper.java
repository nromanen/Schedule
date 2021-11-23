package com.softserve.mapper;

import com.softserve.dto.LessonsInRoomScheduleDTO;
import com.softserve.dto.LessonsListInRoomScheduleDTO;
import com.softserve.entity.Lesson;
import com.softserve.entity.Schedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class LessonsListInRoomScheduleMapper {

    protected GroupMapper groupMapper;

    public LessonsListInRoomScheduleMapper() {}

    @Autowired
    public void setGroupMapper(GroupMapper groupMapper) {
        this.groupMapper = groupMapper;
    }

    @Mapping(source = "lessonType", target = "lessonType")
    @Mapping(source = "teacher.surname", target = "surname")
    @Mapping(source = "subjectForSite", target = "subjectName")
    @Mapping(target = "groups", expression = "java(groupMapper.toGroupDTOInRoomSchedule(List.of(lesson.getGroup())))")
    public abstract LessonsListInRoomScheduleDTO lessonToLessonsListInRoomScheduleDTO(Lesson lesson);

    @Mapping(source = "period.id", target = "classId")
    @Mapping(source = "period.name", target = "className")
    @Mapping(target = "lessons",
            expression = "java(lessonToLessonsListInRoomScheduleDTO(schedule.getLesson()))")
    public abstract LessonsInRoomScheduleDTO scheduleToLessonsInRoomScheduleDTO(Schedule schedule);

    public abstract List<LessonsInRoomScheduleDTO> toLessonsInRoomScheduleDTO(List<Schedule> schedules);
}
