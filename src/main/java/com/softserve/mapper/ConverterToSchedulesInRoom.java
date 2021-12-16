package com.softserve.mapper;

import com.softserve.dto.*;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ConverterToSchedulesInRoom {

    private final GroupMapper groupMapper;

    public ConverterToSchedulesInRoom(GroupMapper groupMapper) {
        this.groupMapper = groupMapper;
    }

    public List<ScheduleForRoomDTO> convertToSchedulesInRoom(Map<Room, List<Schedule>> schedules) {
        List<ScheduleForRoomDTO> schedulesInRoomDTOS = new ArrayList<>();
        for (var roomSchedule: schedules.entrySet()) {
            ScheduleForRoomDTO schedule = new ScheduleForRoomDTO();
            schedule.setRoomId(roomSchedule.getKey().getId());
            schedule.setRoomName(roomSchedule.getKey().getName());
            schedule.setRoomType(roomSchedule.getKey().getType().toString());
            schedule.setSchedules(getDaysOfWeekWithClassesForRoomDTOS(
                    roomSchedule.getValue().stream()
                            .collect(Collectors.groupingBy(Schedule::getDayOfWeek))
            ));
            schedulesInRoomDTOS.add(schedule);
        }
        return schedulesInRoomDTOS;
    }

    private List<DaysOfWeekWithClassesForRoomDTO> getDaysOfWeekWithClassesForRoomDTOS(Map<DayOfWeek, List<Schedule>> daySchedules) {
        List<DaysOfWeekWithClassesForRoomDTO> days = new ArrayList<>();
        for (var daySchedule: daySchedules.entrySet()) {
            DaysOfWeekWithClassesForRoomDTO daysOfWeekWithClassesForRoomDTO = new DaysOfWeekWithClassesForRoomDTO();
            daysOfWeekWithClassesForRoomDTO.setDay(daySchedule.getKey());
            daysOfWeekWithClassesForRoomDTO.setClasses(getRoomClassesInScheduleDTOS(
                    daySchedule.getValue().stream()
                            .collect(Collectors.groupingBy(Schedule::getPeriod))
            ));
            days.add(daysOfWeekWithClassesForRoomDTO);
        }
        return days;
    }

    private List<RoomClassesInScheduleDTO> getRoomClassesInScheduleDTOS(Map<Period, List<Schedule>> schedules) {
        List<RoomClassesInScheduleDTO> roomClassesInScheduleDTOS = new ArrayList<>();

        for (var periodSchedule : schedules.entrySet()) {
            Map<Boolean, List<Schedule>> evenOdd = periodSchedule.getValue().stream()
                    .collect(Collectors.partitioningBy(s -> s.getEvenOdd().equals(EvenOdd.EVEN)));
            RoomClassesInScheduleDTO roomClassesInScheduleDTO = new RoomClassesInScheduleDTO();
            roomClassesInScheduleDTO.setEven(getLessonsInRoomScheduleDTOS(
                    evenOdd.get(Boolean.TRUE).stream().collect(Collectors.groupingBy(Schedule::getPeriod))
            ));
            roomClassesInScheduleDTO.setOdd(getLessonsInRoomScheduleDTOS(
                    evenOdd.get(Boolean.FALSE).stream().collect(Collectors.groupingBy(Schedule::getPeriod))
            ));
            roomClassesInScheduleDTOS.add(roomClassesInScheduleDTO);
        }
        return roomClassesInScheduleDTOS;
    }

    private List<LessonsInRoomScheduleDTO> getLessonsInRoomScheduleDTOS(Map<Period, List<Schedule>> schedules) {
        List<LessonsInRoomScheduleDTO> lessons = new ArrayList<>();
        for (var periodSchedule: schedules.entrySet()) {
            LessonsInRoomScheduleDTO lessonsInRoomScheduleDTO = new LessonsInRoomScheduleDTO();
            lessonsInRoomScheduleDTO.setClassId(periodSchedule.getKey().getId());
            lessonsInRoomScheduleDTO.setClassName(periodSchedule.getKey().getName());
            lessonsInRoomScheduleDTO.setLessons(getLessonsListInRoomScheduleDTOS(
                    periodSchedule.getValue().stream()
                            .collect(Collectors.groupingBy(Schedule::getLesson))
            ));
            lessons.add(lessonsInRoomScheduleDTO);
        }
        return lessons;
    }

    private List<LessonsListInRoomScheduleDTO> getLessonsListInRoomScheduleDTOS(Map<Lesson, List<Schedule>> schedules) {
        List<LessonsListInRoomScheduleDTO> lessonsListInRoomScheduleDTOS = new ArrayList<>();
        for(var lessonSchedule: schedules.entrySet()) {
            LessonsListInRoomScheduleDTO lessonsListInRoomScheduleDTO = new LessonsListInRoomScheduleDTO();
            lessonsListInRoomScheduleDTO.setSubjectName(lessonSchedule.getKey().getSubjectForSite());
            lessonsListInRoomScheduleDTO.setLessonType(lessonSchedule.getKey().getLessonType());
            lessonsListInRoomScheduleDTO.setSurname(lessonSchedule.getKey().getTeacher().getSurname());
            lessonsListInRoomScheduleDTO.setGroups(groupMapper.toGroupDTOInRoomSchedule(
                    lessonSchedule.getValue().stream().map(s -> s.getLesson().getGroup())
                            .collect(Collectors.toList())
            ));
            lessonsListInRoomScheduleDTOS.add(lessonsListInRoomScheduleDTO);
        }
        return lessonsListInRoomScheduleDTOS;
    }

}
