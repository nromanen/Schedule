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

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

public class ScheduleConverter {

    private final ScheduleRepository scheduleRepository;

    private final LessonService lessonService;
    private final RoomService roomService;
    private final GroupService groupService;
    private final TeacherService teacherService;
    private final SemesterService semesterService;
    private final UserService userService;
    private final MailService mailService;
    private final GroupMapper groupMapper;
    private final PeriodMapper periodMapper;
    private final RoomForScheduleMapper roomForScheduleMapper;
    private final LessonsInScheduleMapper lessonsInScheduleMapper;


    @Autowired
    public ScheduleConverter(ScheduleRepository scheduleRepository, LessonService lessonService, RoomService roomService,
                               GroupService groupService, TeacherService teacherService,
                               SemesterService semesterService, UserService userService, MailService mailService,
                                GroupMapper groupMapper, PeriodMapper periodMapper, RoomForScheduleMapper roomForScheduleMapper,
                             LessonsInScheduleMapper lessonsInScheduleMapper) {
        this.scheduleRepository = scheduleRepository;
        this.lessonService = lessonService;
        this.roomService = roomService;
        this.groupService = groupService;
        this.teacherService = teacherService;
        this.semesterService = semesterService;
        this.userService = userService;
        this.mailService = mailService;
        this.groupMapper = groupMapper;
        this.periodMapper = periodMapper;
        this.roomForScheduleMapper = roomForScheduleMapper;
        this.lessonsInScheduleMapper = lessonsInScheduleMapper;
    }

    public ScheduleForTeacherDTO getScheduleForTeacher(Long semesterId, Long teacherId) {
        List<Schedule> teacherSchedules = scheduleRepository.getSchedulesBySemesterTeacher(semesterId, teacherId);

        ScheduleForTeacherDTO scheduleForTeacherDTO = new ScheduleForTeacherDTO();
        SemesterMapper semesterMapper = new SemesterMapperImpl();
        scheduleForTeacherDTO.setSemester(semesterMapper.semesterToSemesterDTO(teacherSchedules.get(0).getLesson().getSemester()));

        //get Teacher Info
        scheduleForTeacherDTO.setTeacher(teacherMapper.teacherToTeacherDTO(teacherSchedules.get(0).getLesson().getTeacher()));

        List<DayOfWeek> weekList = scheduleRepository.getDaysWhenTeacherHasClassesBySemester(semesterId, teacherId);
        weekList.sort(Comparator.comparingInt(DayOfWeek::getValue));

        List<DaysOfWeekWithClassesForTeacherDTO> daysOfWeekWithClassesForTeacherDTOList = new ArrayList<>();
        for (DayOfWeek day : weekList) {
            DaysOfWeekWithClassesForTeacherDTO daysOfWeekWithClassesForTeacherDTO = new DaysOfWeekWithClassesForTeacherDTO();
            daysOfWeekWithClassesForTeacherDTO.setDay(day);
            daysOfWeekWithClassesForTeacherDTO.setEven(getInfoForTeacherScheduleByWeek(semesterId, teacherId, day, EvenOdd.EVEN));
            daysOfWeekWithClassesForTeacherDTO.setOdd(getInfoForTeacherScheduleByWeek(semesterId, teacherId, day, EvenOdd.ODD));
            daysOfWeekWithClassesForTeacherDTOList.add(daysOfWeekWithClassesForTeacherDTO);
        }
        scheduleForTeacherDTO.setDays(daysOfWeekWithClassesForTeacherDTOList);
        return scheduleForTeacherDTO;
    }

    private List<ClassForTeacherScheduleDTO> getInfoForTeacherScheduleByWeek(Long semesterId, Long teacherId, DayOfWeek day, EvenOdd evenOdd) {
        List<ClassForTeacherScheduleDTO> classForTeacherScheduleDTOList = new ArrayList<>();

        ClassesInScheduleForTeacherDTO classesInScheduleForTeacherDTO = new ClassesInScheduleForTeacherDTO();

        List<Period> periodList = scheduleRepository.periodsForTeacherBySemesterByDayByWeek(semesterId, teacherId, day, evenOdd);

        if (!periodList.isEmpty()) {
            for (Period period : periodList) {
                ClassForTeacherScheduleDTO classForTeacherScheduleDTO = new ClassForTeacherScheduleDTO();
                classForTeacherScheduleDTO.setPeriod(periodMapper.convertToDto(period));
                classForTeacherScheduleDTO.setLessons(getLessonsForTeacherBySemesterByDayByWeekByPeriod(semesterId, teacherId, day, evenOdd, period.getId()));
                classForTeacherScheduleDTOList.add(classForTeacherScheduleDTO);

            }
        }
        classesInScheduleForTeacherDTO.setPeriods(classForTeacherScheduleDTOList);
        return classForTeacherScheduleDTOList;
    }

    private List<LessonForTeacherScheduleDTO> getLessonsForTeacherBySemesterByDayByWeekByPeriod(Long semesterId, Long teacherId, DayOfWeek day, EvenOdd evenOdd, Long periodId) {
        List<LessonForTeacherScheduleDTO> lessonForTeacherScheduleDTOList = new ArrayList<>();
        List<Lesson> lessons = scheduleRepository.lessonsForTeacherBySemesterByDayByPeriodByWeek(semesterId, teacherId, periodId, day, evenOdd);
        for (Lesson lesson : lessons) {
            LessonForTeacherScheduleDTO lessonForTeacherScheduleDTO = lessonForTeacherScheduleMapper.lessonToLessonForTeacherScheduleDTO(lesson);
            lessonForTeacherScheduleDTO.setRoom(scheduleRepository.getRoomForLesson(semesterId, periodId, lessonForTeacherScheduleDTO.getId(), day, evenOdd).getName());
            lessonForTeacherScheduleDTOList.add(lessonForTeacherScheduleDTO);
        }
        return lessonForTeacherScheduleDTOList;
    }

    public ScheduleFullDTO getFullScheduleForSemester(Long semesterId) {
        ScheduleFullDTO scheduleFullDTO = new ScheduleFullDTO();
        SemesterMapper semesterMapper = new SemesterMapperImpl();
        scheduleFullDTO.setSemester(semesterMapper.semesterToSemesterDTO(semesterService.getById(semesterId)));

        List<ScheduleForGroupDTO> scheduleForGroupDTOList = new ArrayList<>();
        List<Group> groupsForSchedule = new ArrayList<>();

        groupsForSchedule.addAll(scheduleRepository.uniqueGroupsInScheduleBySemester(semesterId));
        for (Group group : groupsForSchedule) {
            ScheduleForGroupDTO scheduleForGroupDTO = new ScheduleForGroupDTO();
            scheduleForGroupDTO.setGroup(groupMapper.groupToGroupDTO(group));
            scheduleForGroupDTO.setDays(getDaysForSemester(semesterId, group.getId()));
            scheduleForGroupDTOList.add(scheduleForGroupDTO);

        }
        scheduleFullDTO.setSchedule(scheduleForGroupDTOList);
        return scheduleFullDTO;
    }

    private List<DaysOfWeekWithClassesForGroupDTO> getDaysForSemester(Long semesterId, Long groupId) {
        log.info("In getDaysForSemester(semesterId = [{}])", semesterId);
        List<DaysOfWeekWithClassesForGroupDTO> daysOfWeekWithClassesForGroupDTOList = new ArrayList<>();
        Set<DayOfWeek> weekList = semesterService.getById(semesterId).getDaysOfWeek();
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>(weekList);
        for (DayOfWeek day : dayOfWeeks) {
            DaysOfWeekWithClassesForGroupDTO daysOfWeekWithClassesForGroupDTO = new DaysOfWeekWithClassesForGroupDTO();
            daysOfWeekWithClassesForGroupDTO.setDay(day);
            daysOfWeekWithClassesForGroupDTO.setClasses(getClassesForSemesterByDay(semesterId, day, groupId));
            daysOfWeekWithClassesForGroupDTOList.add(daysOfWeekWithClassesForGroupDTO);

        }

        return daysOfWeekWithClassesForGroupDTOList;
    }

    private List<ClassesInScheduleForGroupDTO> getClassesForSemesterByDay(Long semesterId, DayOfWeek day, Long groupId) {

        Set<Period> semesterPeriods = semesterService.getById(semesterId).getPeriods();
        List<ClassesInScheduleForGroupDTO> classesInScheduleForGroupDTOList = new ArrayList<>();
        for (Period period : semesterPeriods) {
            ClassesInScheduleForGroupDTO classesInScheduleForGroupDTO = new ClassesInScheduleForGroupDTO();
            classesInScheduleForGroupDTO.setPeriod(periodMapper.convertToDto(period));
            classesInScheduleForGroupDTO.setWeeks(getLessonsForGroupForPeriodBySemesterAndDay(semesterId, groupId, period.getId(), day));
            classesInScheduleForGroupDTOList.add(classesInScheduleForGroupDTO);
        }

        return classesInScheduleForGroupDTOList;
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
            var evenOdd = periodSchedule.getValue().stream().collect(Collectors.partitioningBy(schedule -> schedule.getEvenOdd().equals(EvenOdd.EVEN)));
            classesInScheduleForGroupDTO.setEven(lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(evenOdd.get(Boolean.TRUE)));
            classesInScheduleForGroupDTO.setOdd(lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(evenOdd.get(Boolean.FALSE)));
            classesInScheduleForGroupDTOList.add(classesInScheduleForGroupDTO);
        }

        return classesInScheduleForGroupDTOList;
    }

    //verifies if group with groupId has Schedule in semester with semesterId
    private boolean groupHasScheduleInSemester(Long semesterId, Long groupId) {
        return scheduleRepository.countSchedulesForGroupInSemester(semesterId, groupId) != 0;
    }


    public Map<Room, Map<DayOfWeek, Map<EvenOdd, Map<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>>>>>
    getScheduleForRooms(Long semesterId) {
        List<Schedule> schedulesForRooms = scheduleRepository.getSchedulesOrderedByRooms(semesterId);
        List<Room> roomForDetails = roomService.getAll();
        Map<Room, Map<DayOfWeek, Map<EvenOdd, Map<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>>>>> roomMap = new LinkedHashMap<>();
        for (Room room : roomForDetails) {
            roomMap.put(room, getLessonsForRoomBySemester(semesterId, room.getId()));
        }
        return roomMap;
    }

    private Map<DayOfWeek, Map<EvenOdd, Map<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>>>> getLessonsForRoomBySemester(Long semesterId, Long roomId) {
        log.info("In getLessonsForRoomBySemester(semesterId = [{}], roomId = [{}])", semesterId, roomId);
        List<Schedule> schedules = scheduleRepository.scheduleForRoomBySemester(semesterId, roomId);

        Map<Period, List<Schedule>> uniquePeriodMap = new HashMap<>();
        for (Schedule schedule1 : schedules) {
            uniquePeriodMap.computeIfAbsent(schedule1.getPeriod(), k -> new ArrayList<>()).add(schedule1);
        }
        Map<DayOfWeek, Map<EvenOdd, Map<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>>>> dayOfWeekMapMap = new LinkedHashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            Map<EvenOdd, Map<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>>> evenMap = new HashMap<>();
            Map<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>> evenPeriodListMap = new LinkedHashMap<>();
            Map<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>> oddPeriodListMap = new LinkedHashMap<>();
            for (Map.Entry<Period, List<Schedule>> periodListEntry : uniquePeriodMap.entrySet()) {
                Map<String, Map<String, Map<LessonType, List<Lesson>>>> resultEven = periodListEntry.getValue().stream().filter(schedule ->
                                schedule.getDayOfWeek().equals(day) && (schedule.getEvenOdd().equals(EvenOdd.EVEN) || schedule.getEvenOdd().equals(EvenOdd.WEEKLY)))
                        .map(Schedule::getLesson).collect(Collectors.groupingBy(Lesson::getSubjectForSite,
                                Collectors.groupingBy(lesson -> lesson.getTeacher().getSurname(),
                                        Collectors.groupingBy(Lesson::getLessonType))));

                Map<String, Map<String, Map<LessonType, List<Lesson>>>> resultOdd = periodListEntry.getValue().stream().filter(schedule ->
                                schedule.getDayOfWeek().equals(day) && (schedule.getEvenOdd().equals(EvenOdd.ODD) || schedule.getEvenOdd().equals(EvenOdd.WEEKLY)))
                        .map(Schedule::getLesson).collect(Collectors.groupingBy(Lesson::getSubjectForSite,
                                Collectors.groupingBy(lesson -> lesson.getTeacher().getSurname(),
                                        Collectors.groupingBy(Lesson::getLessonType))));
                evenPeriodListMap.put(periodListEntry.getKey(), resultEven);
                evenMap.put(EvenOdd.EVEN, evenPeriodListMap);
                oddPeriodListMap.put(periodListEntry.getKey(), resultOdd);
                evenMap.put(EvenOdd.ODD, oddPeriodListMap);
            }
            if (!evenMap.containsKey(EvenOdd.EVEN)) {
                evenMap.put(EvenOdd.EVEN, null);
            }

            if (!evenMap.containsKey(EvenOdd.ODD)) {
                evenMap.put(EvenOdd.ODD, null);
            }
            dayOfWeekMapMap.put(day, evenMap);
        }
        return dayOfWeekMapMap;
    }

    //check dates(even/odd/weekly) for distribution in baskets and create Map<LocalDate, Map<Period, List<Schedule>>>
    private Map<LocalDate, Map<Period, List<Schedule>>> fullScheduleForTeacherByDateRange(List<Schedule> schedules, LocalDate fromDate, LocalDate toDate) {
        Map<LocalDate, List<Schedule>> scheduleByDateRange = new LinkedHashMap<>();

        for (LocalDate date = fromDate; date.isBefore(toDate.plusDays(1)); date = date.plusDays(1)) {
            List<Schedule> scheduleList = new ArrayList<>();
            for (Schedule schedule : schedules) {
                if (date.getDayOfWeek() == schedule.getDayOfWeek() && (date.isBefore(schedule.getLesson().getSemester().getEndDay()) ||
                        date.isEqual(schedule.getLesson().getSemester().getEndDay())) && (date.isAfter(schedule.getLesson().getSemester().getStartDay())
                        || date.isEqual(schedule.getLesson().getSemester().getStartDay()))) {
                    int countStartDate = schedule.getLesson().getSemester().getStartDay().getDayOfWeek().getValue();
                    int countEndDate = date.getDayOfWeek().getValue();
                    int countDays = Integer.parseInt(String.valueOf(ChronoUnit.DAYS.between(
                            schedule.getLesson().getSemester().getStartDay().minusDays(countStartDate), date.plusDays(7 - countEndDate))));

                    switch (schedule.getEvenOdd()) {
                        case ODD:
                            if ((countDays / 7) % 2 != 0) {
                                scheduleList.add(schedule);
                            }
                            break;
                        case EVEN:
                            if ((countDays / 7) % 2 == 0) {
                                scheduleList.add(schedule);
                            }
                            break;
                        case WEEKLY:
                            scheduleList.add(schedule);
                            break;
                    }
                }
            }
            if (!scheduleList.isEmpty()) {
                scheduleByDateRange.put(date, scheduleList);
            }
        }
        return convertToMapScheduleDateRange(scheduleByDateRange);
    }

    //convert from Map<LocalDate, List<Schedule>> to Map<LocalDate, Map<Period, List<Schedule>>> for easy way to convert dto in future
    private Map<LocalDate, Map<Period, List<Schedule>>> convertToMapScheduleDateRange(Map<LocalDate, List<Schedule>> scheduleByDateRange) {
        Map<LocalDate, Map<Period, List<Schedule>>> map = new LinkedHashMap<>();

        for (Map.Entry<LocalDate, List<Schedule>> itr : scheduleByDateRange.entrySet()) {
            Map<Period, List<Schedule>> collect = itr.getValue().stream()
                    .collect(Collectors.groupingBy(Schedule::getPeriod));


            Map<Period, List<Schedule>> sorted = new LinkedHashMap<>();
            collect.entrySet().stream().sorted(Map.Entry.comparingByKey(Comparator.comparing(Period::getName)))
                    .forEachOrdered(x -> sorted.put(x.getKey(), x.getValue()));
            map.put(itr.getKey(), sorted);
        }
        return map;
    }

    public Map<LocalDate, Map<Period, Schedule>> scheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId) {
        log.info("In scheduleByDateRangeForTeacher with fromDate = {} and toDate = {} and teacher = {}", fromDate, toDate, teacherId);
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
