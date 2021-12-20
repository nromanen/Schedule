package com.softserve.service.impl;


import com.softserve.dto.*;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.MessageNotSendException;
import com.softserve.exception.ScheduleConflictException;
import com.softserve.mapper.*;
import com.softserve.repository.ScheduleRepository;
import com.softserve.service.*;
import com.softserve.util.PdfReportGenerator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import java.io.ByteArrayOutputStream;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Transactional
@Service
@Slf4j
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;

    private final LessonService lessonService;
    private final RoomService roomService;
    private final GroupService groupService;
    private final TeacherService teacherService;
    private final SemesterService semesterService;
    private final UserService userService;
    private final MailService mailService;



    @Autowired
    public ScheduleServiceImpl(ScheduleRepository scheduleRepository, LessonService lessonService, RoomService roomService,
                               GroupService groupService, TeacherService teacherService,
                               SemesterService semesterService, UserService userService, MailService mailService) {
        this.scheduleRepository = scheduleRepository;
        this.lessonService = lessonService;
        this.roomService = roomService;
        this.groupService = groupService;
        this.teacherService = teacherService;
        this.semesterService = semesterService;
        this.userService = userService;
        this.mailService = mailService;
    }

    /**
     * Method gets information from Repository for particular Schedule with id parameter
     *
     * @param id Identity number of the Schedule
     * @return Schedule entity
     */
    @Override
    public Schedule getById(Long id) {
        log.info("In getById(id = [{}])", id);
        return scheduleRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Schedule.class, "id", id.toString()));
    }

    /**
     * Method gets information about all Schedules from Repository
     *
     * @return List of all Schedules
     */
    @Override
    public List<Schedule> getAll() {
        log.debug("In getAll()");
        return scheduleRepository.getAll();
    }

    /**
     * Method saves new Schedule to Repository
     *
     * @param schedule Schedule entity with info to be saved
     * @return saved Schedule entity
     */
    @Override
    public Schedule save(Schedule schedule) {
        log.info("In save(entity = [{}]", schedule);
        if (isConflictForGroupInSchedule(schedule.getLesson().getSemester().getId(), schedule.getDayOfWeek(), schedule.getEvenOdd(), schedule.getPeriod().getId(), schedule.getLesson().getId())) {
            log.error("Schedule for group with id [{}] has conflict with already existing", schedule.getLesson().getGroup().getId());
            throw new ScheduleConflictException("You can't create schedule item for this group, because one already exists");
        } else {
            return scheduleRepository.save(schedule);
        }
    }

    /**
     * Method create List of schedules in accordance to grouped lessons
     *
     * @param schedule Schedule entity with grouped lesson
     * @return List of schedules for grouped lessons
     */
    @Override
    public List<Schedule> schedulesForGroupedLessons(Schedule schedule) {
        log.info("In schedulesForGroupedLessons(schedule = [{}]", schedule);
        List<Schedule> schedules = new ArrayList<>();
        List<Lesson> lessons = lessonService.getAllGroupedLessonsByLesson(schedule.getLesson());
        lessons.forEach(lesson -> {
            Schedule newSchedule = new Schedule();
            newSchedule.setRoom(schedule.getRoom());
            newSchedule.setDayOfWeek(schedule.getDayOfWeek());
            newSchedule.setPeriod(schedule.getPeriod());
            newSchedule.setEvenOdd(schedule.getEvenOdd());
            newSchedule.setLesson(lesson);
            schedules.add(newSchedule);
        });
        return schedules;
    }

    @Override
    public List<Schedule> getSchedulesForGroupedLessons(Schedule schedule) {
        log.info("In getSchedulesForGroupedLessons(schedule = [{}]", schedule);
        List<Schedule> schedules = new ArrayList<>();
        schedulesForGroupedLessons(schedule).forEach(schedule1 -> {
            schedules.add(scheduleRepository.getScheduleByObject(schedule1));
        });
        return schedules;
    }

    @Override
    public void checkReferences(Schedule schedule) {
        if (isLessonInScheduleByLessonIdPeriodIdEvenOddDayOfWeek(schedule.getLesson().getId(), schedule.getPeriod().getId(), schedule.getEvenOdd(), schedule.getDayOfWeek())) {
            log.error("Lessons with group title [{}] already exists in schedule", schedule.getLesson().getGroup().getTitle());
            throw new EntityAlreadyExistsException("Lessons with this group title already exists");
        }
        if (isConflictForGroupInSchedule(schedule.getLesson().getSemester().getId(), schedule.getDayOfWeek(), schedule.getEvenOdd(), schedule.getPeriod().getId(), schedule.getLesson().getId())) {
            log.error("Schedule for group with id [{}] has conflict with already existing", schedule.getLesson().getGroup().getId());
            throw new ScheduleConflictException("You can't create schedule item for this group, because one already exists");
        }
    }


    /**
     * Method updates information for an existing Schedule in Repository
     *
     * @param object Schedule entity with info to be updated
     * @return updated Schedule entity
     */
    @Override
    public Schedule update(Schedule object) {
        log.info("In update(entity = [{}]", object);
        if (isConflictForGroupInSchedule(object.getLesson().getSemester().getId(), object.getDayOfWeek(), object.getEvenOdd(), object.getPeriod().getId(), object.getLesson().getId())) {
            throw new ScheduleConflictException("You can't update schedule item for this group, because it violates already existing");
        } else {
            return scheduleRepository.update(object);
        }
    }

    /**
     * Method deletes an existing Schedule from Repository
     *
     * @param object Schedule entity to be deleted
     * @return deleted Schedule entity
     */
    @Override
    public Schedule delete(Schedule object) {
        return scheduleRepository.delete(object);
    }

    /**
     * Method returns necessary info to finish saving schedule
     *
     * @param semesterId the semester id in which schedule have to be saved
     * @param dayOfWeek  the semester id in which schedule have to be saved
     * @param evenOdd    lesson occurs by EVEN/ODD/WEEKLY
     * @param classId    period id in which schedule have to be saved
     * @param lessonId   lesson id that pretends t be saved
     * @return CreateScheduleInfoDTO - necessary info to finish saving schedule
     */
    @Override
    public CreateScheduleInfoDTO getInfoForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId) {
        log.info("In getInfoForCreatingSchedule (semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], lessonId = [{}])", semesterId, dayOfWeek, evenOdd, classId, lessonId);
        //checking for missing parameters and wrong types is skipped, because it handles automatically by GlobalExceptionHandler
        if (isConflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, lessonId)) {
            log.error("Schedule for group already exists");
            throw new ScheduleConflictException("You can't create schedule for this group, because one already exists");
        } else {
            CreateScheduleInfoDTO createScheduleInfoDTO = new CreateScheduleInfoDTO();
            createScheduleInfoDTO.setTeacherAvailable(isTeacherAvailableForSchedule(semesterId, dayOfWeek, evenOdd, classId, lessonId));
            createScheduleInfoDTO.setRooms(roomService.getAllRoomsForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId));
            return createScheduleInfoDTO;
        }
    }

    //verifies if group has conflict in schedule when it saves
    @Override
    public boolean isConflictForGroupInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId) {
        log.info("In isConflictForGroupInSchedule(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], lessonId = [{}])", semesterId, dayOfWeek, evenOdd, classId, lessonId);
        //Get group ID from Lesson by lesson ID to search further by group ID
        Long groupId = lessonService.getById(lessonId).getGroup().getId();
        //If Repository doesn't count any records that means there are no conflicts for this group at that point of time
        return scheduleRepository.conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId) != 0;
    }

    //verifies if teacher already has another schedule at  at some semester (by semester id) at some day for some period(by classId)
    private boolean isTeacherAvailableForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId) {
        log.info("In isTeacherAvailable (semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], lessonId = [{}]", semesterId, dayOfWeek, evenOdd, classId, lessonId);
        //Get teacher ID from Lesson by lesson ID to search further by teacher ID
        Long teacherId = lessonService.getById(lessonId).getTeacher().getId();
        return scheduleRepository.conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId) == 0;
    }

    /**
     * Method gets full schedule for groups in particular semester
     *
     * @param semesterId id of semester
     * @param groupId    group id
     * @return filled schedule for group
     */
    @Override
    public Map<Group, List<Schedule>> getFullScheduleForGroup(Long semesterId, Long groupId) {
        log.info("In getFullSchedule(semesterId = [{}], groupId[{}])", semesterId, groupId);
        List<Schedule> schedules;
        if (semesterId != null && groupId != null) {
            schedules = scheduleRepository.getSchedulesBySemesterGroup(semesterId, groupId);
        } else {
            schedules = scheduleRepository.getAll();
        }
        return schedules.stream()
                .collect(Collectors.groupingBy(s-> s.getLesson().getGroup()));
    }

    /**
     * Method gets full schedule for groups in particular semester
     *
     * @param semesterId id of semester
     * @return filled schedule for all groups that have any lessons in that semester
     */
    @Override
    public List<Schedule> getFullScheduleForSemester(Long semesterId) {
        return scheduleRepository.getScheduleBySemester(semesterId);
    }

    /**
     * Method gets full schedule for teacher in particular semester
     *
     * @param semesterId id of semester
     * @param teacherId  id of teacher
     * @return filled schedule for teacher
     */
    @Override
    public List<Schedule> getScheduleForTeacher(Long semesterId, Long teacherId) {
        log.info("In getScheduleForTeacher(semesterId = [{}], teacherId[{}])", semesterId, teacherId);
        return scheduleRepository.getSchedulesBySemesterTeacher(semesterId, teacherId);
    }

    @Override
    public List<Schedule> getAllSchedulesByTeacherIdAndSemesterId(Long teacherId, Long semesterId) {
        log.info("Enter into getAllSchedulesByTeacherIdAndSemesterId with teacherId = {}, semesterId = {}", teacherId, semesterId);
        return scheduleRepository.getAllSchedulesByTeacherIdAndSemesterId(teacherId, semesterId);
    }

    @Override
    public Map<Room, List<Schedule>> getScheduleForRooms(Long semesterId) {
        log.info("Enter into getScheduleForRooms({})", semesterId);
        List<Schedule> schedulesForRooms = scheduleRepository.getSchedulesOrderedByRooms(semesterId);

        return schedulesForRooms
                .stream()
                .collect(Collectors.groupingBy(Schedule::getRoom));
    }

    @Override
    public List<Schedule> getSchedulesBySemester(Long semesterId) {
        log.info("In getScheduleBySemester(Long semesterId = [{}])", semesterId);
        return scheduleRepository.getScheduleBySemester(semesterId);
    }


    /**
     * Method scheduleByDateRangeForTeacher get all schedules and temporary schedules from db in particular date range
     * scheduleByDateRangeForTeacher
     *
     * @param fromDate  LocalDate from
     * @param toDate    LocalDate to
     * @param teacherId id teacher
     * @return list of schedules and temporary schedules
     */
    @Override
    public List<Schedule> scheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId) {
        log.info("In scheduleByDateRangeForTeacher with fromDate = {} and toDate = {} and teacher = {}", fromDate, toDate, teacherId);
        List<Schedule> schedules = scheduleRepository.scheduleByDateRangeForTeacher(fromDate, toDate, teacherId);

        List<Schedule> dateRangeSchedule = new ArrayList<>();
        for (Schedule schedule : schedules) {
            if (isDateInSemesterDateRange(schedule, toDate)) {
                dateRangeSchedule.add(schedule);
            }
        }

        return dateRangeSchedule;
    }

    /**
     * Method deleteSchedulesBySemesterId delete all schedules from db in with current semesterId
     *
     * @param semesterId id Semester for delete schedule
     */
    @Override
    public void deleteSchedulesBySemesterId(Long semesterId) {
        log.info("In deleteSchedulesBySemesterId with semesterId = {}", semesterId);
        scheduleRepository.deleteSchedulesBySemesterId(semesterId);
    }

    /**
     * Method saveScheduleDuringCopy save Schedule in db
     *
     * @param schedule Schedule entity for save schedule in db
     * @return Schedule entity after saved in db
     */
    @Override
    public Schedule saveScheduleDuringCopy(Schedule schedule) {
        log.info("In saveScheduleDuringCopy with schedule = {}", schedule);
        return scheduleRepository.save(schedule);
    }

    /**
     * Method updateWithoutChecks update Schedule in db
     *
     * @param schedule Schedule entity for update schedule in db
     * @return Schedule entity after update in db
     */
    @Override
    public Schedule updateWithoutChecks(Schedule schedule) {
        log.info("In updateWithoutChecks with schedule = {}", schedule);
        return scheduleRepository.update(schedule);
    }

    /**
     * Method counts schedule records in db for lesson by lessonsId
     *
     * @param lessonId id of the lesson
     * @return number of records in db
     */
    @Override
    public Long countInputLessonsInScheduleByLessonId(Long lessonId) {
        log.info("In countInputLessonsInScheduleByLessonId(lessonId = [{}])", lessonId);
        return scheduleRepository.countInputLessonsInScheduleByLessonId(lessonId);
    }

    /**
     * Method return boolean value for schedule records in db by lessonsId, periodId, EvenOdd and DayOfWeek
     *
     * @param lessonId id of the lesson
     * @param periodId id of the Period
     * @param evenOdd  Even/Odd
     * @param day      day of Week
     * @return true if count equals 0 and false in another case
     */
    @Override
    public boolean isLessonInScheduleByLessonIdPeriodIdEvenOddDayOfWeek(Long lessonId, Long periodId, EvenOdd evenOdd, DayOfWeek day) {
        log.info("In countByLessonIdPeriodIdEvenOddDayOfWeek(lessonId = [{}], periodId = [{}], evenOdd = [{}], day = [{}])", lessonId, periodId, evenOdd, day);
        return scheduleRepository.countByLessonIdPeriodIdEvenOddDayOfWeek(lessonId, periodId, evenOdd, day) != 0;
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

    /**
     * The method used for sending schedules to teachers
     *
     * @param semesterId semester for schedule
     * @param teachersId id of teachers to whom we need to send the schedule
     */
    @Override
    public void sendScheduleToTeachers(Long semesterId, Long[] teachersId, Locale language) {
        log.info("Enter into sendScheduleToTeachers of TeacherServiceImpl");
        Arrays.stream(teachersId).forEach(teacherId -> {
            try {
                sendScheduleToTeacher(semesterId, teacherId, language);
            } catch (MessagingException e) {
                throw new MessageNotSendException(e.getMessage());
            }
        });
    }

    /**
     * The method used for sending schedules to one teacher
     *
     * @param semesterId semester for schedule
     * @param teacherId  id of teacher to which we need to send the schedule
     */
    @Override
    public void sendScheduleToTeacher(Long semesterId, Long teacherId, Locale language) throws MessagingException {
        log.info("Enter into sendScheduleToTeacher of TeacherServiceImpl");
        Teacher teacher = teacherService.getById(teacherId);
        ScheduleForTeacherDTO schedule = new ScheduleForTeacherDTO();
        PdfReportGenerator generatePdfReport = new PdfReportGenerator();
        ByteArrayOutputStream bos = generatePdfReport.teacherScheduleReport(schedule, language);
        String teacherEmail = userService.getById(teacher.getUserId()).getEmail();
        mailService.send(String.format("%s_%s_%s_%s.pdf", semesterService.getById(semesterId).getDescription(), teacher.getSurname(), teacher.getName(), teacher.getPatronymic()),
                teacherEmail,
                "Schedule",
                String.format("Schedule for %s %s %s", teacher.getSurname(), teacher.getName(), teacher.getPatronymic()),
                bos);
    }
}



