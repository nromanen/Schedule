package com.softserve.mapper.converter;

import com.softserve.dto.*;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.LessonType;
import com.softserve.exception.ScheduleConflictException;
import com.softserve.mapper.*;
import com.softserve.repository.ScheduleRepository;
import com.softserve.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class ScheduleConverter {

    private final ScheduleRepository scheduleRepository;

    private final SemesterService semesterService;
    private final GroupMapper groupMapper;
    private final PeriodMapper periodMapper;
    private final RoomForScheduleMapper roomForScheduleMapper;
    private final LessonForTeacherScheduleMapper lessonForTeacherScheduleMapper;
    private final LessonsInScheduleMapper lessonsInScheduleMapper;
    private final TeacherMapper teacherMapper;
    private final SemesterMapper semesterMapper;
    private final RoomMapper roomMapper;

    @Autowired
    public ScheduleConverter(ScheduleRepository scheduleRepository, SemesterService semesterService,
                                GroupMapper groupMapper, PeriodMapper periodMapper, RoomForScheduleMapper roomForScheduleMapper,
                             LessonsInScheduleMapper lessonsInScheduleMapper, TeacherMapper teacherMapper,
                             SemesterMapper semesterMapper, RoomMapper roomMapper,
                             LessonForTeacherScheduleMapper lessonForTeacherScheduleMapper) {
        this.scheduleRepository = scheduleRepository;
        this.semesterService = semesterService;
        this.groupMapper = groupMapper;
        this.periodMapper = periodMapper;
        this.roomForScheduleMapper = roomForScheduleMapper;
        this.lessonsInScheduleMapper = lessonsInScheduleMapper;
        this.teacherMapper = teacherMapper;
        this.semesterMapper = semesterMapper;
        this.roomMapper = roomMapper;
        this.lessonForTeacherScheduleMapper = lessonForTeacherScheduleMapper;
    }

    public ScheduleForTeacherDTO getScheduleForTeacher(List<Schedule> teacherSchedules) {
        ScheduleForTeacherDTO scheduleForTeacherDTO = new ScheduleForTeacherDTO();
        scheduleForTeacherDTO.setSemesterId(teacherSchedules.get(0).getLesson().getSemester().getId());
        scheduleForTeacherDTO.setTeacher(teacherMapper.teacherToTeacherDTO(teacherSchedules.get(0).getLesson().getTeacher()));
        scheduleForTeacherDTO.setDays(getDaysOfWeekWithClassesForTeacherDTOS(
                teacherSchedules.stream()
                        .collect(Collectors.groupingBy(Schedule::getDayOfWeek, TreeMap::new, Collectors.toList()))
        ));
        return scheduleForTeacherDTO;
    }

    private List<DaysOfWeekWithClassesForTeacherDTO> getDaysOfWeekWithClassesForTeacherDTOS(Map<DayOfWeek, List<Schedule>> daySchedules) {
        List<DaysOfWeekWithClassesForTeacherDTO> days = new ArrayList<>();

        for (var daySchedule: daySchedules.entrySet()) {
            DaysOfWeekWithClassesForTeacherDTO daysOfWeekWithClassesForTeacherDTO = new DaysOfWeekWithClassesForTeacherDTO();
            daysOfWeekWithClassesForTeacherDTO.setDay(daySchedule.getKey());
            var evenOdd = daySchedule.getValue().stream()
                    .collect(Collectors.partitioningBy(schedule -> schedule.getEvenOdd().equals(EvenOdd.EVEN)));
            daysOfWeekWithClassesForTeacherDTO.setEven(getDaysOfWeekWithClassesDTO(
                    evenOdd.get(Boolean.TRUE).stream()
                            .collect(Collectors.groupingBy(Schedule::getPeriod)))
            );
            daysOfWeekWithClassesForTeacherDTO.setOdd(getDaysOfWeekWithClassesDTO(
                    evenOdd.get(Boolean.FALSE).stream()
                            .collect(Collectors.groupingBy(Schedule::getPeriod)))
            );
            days.add(daysOfWeekWithClassesForTeacherDTO);
        }

        return days;
    }

    private List<ClassForTeacherScheduleDTO> getDaysOfWeekWithClassesDTO(Map<Period, List<Schedule>> periodSchedules) {
        List<ClassForTeacherScheduleDTO> daysOfWeekWithClassesForTeacherDTOS = new ArrayList<>();

        for (var periodSchedule:periodSchedules.entrySet()) {
            ClassForTeacherScheduleDTO classForTeacherScheduleDTO = new ClassForTeacherScheduleDTO();
            classForTeacherScheduleDTO.setPeriod(periodMapper.convertToDto(periodSchedule.getKey()));
            classForTeacherScheduleDTO.setLessons(lessonForTeacherScheduleMapper.lessonsToLessonForTeacherScheduleDTOs(
                    periodSchedule.getValue()
            ));
            daysOfWeekWithClassesForTeacherDTOS.add(classForTeacherScheduleDTO);
        }

        return daysOfWeekWithClassesForTeacherDTOS;
    }


    public ScheduleFullDTO getFullScheduleForSemester(List<Schedule> schedules) {
        ScheduleFullDTO scheduleFullDTO = new ScheduleFullDTO();
        Long semesterId = schedules.get(0).getLesson().getSemester().getId();

        scheduleFullDTO.setSemester(
                semesterMapper.semesterToSemesterDTO(
                        semesterService.getById(semesterId)
                )
        );
        scheduleFullDTO.setSchedule(getFullScheduleForGroup(
                schedules.stream().
                        collect(Collectors.groupingBy(s -> s.getLesson().getGroup())))
        );
        return scheduleFullDTO;
    }


    public List<ScheduleForGroupDTO> getFullScheduleForGroup(Map<Group, List<Schedule>> schedules) {

        List<ScheduleForGroupDTO> scheduleForGroupDTOList = new ArrayList<>();

        for (Map.Entry<Group, List<Schedule>> groupSchedule: schedules.entrySet()) {
                ScheduleForGroupDTO scheduleForGroupDTO = new ScheduleForGroupDTO();
                scheduleForGroupDTO.setGroup(groupMapper.groupToGroupDTO(groupSchedule.getKey()));
                scheduleForGroupDTO.setDays(getDaysWhenGroupHasClassesBySemester(
                        groupSchedule.getValue()
                        .stream()
                        .collect(Collectors.groupingBy(Schedule::getDayOfWeek)))
                );
                scheduleForGroupDTOList.add(scheduleForGroupDTO);
        }
        return scheduleForGroupDTOList;
    }

    private List<DaysOfWeekWithClassesForGroupDTO> getDaysWhenGroupHasClassesBySemester(Map<DayOfWeek, List<Schedule>> daySchedules) {
        List<DaysOfWeekWithClassesForGroupDTO> daysOfWeekWithClassesForGroupDTOList = new ArrayList<>();
        for (var daySchedule: daySchedules.entrySet()) {
            DaysOfWeekWithClassesForGroupDTO daysOfWeekWithClassesForGroupDTO = new DaysOfWeekWithClassesForGroupDTO();
            daysOfWeekWithClassesForGroupDTO.setDay(daySchedule.getKey());
            daysOfWeekWithClassesForGroupDTO.setClasses(getClassesForGroupBySemesterByDayOfWeek(daySchedule.getValue()));
            daysOfWeekWithClassesForGroupDTOList.add(daysOfWeekWithClassesForGroupDTO);
            daysOfWeekWithClassesForGroupDTOList.add(daysOfWeekWithClassesForGroupDTO);
        }
        return daysOfWeekWithClassesForGroupDTOList;
    }

    private List<ClassesInScheduleForGroupDTO> getClassesForGroupBySemesterByDayOfWeek(List<Schedule> schedules) {
        Map<Period, List<Schedule>> uniquePeriods =
                schedules.stream()
                        .collect(Collectors.groupingBy(Schedule::getPeriod));
        List<ClassesInScheduleForGroupDTO> classesInScheduleForGroupDTOList = new ArrayList<>();

        for (var periodSchedule : uniquePeriods.entrySet()) {
            ClassesInScheduleForGroupDTO classesInScheduleForGroupDTO = new ClassesInScheduleForGroupDTO();
            classesInScheduleForGroupDTO.setPeriod(periodMapper.convertToDto(periodSchedule.getKey()));
            var evenOdd = periodSchedule.getValue().stream()
                    .collect(Collectors.partitioningBy(schedule -> schedule.getEvenOdd().equals(EvenOdd.EVEN)));
            LessonsInScheduleDTO lessons = lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(
                    evenOdd.get(Boolean.TRUE).stream().map(Schedule::getLesson).findFirst().orElse(new Lesson()));
            lessons.setRoom(roomForScheduleMapper
                    .roomToRoomForScheduleDTO(evenOdd.get(Boolean.TRUE).stream()
                            .findFirst().orElse(new Schedule()).getRoom())
            );
            classesInScheduleForGroupDTO.setEven(lessons);
            lessons = lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(
                    evenOdd.get(Boolean.FALSE).stream().map(Schedule::getLesson).findFirst().orElse(new Lesson()));
            lessons.setRoom(roomForScheduleMapper
                    .roomToRoomForScheduleDTO(evenOdd.get(Boolean.FALSE).stream()
                            .findFirst().orElse(new Schedule()).getRoom())
            );
            classesInScheduleForGroupDTO.setOdd(lessons);
            classesInScheduleForGroupDTOList.add(classesInScheduleForGroupDTO);
        }

        return classesInScheduleForGroupDTOList;
    }


    public List<ScheduleForRoomDTO> getScheduleForRooms(Map<Room, List<Schedule>> roomSchedules) {
        List<ScheduleForRoomDTO> schedules = new ArrayList<>();
        for (var room: roomSchedules.entrySet()) {
            ScheduleForRoomDTO scheduleForRoomDTO = new ScheduleForRoomDTO();
            scheduleForRoomDTO.setRoom(roomMapper.convertToDto(room.getKey()));
            scheduleForRoomDTO.setSchedules(getDaysOfWeekWithClasses(
                    room.getValue().stream().collect(Collectors.groupingBy(Schedule::getDayOfWeek))
            ));
            schedules.add(scheduleForRoomDTO);
        }

        return schedules;
    }

    private List<DaysOfWeekWithClassesForRoomDTO> getDaysOfWeekWithClasses(Map<DayOfWeek, List<Schedule>> daySchedules) {
        List<DaysOfWeekWithClassesForRoomDTO> daysOfWeekWithClassesForRoomDTOS = new ArrayList<>();
        for (var daySchedule: daySchedules.entrySet()) {
            DaysOfWeekWithClassesForRoomDTO daysOfWeekWithClassesForRoomDTO = new DaysOfWeekWithClassesForRoomDTO();
            daysOfWeekWithClassesForRoomDTO.setDay(daySchedule.getKey());
            Map<Boolean, List<Schedule>> evenOdd =
                    daySchedule.getValue().stream()
                            .collect(Collectors.partitioningBy(s -> s.getEvenOdd().equals(EvenOdd.EVEN)));
            daysOfWeekWithClassesForRoomDTO.setEven(
                    getLessonsInRoomScheduleDTOs(evenOdd.get(Boolean.TRUE).stream()
                            .collect(Collectors.groupingBy(Schedule::getPeriod))
            ));
            daysOfWeekWithClassesForRoomDTO.setOdd(getLessonsInRoomScheduleDTOs(evenOdd.get(Boolean.FALSE).stream()
                    .collect(Collectors.groupingBy(Schedule::getPeriod))
            ));
            daysOfWeekWithClassesForRoomDTOS.add(daysOfWeekWithClassesForRoomDTO);
        }
        return daysOfWeekWithClassesForRoomDTOS;
    }

    private List<LessonsInRoomScheduleDTO> getLessonsInRoomScheduleDTOs(Map<Period, List<Schedule>> schedulePeriods) {
        List<LessonsInRoomScheduleDTO> lessons = new ArrayList<>();

        for(var schedulePeriod: schedulePeriods.entrySet()) {
            LessonsInRoomScheduleDTO lesson = new LessonsInRoomScheduleDTO();
            lesson.setClassId(schedulePeriod.getKey().getId());
            lesson.setClassName(schedulePeriod.getKey().getName());
            lesson.setLessons(getLessonsListInRoomScheduleDTOS(schedulePeriod.getValue()
                    .stream()
                    .collect(Collectors.groupingBy(Schedule::getLesson))));
            lessons.add(lesson);
        }

        return lessons;
    }

    private List<LessonsListInRoomScheduleDTO> getLessonsListInRoomScheduleDTOS(Map<Lesson, List<Schedule>> lessonsSchedules) {
        List<LessonsListInRoomScheduleDTO> lessons = new ArrayList<>();

        for (var lesson : lessonsSchedules.entrySet()) {
            LessonsListInRoomScheduleDTO lessonsList = new LessonsListInRoomScheduleDTO();
            lessonsList.setLessonType(lesson.getKey().getLessonType());
            lessonsList.setSubjectName(lesson.getKey().getSubjectForSite());
            lessonsList.setSurname(lesson.getKey().getTeacher().getSurname());
            lessonsList.setGroups(getGroupDTOInRoomSchedules(lesson.getValue().stream()
                    .map(s -> s.getLesson().getGroup())
                    .collect(Collectors.toList())));
            lessons.add(lessonsList);
        }

        return lessons;
    }

    private List<GroupDTOInRoomSchedule> getGroupDTOInRoomSchedules(List<Group> groupSchedules) {
        List<GroupDTOInRoomSchedule> groupDTOSchedules = new ArrayList<>();

        for(var groupSchedule: groupSchedules) {
            GroupDTOInRoomSchedule groupDTOInRoomSchedule = new GroupDTOInRoomSchedule();
            groupDTOInRoomSchedule.setGroupId(groupSchedule.getId());
            groupDTOInRoomSchedule.setGroupName(groupSchedule.getTitle());
            groupDTOSchedules.add(groupDTOInRoomSchedule);
        }

        return groupDTOSchedules;
    }

    public Map<LocalDate, Map<Period, Schedule>> scheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId) {
        List<Schedule> schedules = scheduleRepository.scheduleByDateRangeForTeacher(fromDate, toDate, teacherId);

        List<Schedule> dateRangeSchedule = new ArrayList<>();
        for (Schedule schedule : schedules) {
            if (isDateInSemesterDateRange(schedule, toDate)) {
                dateRangeSchedule.add(schedule);
            }
        }

        return new HashMap<>();
    }

    //check date in semester date range, if yes return - true, else - false
    private boolean isDateInSemesterDateRange(Schedule schedule, LocalDate toDate) {
        DayOfWeek startSemester = schedule.getLesson().getSemester().getStartDay().getDayOfWeek();

        if (schedule.getEvenOdd() == EvenOdd.ODD) {
            if (startSemester.getValue() > schedule.getDayOfWeek().getValue()) {
                int i = startSemester.getValue() - schedule.getDayOfWeek().getValue();
                LocalDate firstCaseDate = schedule.getLesson().getSemester().getStartDay().plusDays(14 - i);

                return checkDateRangeForReturn(firstCaseDate, schedule.getLesson().getSemester().getEndDay(), toDate);
            }
            int k = schedule.getDayOfWeek().getValue() - startSemester.getValue();
            LocalDate secondCaseDate = schedule.getLesson().getSemester().getStartDay().plusDays(k);

            return checkDateRangeForReturn(secondCaseDate, schedule.getLesson().getSemester().getEndDay(), toDate);
        }

        if (schedule.getEvenOdd() == EvenOdd.EVEN || schedule.getEvenOdd() == EvenOdd.WEEKLY) {
            if (startSemester.getValue() > schedule.getDayOfWeek().getValue()) {
                int i = startSemester.getValue() - schedule.getDayOfWeek().getValue();
                LocalDate firstCaseDate = schedule.getLesson().getSemester().getStartDay().plusDays(7 - i);

                return checkDateRangeForReturn(firstCaseDate, schedule.getLesson().getSemester().getEndDay(), toDate);
            }
            int k = schedule.getDayOfWeek().getValue() - startSemester.getValue();
            if (schedule.getEvenOdd() == EvenOdd.WEEKLY) {
                LocalDate secondCaseDate = schedule.getLesson().getSemester().getStartDay().plusDays(k);
                return checkDateRangeForReturn(secondCaseDate, schedule.getLesson().getSemester().getEndDay(), toDate);
            }
            LocalDate thirdCaseDate = schedule.getLesson().getSemester().getStartDay().plusDays(7 + k);
            return checkDateRangeForReturn(thirdCaseDate, schedule.getLesson().getSemester().getEndDay(), toDate);
        }
        return false;
    }

    //this method use for don't duplicate code
    private boolean checkDateRangeForReturn(LocalDate dateForCheck, LocalDate semesterEndDate, LocalDate toDate) {
        return (dateForCheck.isBefore(semesterEndDate) || dateForCheck.isEqual(semesterEndDate)) &&
                (dateForCheck.isBefore(toDate) || dateForCheck.isEqual(toDate));
    }
}
