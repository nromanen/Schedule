package com.softserve.mapper;

import com.softserve.dto.LessonsInRoomScheduleDTO;
import com.softserve.dto.LessonsListInRoomScheduleDTO;
import com.softserve.entity.Lesson;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.DayOfWeek;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = GroupMapper.class)
public interface LessonsListInRoomScheduleMapper {

    @Mapping(source = "lessonType", target = "lessonType")
    @Mapping(source = "teacher.surname", target = "surname")
    @Mapping(source = "subjectForSite", target = "subjectName")
    @Mapping(source = "group", target = "group", qualifiedBy = ToGroupInRoom.class)
    LessonsListInRoomScheduleDTO lessonToLessonsListInRoomScheduleDTO(Lesson lesson);

    @Mapping(source = "period.id", target = "classId")
    @Mapping(source = "period.name", target = "className")
    @Mapping(target = "lessons",
            source = "schedule.lesson")
    LessonsInRoomScheduleDTO scheduleToLessonsInRoomScheduleDTO(Schedule schedule);

    @ToList
    List<LessonsInRoomScheduleDTO> toLessonsInRoomScheduleDTO(List<Schedule> schedules);

    @ToOdd
    default List<LessonsInRoomScheduleDTO> toOddLessons(List<Schedule> schedules) {
        return toEvenOddLessons(schedules, false);
    }

    @ToEven
    default List<LessonsInRoomScheduleDTO> toEvenLessons(List<Schedule> schedules) {
       return toEvenOddLessons(schedules, true);
    }

    default List<LessonsInRoomScheduleDTO> toEvenOddLessons(List<Schedule> schedules, boolean isEven) {
        List<Schedule> odd = schedules.stream()
                .collect(Collectors.partitioningBy(x-> x.getEvenOdd().equals(EvenOdd.EVEN)))
                .get(isEven);
        return toLessonsInRoomScheduleDTO(odd);
    }
}
