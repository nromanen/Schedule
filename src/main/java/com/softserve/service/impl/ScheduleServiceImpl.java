package com.softserve.service.impl;

import com.softserve.dto.*;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.MessageNotSendException;
import com.softserve.exception.ScheduleConflictException;
import com.softserve.mapper.*;
import com.softserve.repository.LessonRepository;
import com.softserve.repository.PeriodRepository;
import com.softserve.repository.RoomRepository;
import com.softserve.repository.ScheduleRepository;
import com.softserve.service.*;
import com.softserve.util.PdfReportGenerator;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@Transactional
@Service
@Slf4j
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ScheduleCacheService cacheService;

    private final LessonService lessonService;
    private final RoomService roomService;
    private final GroupService groupService;
    private final TeacherService teacherService;
    private final SemesterService semesterService;
    private final MailService mailService;

    private final GroupMapper groupMapper;
    private final PeriodMapper periodMapper;
    private final LessonsInScheduleMapper lessonsInScheduleMapper;
    private final RoomForScheduleMapper roomForScheduleMapper;
    private final LessonForTeacherScheduleMapper lessonForTeacherScheduleMapper;
    private final ScheduleWithoutSemesterMapper scheduleWithoutSemesterMapper;
    private final ScheduleSaveMapper scheduleSaveMapper;
    private final LessonRepository lessonRepository;
    private final ScheduleMapper scheduleMapper;
    private final RoomRepository roomRepository;
    private final PeriodRepository periodRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public List<GroupWithLessonIdDTO> getGroupsWithLessonsForGroupedClass(Long lessonId) {
        log.info("In getGroupsWithLessonsForGroupedClass(lessonId = [{}])", lessonId);

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException(Lesson.class, "id", lessonId.toString()));

        List<Lesson> lessons = lessonRepository
                .getLessonsBySubjectIdTeacherIdSemesterIdLessonTypeAndExcludeCurrentLessonId(lesson);

        List<GroupWithLessonIdDTO> result = new ArrayList<>();
        for (Lesson les : lessons) {
            long count = countInputLessonsInScheduleByLessonId(les.getId());
            if (count < les.getHours()) {
                GroupWithLessonIdDTO dto = new GroupWithLessonIdDTO();
                dto.setGroupDTO(groupMapper.groupToGroupDTO(les.getGroup()));
                dto.setLessonId(les.getId());
                result.add(dto);
            }
        }
        return result;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Schedule getById(Long id) {
        log.info("In getById(id = [{}])", id);
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Schedule.class, "id", id.toString()));
        Hibernate.initialize(schedule.getRoom());
        Hibernate.initialize(schedule.getPeriod());
        Hibernate.initialize(schedule.getLesson().getSemester().getDaysOfWeek());
        Hibernate.initialize(schedule.getLesson().getSemester().getPeriods());
        Hibernate.initialize(schedule.getLesson().getSemester().getGroups());
        return schedule;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<Schedule> getAll() {
        log.info("In getAll()");
        return scheduleRepository.getAll();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Schedule save(Schedule schedule) {
        log.info("In save(schedule = [{}])", schedule);

        Lesson lesson = schedule.getLesson();

        if (isConflictForGroup(
                lesson.getSemester().getId(),
                schedule.getDayOfWeek(),
                schedule.getEvenOdd(),
                schedule.getPeriod().getId(),
                lesson.getGroup().getId())) {
            log.error("Schedule for group with id [{}] has conflict with already existing", lesson.getGroup().getId());
            throw new ScheduleConflictException("You can't create schedule item for this group, because one already exists");
        }

        Schedule saved = scheduleRepository.save(schedule);

        // Evict caches after successful save
        cacheService.evictCachesForSchedule(
                lesson.getSemester().getId(),
                lesson.getGroup().getId(),
                lesson.getTeacher().getId()
        );

        return saved;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Schedule> schedulesForGroupedLessons(Schedule schedule) {
        log.info("In schedulesForGroupedLessons(schedule = [{}])", schedule);
        List<Lesson> lessons = lessonService.getAllGroupedLessonsByLesson(schedule.getLesson());
        return lessons.stream()
                .map(lesson -> {
                    Schedule newSchedule = new Schedule();
                    newSchedule.setRoom(schedule.getRoom());
                    newSchedule.setDayOfWeek(schedule.getDayOfWeek());
                    newSchedule.setPeriod(schedule.getPeriod());
                    newSchedule.setEvenOdd(schedule.getEvenOdd());
                    newSchedule.setLesson(lesson);
                    return newSchedule;
                })
                .toList();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Schedule> getSchedulesForGroupedLessons(Schedule schedule) {
        log.info("In getSchedulesForGroupedLessons(schedule = [{}])", schedule);
        return schedulesForGroupedLessons(schedule).stream()
                .map(scheduleRepository::getScheduleByObject)
                .toList();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void checkReferences(Schedule schedule) {
        if (isLessonInScheduleByLessonIdPeriodIdEvenOddDayOfWeek(schedule.getLesson().getId(), schedule.getPeriod().getId(),
                schedule.getEvenOdd(), schedule.getDayOfWeek())) {
            log.error("Lessons with group title [{}] already exists in schedule", schedule.getLesson().getGroup().getTitle());
            throw new EntityAlreadyExistsException("Lessons with this group title already exists");
        }

        Lesson lesson = schedule.getLesson();

        if (isConflictForGroup(
                lesson.getSemester().getId(),
                schedule.getDayOfWeek(),
                schedule.getEvenOdd(),
                schedule.getPeriod().getId(),
                lesson.getGroup().getId())) {
            log.error("Schedule for group with id [{}] has conflict with already existing", lesson.getGroup().getId());
            throw new ScheduleConflictException("You can't create schedule item for this group, because one already exists");
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Schedule update(Schedule schedule) {
        log.info("In update(schedule = [{}])", schedule);

        Lesson lesson = schedule.getLesson();

        if (isConflictForGroup(
                lesson.getSemester().getId(),
                schedule.getDayOfWeek(),
                schedule.getEvenOdd(),
                schedule.getPeriod().getId(),
                lesson.getGroup().getId())) {
            log.error("Schedule for group with id [{}] has conflict with already existing", lesson.getGroup().getId());
            throw new ScheduleConflictException("You can't update schedule item for this group, because it violates already existing");
        }

        Schedule updated = scheduleRepository.update(schedule);

        // Evict caches after successful update
        cacheService.evictCachesForSchedule(
                lesson.getSemester().getId(),
                lesson.getGroup().getId(),
                lesson.getTeacher().getId()
        );

        return updated;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Schedule delete(Schedule schedule) {
        log.info("In delete(schedule = [{}])", schedule);

        Lesson lesson = schedule.getLesson();
        Schedule deleted = scheduleRepository.delete(schedule);

        // Evict caches (including lessons) after successful delete
        cacheService.evictCachesForScheduleWithLessons(
                lesson.getSemester().getId(),
                lesson.getGroup().getId(),
                lesson.getTeacher().getId()
        );

        return deleted;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public CreateScheduleInfoDTO getInfoForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId) {
        log.info("In getInfoForCreatingSchedule(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], lessonId = [{}])",
                semesterId, dayOfWeek, evenOdd, classId, lessonId);

        if (isConflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, lessonId)) {
            log.error("Schedule for group already exists");
            throw new ScheduleConflictException("You can't create schedule for this group, because one already exists");
        }

        CreateScheduleInfoDTO createScheduleInfoDTO = new CreateScheduleInfoDTO();
        createScheduleInfoDTO.setTeacherAvailable(isTeacherAvailableForSchedule(semesterId, dayOfWeek, evenOdd, classId, lessonId));
        createScheduleInfoDTO.setRooms(roomService.getAllRoomsForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId));
        return createScheduleInfoDTO;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public boolean isConflictForGroupInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId) {
        log.info("In isConflictForGroupInSchedule(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], lessonId = [{}])",
                semesterId, dayOfWeek, evenOdd, classId, lessonId);
        Long groupId = lessonService.getById(lessonId).getGroup().getId();
        return scheduleRepository.conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId) != 0;
    }

    private boolean isConflictForGroup(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long periodId, Long groupId) {
        log.debug("In isConflictForGroup(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], periodId = [{}], groupId = [{}])",
                semesterId, dayOfWeek, evenOdd, periodId, groupId);
        return scheduleRepository.conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, periodId, groupId) != 0;
    }

    private boolean isTeacherAvailableForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId) {
        log.info("In isTeacherAvailable(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], lessonId = [{}])",
                semesterId, dayOfWeek, evenOdd, classId, lessonId);
        Long teacherId = lessonService.getById(lessonId).getTeacher().getId();
        return scheduleRepository.conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId) == 0;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "scheduleForGroup", key = "#semesterId + '-' + #groupId", condition = "#groupId != null")
    public List<ScheduleForGroupDTO> getFullScheduleForGroup(Long semesterId, Long groupId) {
        log.info("In getFullScheduleForGroup(semesterId = [{}], groupId = [{}])", semesterId, groupId);

        List<ScheduleForGroupDTO> scheduleForGroupDTOList = new ArrayList<>();

        if (semesterId != null && groupId != null) {
            if (groupHasScheduleInSemester(semesterId, groupId)) {
                GroupDTO groupDTO = groupService.getById(groupId);
                ScheduleForGroupDTO scheduleForGroupDTO = new ScheduleForGroupDTO();
                scheduleForGroupDTO.setGroup(groupDTO);
                scheduleForGroupDTO.setDays(getDaysWhenGroupHasClassesBySemester(semesterId, groupId));
                scheduleForGroupDTOList.add(scheduleForGroupDTO);
            }
        } else {
            List<Group> groups = scheduleRepository.uniqueGroupsInScheduleBySemester(semesterId);
            for (Group group : groups) {
                ScheduleForGroupDTO scheduleForGroupDTO = new ScheduleForGroupDTO();
                scheduleForGroupDTO.setGroup(groupMapper.groupToGroupDTO(group));
                scheduleForGroupDTO.setDays(getDaysWhenGroupHasClassesBySemester(semesterId, group.getId()));
                scheduleForGroupDTOList.add(scheduleForGroupDTO);
            }
        }

        return scheduleForGroupDTOList;
    }

    private List<DaysOfWeekWithClassesForGroupDTO> getDaysWhenGroupHasClassesBySemester(Long semesterId, Long groupId) {
        log.info("In getDaysWhenGroupHasClassesBySemester(semesterId = [{}], groupId = [{}])", semesterId, groupId);

        List<DayOfWeek> weekList = scheduleRepository.getDaysWhenGroupHasClassesBySemester(semesterId, groupId);
        weekList.sort(Comparator.comparingInt(DayOfWeek::getValue));

        return weekList.stream()
                .map(day -> {
                    DaysOfWeekWithClassesForGroupDTO dto = new DaysOfWeekWithClassesForGroupDTO();
                    dto.setDay(day);
                    dto.setClasses(getClassesForGroupBySemesterByDayOfWeek(semesterId, groupId, day));
                    return dto;
                })
                .toList();
    }

    private List<ClassesInScheduleForGroupDTO> getClassesForGroupBySemesterByDayOfWeek(Long semesterId, Long groupId, DayOfWeek day) {
        log.info("In getClassesForGroupBySemesterByDayOfWeek(semesterId = [{}], groupId = [{}], day = [{}])", semesterId, groupId, day);

        List<Period> uniquePeriods = scheduleRepository.periodsForGroupByDayBySemester(semesterId, groupId, day);

        return uniquePeriods.stream()
                .map(period -> {
                    ClassesInScheduleForGroupDTO dto = new ClassesInScheduleForGroupDTO();
                    dto.setPeriod(periodMapper.convertToDto(period));
                    dto.setWeeks(getLessonsForGroupForPeriodBySemesterAndDay(semesterId, groupId, period.getId(), day));
                    return dto;
                })
                .toList();
    }

    private LessonInScheduleByWeekDTO getLessonsForGroupForPeriodBySemesterAndDay(Long semesterId, Long groupId, Long periodId, DayOfWeek day) {
        log.info("In getLessonsForGroupForPeriodBySemesterAndDay(semesterId = [{}], groupId = [{}], periodId = [{}], day = [{}])",
                semesterId, groupId, periodId, day);

        LessonInScheduleByWeekDTO result = new LessonInScheduleByWeekDTO();
        result.setEven(getLessonWithRoom(semesterId, groupId, periodId, day, EvenOdd.EVEN));
        result.setOdd(getLessonWithRoom(semesterId, groupId, periodId, day, EvenOdd.ODD));
        return result;
    }

    private LessonsInScheduleDTO getLessonWithRoom(Long semesterId, Long groupId, Long periodId, DayOfWeek day, EvenOdd evenOdd) {
        return scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semesterId, groupId, periodId, day, evenOdd)
                .map(lesson -> {
                    LessonsInScheduleDTO dto = lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(lesson);
                    Room room = scheduleRepository.getRoomForLesson(semesterId, periodId, lesson.getId(), day, evenOdd);
                    dto.setRoom(roomForScheduleMapper.roomToRoomForScheduleDTO(room));
                    return dto;
                })
                .orElse(null);
    }

    private boolean groupHasScheduleInSemester(Long semesterId, Long groupId) {
        log.info("In groupHasScheduleInSemester(semesterId = [{}], groupId = [{}])", semesterId, groupId);
        return scheduleRepository.countSchedulesForGroupInSemester(semesterId, groupId) != 0;
    }


    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "scheduleForTeacher", key = "#semesterId + '-' + #teacherId")
    public ScheduleForTeacherDTO getScheduleForTeacher(Long semesterId, Long teacherId) {
        log.info("In getScheduleForTeacher(semesterId = [{}], teacherId = [{}])", semesterId, teacherId);

        ScheduleForTeacherDTO scheduleForTeacherDTO = new ScheduleForTeacherDTO();
        scheduleForTeacherDTO.setSemester(semesterService.getById(semesterId));
        scheduleForTeacherDTO.setTeacher(teacherService.getById(teacherId));

        List<DayOfWeek> weekList = scheduleRepository.getDaysWhenTeacherHasClassesBySemester(semesterId, teacherId);
        weekList.sort(Comparator.comparingInt(DayOfWeek::getValue));

        List<DaysOfWeekWithClassesForTeacherDTO> days = weekList.stream()
                .map(day -> {
                    DaysOfWeekWithClassesForTeacherDTO dto = new DaysOfWeekWithClassesForTeacherDTO();
                    dto.setDay(day);
                    dto.setEvenWeek(getInfoForTeacherScheduleByWeek(semesterId, teacherId, day, EvenOdd.EVEN));
                    dto.setOddWeek(getInfoForTeacherScheduleByWeek(semesterId, teacherId, day, EvenOdd.ODD));
                    return dto;
                })
                .toList();

        scheduleForTeacherDTO.setDays(days);
        return scheduleForTeacherDTO;
    }

    private ClassesInScheduleForTeacherDTO getInfoForTeacherScheduleByWeek(Long semesterId, Long teacherId, DayOfWeek day, EvenOdd evenOdd) {
        ClassesInScheduleForTeacherDTO classesInScheduleForTeacherDTO = new ClassesInScheduleForTeacherDTO();

        List<Period> periodList = scheduleRepository.periodsForTeacherBySemesterByDayByWeek(semesterId, teacherId, day, evenOdd);

        List<ClassForTeacherScheduleDTO> classes = periodList.stream()
                .map(period -> {
                    ClassForTeacherScheduleDTO dto = new ClassForTeacherScheduleDTO();
                    dto.setPeriod(periodMapper.convertToDto(period));
                    dto.setLessons(getLessonsForTeacherBySemesterByDayByWeekByPeriod(semesterId, teacherId, day, evenOdd, period.getId()));
                    return dto;
                })
                .toList();

        classesInScheduleForTeacherDTO.setPeriods(classes);
        return classesInScheduleForTeacherDTO;
    }

    private List<LessonForTeacherScheduleDTO> getLessonsForTeacherBySemesterByDayByWeekByPeriod(Long semesterId, Long teacherId,
                                                                                                DayOfWeek day, EvenOdd evenOdd, Long periodId) {
        List<Lesson> lessons = scheduleRepository.lessonsForTeacherBySemesterByDayByPeriodByWeek(semesterId, teacherId, periodId, day, evenOdd);

        return lessons.stream()
                .map(lesson -> {
                    LessonForTeacherScheduleDTO dto = lessonForTeacherScheduleMapper.lessonToLessonForTeacherScheduleDTO(lesson);
                    Room room = scheduleRepository.getRoomForLesson(semesterId, periodId, dto.getId(), day, evenOdd);
                    dto.setRoom(room.getName());
                    return dto;
                })
                .toList();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<Schedule> getAllSchedulesByTeacherIdAndSemesterId(Long teacherId, Long semesterId) {
        log.info("In getAllSchedulesByTeacherIdAndSemesterId(teacherId = [{}], semesterId = [{}])", teacherId, semesterId);
        return scheduleRepository.getAllSchedulesByTeacherIdAndSemesterId(teacherId, semesterId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "semesterSchedules", key = "#semesterId")
    public List<ScheduleWithoutSemesterDTO> getSchedulesBySemester(Long semesterId) {
        log.info("In getSchedulesBySemester(semesterId = [{}])", semesterId);
        List<Schedule> schedules = scheduleRepository.getScheduleBySemester(semesterId);
        return scheduleWithoutSemesterMapper.scheduleToScheduleWithoutSemesterDTOs(schedules);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void deleteSchedulesBySemesterId(Long semesterId) {
        log.info("In deleteSchedulesBySemesterId(semesterId = [{}])", semesterId);
        scheduleRepository.deleteSchedulesBySemesterId(semesterId);

        // Evict all caches after bulk delete
        cacheService.evictAllScheduleCaches();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Schedule saveScheduleDuringCopy(Schedule schedule) {
        log.info("In saveScheduleDuringCopy(schedule = [{}])", schedule);
        return scheduleRepository.save(schedule);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Schedule updateWithoutChecks(Schedule schedule) {
        log.info("In updateWithoutChecks(schedule = [{}])", schedule);
        return scheduleRepository.update(schedule);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Long countInputLessonsInScheduleByLessonId(Long lessonId) {
        log.info("In countInputLessonsInScheduleByLessonId(lessonId = [{}])", lessonId);
        return scheduleRepository.countInputLessonsInScheduleByLessonId(lessonId);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public boolean isLessonInScheduleByLessonIdPeriodIdEvenOddDayOfWeek(Long lessonId, Long periodId, EvenOdd evenOdd, DayOfWeek day) {
        log.info("In isLessonInScheduleByLessonIdPeriodIdEvenOddDayOfWeek(lessonId = [{}], periodId = [{}], evenOdd = [{}], day = [{}])",
                lessonId, periodId, evenOdd, day);
        return scheduleRepository.countByLessonIdPeriodIdEvenOddDayOfWeek(lessonId, periodId, evenOdd, day) != 0;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void sendScheduleToTeachers(Long semesterId, Long[] teachersId, Locale language) {
        log.info("In sendScheduleToTeachers(semesterId = [{}], teachersId = [{}])", semesterId, teachersId);
        Arrays.stream(teachersId).forEach(teacherId -> {
            try {
                sendScheduleToTeacher(semesterId, teacherId, language);
            } catch (MessagingException e) {
                throw new MessageNotSendException(e.getMessage());
            }
        });
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void sendScheduleToTeacher(Long semesterId, Long teacherId, Locale language) throws MessagingException {
        log.info("In sendScheduleToTeacher(semesterId = [{}], teacherId = [{}])", semesterId, teacherId);
        TeacherDTO teacher = teacherService.getById(teacherId);
        ScheduleForTeacherDTO schedule = getScheduleForTeacher(semesterId, teacher.getId());
        PdfReportGenerator generatePdfReport = new PdfReportGenerator();
        ByteArrayOutputStream bos = generatePdfReport.teacherScheduleReport(schedule, language);
        String teacherEmail = teacher.getEmail();
        String fileName = String.format("%s_%s_%s_%s.pdf",
                semesterService.getById(semesterId).getDescription(),
                teacher.getSurname(), teacher.getName(), teacher.getPatronymic());
        String subject = "Schedule";
        String body = String.format("Schedule for %s %s %s",
                teacher.getSurname(), teacher.getName(), teacher.getPatronymic());
        mailService.send(fileName, teacherEmail, subject, body, bos);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
    public Map<Room, List<Schedule>> getAllOrdered(Long semesterId) {
        log.info("In getAllOrdered(semesterId = [{}])", semesterId);
        return scheduleRepository.getAllOrdered(semesterId).stream()
                .collect(Collectors.groupingBy(Schedule::getRoom, LinkedHashMap::new, Collectors.toList()));
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "scheduleDTO", key = "#semesterId")
    public ScheduleFullDTO getFullScheduleForSemester(Long semesterId) {
        log.info("In getFullScheduleForSemester(semesterId = [{}])", semesterId);

        SemesterWithGroupsDTO semesterDTO = semesterService.getById(semesterId);
        Set<DayOfWeek> daysOfWeek = semesterDTO.getDaysOfWeek();
        Set<PeriodDTO> periods = semesterDTO.getPeriods();

        List<Schedule> allSchedules = scheduleRepository.findAllBySemesterWithDetails(semesterId);

        Map<Long, Map<DayOfWeek, Map<Long, Map<EvenOdd, Schedule>>>> grouped = allSchedules.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getLesson().getGroup().getId(),
                        Collectors.groupingBy(
                                Schedule::getDayOfWeek,
                                Collectors.groupingBy(
                                        s -> s.getPeriod().getId(),
                                        Collectors.toMap(
                                                Schedule::getEvenOdd,
                                                s -> s,
                                                (a, b) -> a.getEvenOdd() == EvenOdd.WEEKLY ? a : b
                                        )
                                )
                        )
                ));

        List<Group> groups = allSchedules.stream()
                .map(s -> s.getLesson().getGroup())
                .distinct()
                .sorted(Comparator.comparingInt(Group::getSortOrder))
                .toList();

        ScheduleFullDTO scheduleFullDTO = new ScheduleFullDTO();
        scheduleFullDTO.setSemester(semesterDTO);

        List<ScheduleForGroupDTO> scheduleForGroupDTOList = groups.stream()
                .map(group -> {
                    ScheduleForGroupDTO dto = new ScheduleForGroupDTO();
                    dto.setGroup(groupMapper.groupToGroupDTO(group));
                    dto.setDays(buildDaysFromMemory(group.getId(), daysOfWeek, periods, grouped));
                    return dto;
                })
                .toList();

        scheduleFullDTO.setSchedule(scheduleForGroupDTOList);
        return scheduleFullDTO;
    }

    private List<DaysOfWeekWithClassesForGroupDTO> buildDaysFromMemory(
            Long groupId,
            Set<DayOfWeek> daysOfWeek,
            Set<PeriodDTO> periods,
            Map<Long, Map<DayOfWeek, Map<Long, Map<EvenOdd, Schedule>>>> grouped) {

        Map<DayOfWeek, Map<Long, Map<EvenOdd, Schedule>>> groupSchedules =
                grouped.getOrDefault(groupId, Collections.emptyMap());

        return new TreeSet<>(daysOfWeek).stream()
                .map(day -> {
                    DaysOfWeekWithClassesForGroupDTO dto = new DaysOfWeekWithClassesForGroupDTO();
                    dto.setDay(day);
                    dto.setClasses(buildClassesFromMemory(day, periods, groupSchedules));
                    return dto;
                })
                .toList();
    }

    private List<ClassesInScheduleForGroupDTO> buildClassesFromMemory(
            DayOfWeek day,
            Set<PeriodDTO> periods,
            Map<DayOfWeek, Map<Long, Map<EvenOdd, Schedule>>> groupSchedules) {

        Map<Long, Map<EvenOdd, Schedule>> daySchedules =
                groupSchedules.getOrDefault(day, Collections.emptyMap());

        return periods.stream()
                .map(period -> {
                    ClassesInScheduleForGroupDTO dto = new ClassesInScheduleForGroupDTO();
                    dto.setPeriod(period);
                    dto.setWeeks(buildWeeksFromMemory(period.getId(), daySchedules));
                    return dto;
                })
                .toList();
    }

    private LessonInScheduleByWeekDTO buildWeeksFromMemory(
            Long periodId,
            Map<Long, Map<EvenOdd, Schedule>> daySchedules) {

        Map<EvenOdd, Schedule> periodSchedules = daySchedules.getOrDefault(periodId, Collections.emptyMap());

        LessonInScheduleByWeekDTO result = new LessonInScheduleByWeekDTO();
        result.setEven(buildLessonDTO(periodSchedules, EvenOdd.EVEN));
        result.setOdd(buildLessonDTO(periodSchedules, EvenOdd.ODD));
        return result;
    }

    private LessonsInScheduleDTO buildLessonDTO(Map<EvenOdd, Schedule> periodSchedules, EvenOdd evenOdd) {
        Schedule schedule = periodSchedules.get(evenOdd);
        if (schedule == null) {
            schedule = periodSchedules.get(EvenOdd.WEEKLY);
        }
        if (schedule == null) {
            return null;
        }

        LessonsInScheduleDTO dto = lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(schedule.getLesson());
        dto.setRoom(roomForScheduleMapper.roomToRoomForScheduleDTO(schedule.getRoom()));
        return dto;
    }

    @Override
    @Transactional
    public List<ScheduleWithoutSemesterDTO> saveSchedule(ScheduleSaveDTO scheduleSaveDTO) {
        log.info("In saveSchedule(scheduleSaveDTO = [{}])", scheduleSaveDTO);

        Lesson lesson = lessonRepository.findById(scheduleSaveDTO.getLessonId())
                .orElseThrow(() -> new EntityNotFoundException(
                        Lesson.class, "id", scheduleSaveDTO.getLessonId().toString()));

        Room room = roomRepository.findById(scheduleSaveDTO.getRoomId())
                .orElseThrow(() -> new EntityNotFoundException(
                        Room.class, "id", scheduleSaveDTO.getRoomId().toString()));

        Period period = periodRepository.findById(scheduleSaveDTO.getPeriodId())
                .orElseThrow(() -> new EntityNotFoundException(
                        Period.class, "id", scheduleSaveDTO.getPeriodId().toString()));

        Schedule schedule = scheduleSaveMapper.scheduleSaveDTOToSchedule(scheduleSaveDTO);
        schedule.setLesson(lesson);
        schedule.setRoom(room);
        schedule.setPeriod(period);

        List<Long> savedIds = new ArrayList<>();
        if (lesson.isGrouped()) {
            List<Schedule> schedules = schedulesForGroupedLessons(schedule);
            schedules.forEach(this::checkReferences);
            for (Schedule s : schedules) {
                s.setRoom(room);
                s.setPeriod(period);
                Schedule saved = scheduleRepository.save(s);
                savedIds.add(saved.getId());
            }
        } else {
            checkReferences(schedule);
            Schedule saved = scheduleRepository.save(schedule);
            savedIds.add(saved.getId());
        }

        entityManager.flush();
        entityManager.clear();

        List<Schedule> savedSchedules = savedIds.stream()
                .map(id -> scheduleRepository.findByIdWithDetails(id).orElseThrow())
                .toList();

        cacheService.evictCachesForSchedule(
                lesson.getSemester().getId(),
                lesson.getGroup().getId(),
                lesson.getTeacher().getId()
        );

        return scheduleWithoutSemesterMapper.scheduleToScheduleWithoutSemesterDTOs(savedSchedules);
    }

    @Override
    @Transactional
    public ScheduleDTO changeRoom(Long scheduleId, Long roomId) {
        log.info("In changeRoom(scheduleId = [{}], roomId = [{}])", scheduleId, roomId);

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new EntityNotFoundException(Schedule.class, "id", scheduleId.toString()));

        // If room is the same - return without changes
        if (schedule.getRoom().getId().equals(roomId)) {
            return scheduleMapper.scheduleToScheduleDTO(schedule);
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException(Room.class, "id", roomId.toString()));

        schedule.setRoom(room);
        Schedule updated = scheduleRepository.update(schedule);

        // Evict caches after room change
        Lesson lesson = schedule.getLesson();
        cacheService.evictCachesForSchedule(
                lesson.getSemester().getId(),
                lesson.getGroup().getId(),
                lesson.getTeacher().getId()
        );

        return scheduleMapper.scheduleToScheduleDTO(updated);
    }

    @Override
    @Transactional
    public List<Long> deleteScheduleById(Long id) {
        log.info("In deleteScheduleById(id = [{}])", id);

        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Schedule.class, "id", id.toString()));

        List<Long> deletedIds = new ArrayList<>();

        if (schedule.getLesson().isGrouped()) {
            List<Schedule> schedules = getSchedulesForGroupedLessons(schedule);
            schedules.forEach(s -> {
                delete(s);
                deletedIds.add(s.getId());
            });
        } else {
            delete(schedule);
            deletedIds.add(schedule.getId());
        }

        return deletedIds;
    }
}
