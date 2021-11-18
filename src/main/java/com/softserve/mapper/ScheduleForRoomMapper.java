package com.softserve.mapper;

import com.softserve.dto.*;
import com.softserve.entity.Lesson;
import com.softserve.entity.Room;
import com.softserve.entity.RoomType;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.BiPredicate;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class ScheduleForRoomMapper {

    private GroupMapper groupMapper;
    private LessonsListInRoomScheduleDTOMapper lessonsMapper;

    @Autowired
    public ScheduleForRoomMapper(GroupMapper groupMapper, LessonsListInRoomScheduleDTOMapper lessonsMapper) {
        this.groupMapper = groupMapper;
        this.lessonsMapper = lessonsMapper;
    }

    List<ScheduleForRoomDTO> schedulesToScheduleForRoomDTO(List<Schedule> schedules){
        List<ScheduleForRoomDTO> scheduleDTOs = new ArrayList<>();
        Collection<List<Schedule>> groupedSchedules =
                schedules.stream()
                        .collect(Collectors.groupingBy(Schedule::getRoom, Collectors.toList()))
                        .values();

        for (List<Schedule> schedule: groupedSchedules) {
            scheduleDTOs.add(scheduleToScheduleForRoomDTO(schedule, (s, id) -> s.getRoom().getId() == id,
                    schedule.get(0).getRoom().getId()));
        }
        return  scheduleDTOs;
    }

    ScheduleForRoomDTO scheduleToScheduleForRoomDTO(List<Schedule> schedules,
                                                            BiPredicate<Schedule, Long> predicate,
                                                            Long id){
        ScheduleForRoomDTO scheduleForRoomDTO = new ScheduleForRoomDTO();

        List<Schedule> schedulesForRoom = schedules.stream()
                .filter(schedule -> predicate.test(schedule, id))
                .collect(Collectors.toList());

        //TODO RoomMapper
        Room room =  schedulesForRoom.get(0).getRoom();
        scheduleForRoomDTO.setRoomId(room.getId());
        scheduleForRoomDTO.setRoomType(room.getName());
        scheduleForRoomDTO.setRoomType(room.getType().toString());

        List<DaysOfWeekWithClassesForRoomDTO> list = new ArrayList<>();

        for (DayOfWeek dayOfWeek: DayOfWeek.values()) {
            list.add(toDaysOfWeekWithClassesForRoomDTO(schedulesForRoom,
                    (x, y) -> x.getDayOfWeek().equals(y), dayOfWeek));
        }

        scheduleForRoomDTO.setSchedules(list);

        return scheduleForRoomDTO;
    }

    DaysOfWeekWithClassesForRoomDTO toDaysOfWeekWithClassesForRoomDTO(List<Schedule> schedules,
                                                                              BiPredicate<Schedule, DayOfWeek> predicate,
                                                                              DayOfWeek dayName) {

        DaysOfWeekWithClassesForRoomDTO daysOfWeekWithClassesForRoomDTO = new DaysOfWeekWithClassesForRoomDTO();
        daysOfWeekWithClassesForRoomDTO.setDay(dayName);

        Map<Boolean, List<Schedule>> mapEven =
                schedules.stream()
                .filter(s-> predicate.test(s, dayName))
                        .collect(Collectors.partitioningBy(x-> x.getEvenOdd().equals(EvenOdd.EVEN)));

        daysOfWeekWithClassesForRoomDTO.setEven(toLessonsInRoomScheduleDTO(mapEven.get(Boolean.TRUE)));
        daysOfWeekWithClassesForRoomDTO.setOdd(toLessonsInRoomScheduleDTO(mapEven.get(Boolean.FALSE)));
        return daysOfWeekWithClassesForRoomDTO;
    }

    List<LessonsInRoomScheduleDTO> toLessonsInRoomScheduleDTO(List<Schedule> schedules){
        List<LessonsInRoomScheduleDTO> list = new ArrayList<>();

        for(Schedule schedule: schedules) {
            //TODO replace with mapper
            LessonsInRoomScheduleDTO lessons = new LessonsInRoomScheduleDTO();
            lessons.setClassId(schedule.getPeriod().getId());
            lessons.setClassName(schedule.getPeriod().getName());
            lessons.setLessons(lessonsMapper.lessonToLessonsListInRoomScheduleDTO(schedule.getLesson()));
            list.add(lessons);
        }

        return list;
    }

}
