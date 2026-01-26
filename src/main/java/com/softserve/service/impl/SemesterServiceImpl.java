package com.softserve.service.impl;

import com.softserve.dto.SemesterDTO;
import com.softserve.dto.SemesterWithGroupsDTO;
import com.softserve.entity.*;
import com.softserve.exception.*;
import com.softserve.mapper.SemesterMapper;
import com.softserve.repository.*;
import com.softserve.service.PeriodService;
import com.softserve.service.SemesterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SemesterServiceImpl implements SemesterService {

    private final SemesterRepository semesterRepository;
    private final ScheduleRepository scheduleRepository;
    private final LessonRepository lessonRepository;
    private final GroupRepository groupRepository;
    private final PeriodService periodService;
    private final SemesterMapper semesterMapper;
    private final PeriodRepository periodRepository;

    private static final List<DayOfWeek> WORK_DAYS = Arrays.asList(
            DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY, DayOfWeek.FRIDAY
    );

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "semesters", key = "#id")
    public SemesterWithGroupsDTO getById(Long id) {
        log.info("In getById(id = [{}])", id);
        Semester semester = findByIdOrThrow(id);
        SemesterWithGroupsDTO dto = semesterMapper.semesterToSemesterWithGroupsDTO(semester);

        if (dto.getGroups() != null) {
            var enabledGroups = dto.getGroups().stream()
                    .filter(g -> !Boolean.TRUE.equals(g.getDisable()))
                    .collect(Collectors.toCollection(LinkedList::new));
            dto.setGroups(enabledGroups);
        }

        return dto;
    }


    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "semestersList")
    public List<SemesterWithGroupsDTO> getAll() {
        log.debug("In getAll()");
        return semesterMapper.semestersToSemesterWithGroupsDTOs(semesterRepository.getAll());
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "semesters", allEntries = true),
            @CacheEvict(value = "semestersList", allEntries = true)
    })
    public SemesterWithGroupsDTO save(SemesterWithGroupsDTO semesterDTO) {
        log.info("In save(semesterDTO = [{}])", semesterDTO);
        Semester semester = semesterMapper.semesterWithGroupsDTOToSemester(semesterDTO);
        checkConstraints(semester);
        fillDefaultValues(semester);
        handleCurrentSemester(semester);
        handleDefaultSemester(semester);
        Semester saved = semesterRepository.save(semester);
        return semesterMapper.semesterToSemesterWithGroupsDTO(saved);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "semesters", allEntries = true),
            @CacheEvict(value = "semestersList", allEntries = true),
            @CacheEvict(value = "currentSemester", allEntries = true),
            @CacheEvict(value = "defaultSemester", allEntries = true)
    })
    public SemesterWithGroupsDTO update(SemesterWithGroupsDTO semesterDTO) {
        log.debug("In update(semesterDTO = [{}])", semesterDTO);
        Semester semester = semesterMapper.semesterWithGroupsDTOToSemester(semesterDTO);
        findByIdOrThrow(semester.getId());
        checkConstraints(semester);

        if (isPeriodsWithLessonsCanNotBeRemoved(semester)) {
            throw new UsedEntityException("Cannot remove periods that have lessons in schedule");
        }
        if (isDaysWithLessonsCanNotBeRemoved(semester)) {
            throw new UsedEntityException("Cannot remove days that have lessons in schedule");
        }

        handleCurrentSemester(semester);
        handleDefaultSemester(semester);
        Semester updated = semesterRepository.update(semester);
        return semesterMapper.semesterToSemesterWithGroupsDTO(updated);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "semesters", allEntries = true),
            @CacheEvict(value = "semestersList", allEntries = true),
            @CacheEvict(value = "currentSemester", allEntries = true),
            @CacheEvict(value = "defaultSemester", allEntries = true)
    })
    public void delete(Long id) {
        log.debug("In delete(id = [{}])", id);
        Semester semester = findByIdOrThrow(id);
        semesterRepository.delete(semester);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "currentSemester")
    public SemesterWithGroupsDTO getCurrentSemester() {
        log.debug("In getCurrentSemester");
        Semester semester = semesterRepository.getCurrentSemester()
                .orElseThrow(() -> new ScheduleConflictException("Current semester for managers work isn't specified"));
        return semesterMapper.semesterToSemesterWithGroupsDTO(semester);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "defaultSemester")
    public SemesterWithGroupsDTO getDefaultSemester() {
        log.debug("In getDefaultSemester");
        Semester semester = semesterRepository.getDefaultSemester()
                .orElseThrow(() -> new ScheduleConflictException("Default semester isn't specified"));
        return semesterMapper.semesterToSemesterWithGroupsDTO(semester);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SemesterDTO> getDisabled() {
        log.debug("In getDisabled()");
        return semesterMapper.semestersToSemesterDTOs(semesterRepository.getDisabled());
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "semesters", allEntries = true),
            @CacheEvict(value = "semestersList", allEntries = true),
            @CacheEvict(value = "currentSemester", allEntries = true)
    })
    public SemesterDTO changeCurrentSemester(Long semesterId) {
        log.debug("In changeCurrentSemester(semesterId = [{}])", semesterId);
        semesterRepository.updateAllSemesterCurrentToFalse();
        semesterRepository.setCurrentSemester(semesterId);
        Semester semester = findByIdOrThrow(semesterId);
        return semesterMapper.semesterToSemesterDTO(semester);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "semesters", allEntries = true),
            @CacheEvict(value = "semestersList", allEntries = true),
            @CacheEvict(value = "defaultSemester", allEntries = true)
    })
    public SemesterDTO changeDefaultSemester(Long semesterId) {
        log.debug("In changeDefaultSemester(semesterId = [{}])", semesterId);
        semesterRepository.updateAllSemesterDefaultToFalse();
        semesterRepository.setDefaultSemester(semesterId);
        Semester semester = findByIdOrThrow(semesterId);
        return semesterMapper.semesterToSemesterDTO(semester);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "semesters", allEntries = true),
            @CacheEvict(value = "semestersList", allEntries = true)
    })
    public SemesterWithGroupsDTO addGroupsToSemester(Long semesterId, List<Long> groupIds) {
        log.info("In addGroupsToSemester(semesterId = [{}], groupIds = [{}])", semesterId, groupIds);
        Semester semester = findByIdOrThrow(semesterId);
        List<Group> groups = groupRepository.getGroupsByGroupIds(groupIds);
        semester.setGroups(new HashSet<>(groups));
        Semester updated = semesterRepository.update(semester);
        return semesterMapper.semesterToSemesterWithGroupsDTO(updated);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "semesters", key = "#toSemesterId"),
            @CacheEvict(value = "semestersList", allEntries = true),
            @CacheEvict(value = "semesterSchedules", key = "#toSemesterId"),
            @CacheEvict(value = "scheduleDTO", key = "#toSemesterId"),
            @CacheEvict(value = "scheduleForGroup", allEntries = true),
            @CacheEvict(value = "scheduleForTeacher", allEntries = true)
    })
    public SemesterWithGroupsDTO copySemester(Long fromSemesterId, Long toSemesterId) {
        log.info("In copySemester(fromSemesterId = [{}], toSemesterId = [{}])", fromSemesterId, toSemesterId);
        Semester toSemester = findByIdOrThrow(toSemesterId);
        Semester fromSemester = findByIdOrThrow(fromSemesterId);
        List<Schedule> schedules = scheduleRepository.getScheduleBySemester(fromSemesterId);

        if (shouldClearSemesterContent(toSemester)) {
            clearSemesterContent(toSemester);
        }

        copyContent(fromSemester, toSemester);
        copySchedules(schedules, copyLessons(schedules, toSemester));

        Semester updated = semesterRepository.update(toSemester);
        return semesterMapper.semesterToSemesterWithGroupsDTO(updated);
    }

    // ==================== Private methods ====================

    private Semester findByIdOrThrow(Long id) {
        return semesterRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Semester.class, "id", id.toString()));
    }

    private void checkConstraints(Semester semester) {
        if (isTimeInvalid(semester)) {
            throw new IncorrectTimeException("The end day cannot be before the start day");
        }
        if (isSemesterExists(semester.getId(), semester.getDescription(), semester.getYear())) {
            throw new EntityAlreadyExistsException("Semester already exists with current description and year.");
        }
    }

    private void fillDefaultValues(Semester semester) {
        if (CollectionUtils.isEmpty(semester.getDaysOfWeek())) {
            semester.setDaysOfWeek(new HashSet<>(WORK_DAYS));
        }
        if (CollectionUtils.isEmpty(semester.getPeriods())) {
            semester.setPeriods(new HashSet<>(periodRepository.getFistFourPeriods()));
        }
    }

    private void handleCurrentSemester(Semester semester) {
        if (semester.isCurrentSemester()) {
            semesterRepository.updateAllSemesterCurrentToFalse();
            semesterRepository.setCurrentSemester(semester.getId());
        }
    }

    private void handleDefaultSemester(Semester semester) {
        if (semester.isDefaultSemester()) {
            semesterRepository.updateAllSemesterDefaultToFalse();
            semesterRepository.setDefaultSemester(semester.getId());
        }
    }

    private boolean isTimeInvalid(Semester semester) {
        return semester.getStartDay().isAfter(semester.getEndDay()) ||
                semester.getStartDay().equals(semester.getEndDay());
    }

    private boolean isSemesterExists(Long semesterId, String description, int year) {
        return semesterRepository.getSemesterByDescriptionAndYear(description, year)
                .map(existing -> !existing.getId().equals(semesterId))
                .orElse(false);
    }

    private boolean isDaysWithLessonsCanNotBeRemoved(Semester semester) {
        List<DayOfWeek> daysInSchedule = semesterRepository.getDaysWithLessonsBySemesterId(semester.getId());
        return !semester.getDaysOfWeek().containsAll(daysInSchedule);
    }

    private boolean isPeriodsWithLessonsCanNotBeRemoved(Semester semester) {
        List<Period> periodsInSchedule = semesterRepository.getPeriodsWithLessonsBySemesterId(semester.getId());
        return !semester.getPeriods().containsAll(periodsInSchedule);
    }

    private boolean shouldClearSemesterContent(Semester semester) {
        return CollectionUtils.isNotEmpty(semester.getGroups())
                || CollectionUtils.isNotEmpty(semester.getPeriods())
                || CollectionUtils.isNotEmpty(semester.getDaysOfWeek());
    }

    private void clearSemesterContent(Semester semester) {
        semester.setGroups(new HashSet<>());
        semester.setPeriods(new HashSet<>());
        semester.setDaysOfWeek(new HashSet<>());
    }

    private void copyContent(Semester from, Semester to) {
        List<Long> groupIds = from.getGroups().stream()
                .map(Group::getId)
                .collect(Collectors.toList());
        List<Group> groups = groupRepository.getGroupsByGroupIds(groupIds);
        to.setGroups(new HashSet<>(groups));
        to.getDaysOfWeek().addAll(from.getDaysOfWeek());
        to.getPeriods().addAll(from.getPeriods());
    }

    private Map<Long, Lesson> copyLessons(List<Schedule> schedules, Semester toSemester) {
        Set<Lesson> lessonSet = schedules.stream()
                .map(Schedule::getLesson)
                .collect(Collectors.toSet());

        Map<Long, Lesson> oldToNewLessonMap = new HashMap<>();
        for (Lesson lesson : lessonSet) {
            Lesson newLesson = new Lesson();
            newLesson.setSemester(toSemester);
            newLesson.setHours(lesson.getHours());
            newLesson.setLessonType(lesson.getLessonType());
            newLesson.setSubjectForSite(lesson.getSubjectForSite());
            newLesson.setGroup(lesson.getGroup());
            newLesson.setSubject(lesson.getSubject());
            newLesson.setTeacher(lesson.getTeacher());
            newLesson.setGrouped(lesson.isGrouped());
            newLesson.setLinkToMeeting(lesson.getLinkToMeeting());
            Lesson saved = lessonRepository.save(newLesson);
            oldToNewLessonMap.put(lesson.getId(), saved);
        }
        return oldToNewLessonMap;
    }

    private void copySchedules(List<Schedule> schedules, Map<Long, Lesson> oldToNewLessonMap) {
        for (Schedule schedule : schedules) {
            Schedule newSchedule = new Schedule();
            newSchedule.setDayOfWeek(schedule.getDayOfWeek());
            newSchedule.setEvenOdd(schedule.getEvenOdd());
            newSchedule.setLesson(oldToNewLessonMap.get(schedule.getLesson().getId()));
            newSchedule.setPeriod(schedule.getPeriod());
            newSchedule.setRoom(schedule.getRoom());
            scheduleRepository.save(newSchedule);
        }
    }
}

