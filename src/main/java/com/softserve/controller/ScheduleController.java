package com.softserve.controller;

import com.softserve.dto.*;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.LessonType;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.mapper.*;
import com.softserve.security.jwt.JwtUser;
import com.softserve.service.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@Api(tags = "Schedule API")
@Slf4j
@RequestMapping("/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final SemesterService semesterService;
    private final SemesterMapper semesterMapper;
    private final ScheduleMapper scheduleMapper;
    private final ScheduleSaveMapper scheduleSaveMapper;
    private final ScheduleWithoutSemesterMapper scheduleWithoutSemesterMapper;
    private final TeacherService teacherService;
    private final PeriodMapper periodMapper;
    private final RoomForScheduleMapper roomForScheduleMapper;
    private final LessonsInScheduleMapper lessonsInScheduleMapper;
    private final LessonService lessonService;
    private final RoomService roomService;

    @Autowired
    public ScheduleController(ScheduleService scheduleService, SemesterService semesterService, SemesterMapper semesterMapper, ScheduleMapper scheduleMapper, ScheduleSaveMapper scheduleSaveMapper, ScheduleWithoutSemesterMapper scheduleWithoutSemesterMapper, TeacherService teacherService, PeriodMapper periodMapper, RoomForScheduleMapper roomForScheduleMapper, LessonService lessonService, LessonsInScheduleMapper lessonsInScheduleMapper, RoomService roomService) {
        this.scheduleService = scheduleService;
        this.semesterService = semesterService;
        this.semesterMapper = semesterMapper;
        this.scheduleMapper = scheduleMapper;
        this.scheduleSaveMapper = scheduleSaveMapper;
        this.scheduleWithoutSemesterMapper = scheduleWithoutSemesterMapper;
        this.teacherService = teacherService;
        this.periodMapper = periodMapper;
        this.roomForScheduleMapper = roomForScheduleMapper;
        this.lessonService = lessonService;
        this.lessonsInScheduleMapper = lessonsInScheduleMapper;
        this.roomService = roomService;
    }

    @GetMapping
    @ApiOperation(value = "Get the list of all schedules")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ScheduleDTO>> list() {
        log.info("In list()");
        List<Schedule> schedules = scheduleService.getAll();

        return ResponseEntity.status(HttpStatus.OK).body(scheduleMapper.scheduleToScheduleDTOs(schedules));
    }

    @GetMapping("/semester")
    @ApiOperation(value = "Get the list of all schedules")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ScheduleWithoutSemesterDTO>> listForSemester(@RequestParam Long semesterId) {
        log.info("In listForSemester()");
        List<Schedule> schedules = scheduleService.getSchedulesBySemester(semesterId);
        return ResponseEntity.status(HttpStatus.OK).body(scheduleWithoutSemesterMapper.scheduleToScheduleWithoutSemesterDTOs(schedules));
    }

    @GetMapping("/data-before")
    @ApiOperation(value = "Get the info for finishing creating the schedule")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<CreateScheduleInfoDTO> getInfoForCreatingSchedule(@RequestParam Long semesterId,
                                                                            @RequestParam DayOfWeek dayOfWeek,
                                                                            @RequestParam EvenOdd evenOdd,
                                                                            @RequestParam Long classId,
                                                                            @RequestParam Long lessonId) {
        log.info("In getInfoForCreatingSchedule(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], lessonId = [{}])", semesterId, dayOfWeek, evenOdd, classId, lessonId);
        return ResponseEntity.status(HttpStatus.OK).body(scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId, lessonId));
    }

    @GetMapping("/full/groups")
    @ApiOperation(value = "Get full schedule for groupId in some semester")
    public ResponseEntity<ScheduleFullDTO> getFullScheduleForGroup(@RequestParam Long semesterId,
                                                                   @RequestParam Long groupId) {
        log.info("In, getFullScheduleForGroup (semesterId = [{}], groupId = [{}]) ", semesterId, groupId);
        ScheduleFullDTO scheduleFullDTO = new ScheduleFullDTO();
        scheduleFullDTO.setSemester(semesterMapper.semesterToSemesterDTO(semesterService.getById(semesterId)));
        scheduleFullDTO.setSchedule(scheduleService.getFullScheduleForGroup(semesterId, groupId));
        return ResponseEntity.status(HttpStatus.OK).body(scheduleFullDTO);
    }

    @GetMapping("/full/semester")
    @ApiOperation(value = "Get full schedule for semester")
    public ResponseEntity<ScheduleFullDTO> getFullScheduleForSemester(@RequestParam Long semesterId) {
        log.info("In, getFullScheduleForGroup (semesterId = [{}]) ", semesterId);
        return ResponseEntity.status(HttpStatus.OK).body(scheduleService.getFullScheduleForSemester(semesterId));
    }

    @GetMapping("/full/teachers")
    @ApiOperation(value = "Get full schedule for teacher by semester")
    public ResponseEntity<ScheduleForTeacherDTO> getFullScheduleForTeacher(@RequestParam Long semesterId,
                                                                           @RequestParam Long teacherId) {
        log.info("In, getFullScheduleForTeacher (semesterId = [{}], teacherId = [{}]) ", semesterId, teacherId);
        return ResponseEntity.status(HttpStatus.OK).body(scheduleService.getScheduleForTeacher(semesterId, teacherId));
    }

    @GetMapping("/full/rooms")
    @ApiOperation(value = "Get full schedule for semester. Returns schedule for  rooms")
    public ResponseEntity<List<ScheduleForRoomDTO>> getFullScheduleForRoom(@RequestParam Long semesterId) {
        log.info("In, getFullScheduleForRoom (semesterId = [{}]) ", semesterId);
        List<ScheduleForRoomDTO> scheduleForRoomDTOS = fullDTOForRoomSchedule(scheduleService.getScheduleForRooms(semesterId));
        return ResponseEntity.status(HttpStatus.OK).body(scheduleForRoomDTOS);
    }


    @PostMapping
    @ApiOperation(value = "Create new schedule")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ScheduleSaveDTO> save(@RequestBody ScheduleSaveDTO scheduleSaveDTO) {
        log.info("In save(scheduleSaveDTO = [{}])", scheduleSaveDTO);
        Schedule schedule = scheduleService.save(scheduleSaveMapper.scheduleSaveDTOToSchedule(scheduleSaveDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(scheduleSaveMapper.scheduleToScheduleSaveDTO(schedule));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete schedule by id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity delete(@PathVariable("id") long id) {
        log.info("In delete(id =[{}]", id);
        Schedule schedule = scheduleService.getById(id);
        scheduleService.delete(schedule);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/teacher")
    @ApiOperation(value = "Get full schedule for current teacher by date range")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<ScheduleForTemporaryDateRangeDTO>> getScheduleByDateRangeForCurrentTeacher(@RequestParam String from,
                                                                                                          @RequestParam String to,
                                                                                                          @CurrentUser JwtUser jwtUser) {
        log.info("In getScheduleByDateRangeForCurrentTeacher with from = {} and to = {}", from, to);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        DateTimeFormatter currentFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate fromDate = LocalDate.parse(LocalDate.parse(from, formatter).toString(), currentFormatter);
        LocalDate toDate = LocalDate.parse(LocalDate.parse(to, formatter).toString(), currentFormatter);
        Teacher teacher = teacherService.findByUserId(jwtUser.getId());
        List<ScheduleForTemporaryDateRangeDTO> dto = fullDTOForTemporaryScheduleByTeacherDateRange(scheduleService.temporaryScheduleByDateRangeForTeacher(fromDate, toDate, teacher.getId()));
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    @GetMapping("/full/teachers/date-range")
    @ApiOperation(value = "Get full schedule for teacher by date range")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ScheduleForTemporaryDateRangeDTO>> getScheduleByDateRangeForTeacher(@RequestParam String from,
                                                                                                   @RequestParam String to,
                                                                                                   @RequestParam Long teacherId) {
        log.info("In getScheduleByDateForTeacher with from = {}, to={}, teacherId = {}", from, to, teacherId);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        DateTimeFormatter currentFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate fromDate = LocalDate.parse(LocalDate.parse(from, formatter).toString(), currentFormatter);
        LocalDate toDate = LocalDate.parse(LocalDate.parse(to, formatter).toString(), currentFormatter);
        teacherService.getById(teacherId);
        Map<LocalDate, Map<Period, Map<Schedule, TemporarySchedule>>> mapSchedules = scheduleService.temporaryScheduleByDateRangeForTeacher(fromDate, toDate, teacherId);

        List<ScheduleForTemporaryDateRangeDTO> dto = fullDTOForTemporaryScheduleByTeacherDateRange(mapSchedules);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    @PostMapping("/copy-schedule")
    @ApiOperation(value = "Copy full schedule from one semester to another semester")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ScheduleForCopyDTO>> copySchedule(@RequestParam Long fromSemesterId,
                                                                 @RequestParam Long toSemesterId) {
        log.info("In copySchedule with fromSemesterId = {} and toSemesterId = {}", fromSemesterId, toSemesterId);
        Semester toSemester = semesterService.getById(toSemesterId);
        List<Schedule> schedules = scheduleService.getSchedulesBySemester(fromSemesterId);
        List<Schedule> schedulesForToSemester = scheduleService.getSchedulesBySemester(toSemester.getId());
        if (!schedulesForToSemester.isEmpty()) {
            for (Schedule schedule : schedulesForToSemester) {
                scheduleService.delete(schedule);
            }
        }
        List<Schedule> schedulesForSave = new ArrayList<>();
        for (Schedule schedule : schedules) {
            Lesson lesson = schedule.getLesson();
            lesson.setSemester(toSemester);
            lessonService.saveLessonDuringCopy(lesson);
            schedule.setLesson(lesson);
            schedulesForSave.add(scheduleService.saveScheduleDuringCopy(schedule));
        }
        return ResponseEntity.ok().body(scheduleMapper.scheduleToScheduleForCopyDTOs(schedulesForSave));
    }

    @DeleteMapping("/delete-schedules")
    @ApiOperation(value = "Delete all schedules by semester id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity deleteSchedulesBySemesterId(@RequestParam Long semesterId) {
        log.info("In deleteSchedulesBySemesterId with semesterId = {}", semesterId);
        scheduleService.deleteSchedulesBySemesterId(semesterId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/by-room")
    @ApiOperation(value = "Change schedule by room Id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ScheduleDTO> changeScheduleByRoom(@RequestParam Long scheduleId,
                                                            @RequestParam Long roomId) {
        log.info("In changeScheduleByRoom with scheduleId = {} and roomId = {}", scheduleId, roomId);
        Schedule schedule = scheduleService.getById(scheduleId);
        Room room = roomService.getById(roomId);
        if (schedule.getRoom().getId() == room.getId()) {
            return ResponseEntity.ok().body(scheduleMapper.scheduleToScheduleDTO(schedule));
        }
        schedule.setRoom(room);
        Schedule updateSchedule = scheduleService.updateWithoutChecks(schedule);
        return ResponseEntity.ok().body(scheduleMapper.scheduleToScheduleDTO(updateSchedule));
    }

    @PostMapping("/grouped-lesson")
    @ApiOperation(value = "Save grouped lesson to schedule for all groups")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<MessageDTO> saveGroupedLesson(@RequestBody GroupedLessonDTO groupedLessonDTO) {
        log.info("In saveGroupedLesson with groupedLessonDTO = {}", groupedLessonDTO);
        Schedule schedule = scheduleService.getById(groupedLessonDTO.getScheduleId());
        Long periodId = schedule.getPeriod().getId();
        DayOfWeek day = schedule.getDayOfWeek();
        EvenOdd evenOdd = schedule.getEvenOdd();
        List<Group> groups = new ArrayList<>();
        for (Long lessonId : groupedLessonDTO.getLessons()) {
            schedule.setLesson(lessonService.getById(lessonId));
            if (scheduleService.isLessonInScheduleByLessonIdPeriodIdEvenOddDayOfWeek(lessonId, periodId, evenOdd, day)) {
                groups.add(lessonService.getById(lessonId).getGroup());
            } else {
                scheduleService.save(schedule);
            }
        }
        if (!groups.isEmpty()) {
            throw new EntityAlreadyExistsException("Lessons with this group title already exists in schedule:" + groups.stream().map(Group::getTitle).collect(Collectors.toList()));
        }
        return ResponseEntity.ok().body(new MessageDTO("Grouped lesson successfully saved to schedule"));
    }

    //convert schedule map to schedule dto
    /*private List<ScheduleDateRangeFullDTO> fullDTOForTeacherDateRange(Map<LocalDate, Map<Period, List<Schedule>>> map) {
        List<ScheduleDateRangeFullDTO> fullDTO = new ArrayList<>();

        for (Map.Entry<LocalDate, Map<Period, List<Schedule>>> itr: map.entrySet()) {
            ScheduleDateRangeFullDTO scheduleDateRangeFullDTO = new ScheduleDateRangeFullDTO();
            scheduleDateRangeFullDTO.setDate(itr.getKey());

            List<ScheduleForTeacherDateRangeDTO> scheduleForTeacherDateRangeDTOS = new ArrayList<>();
            for (Map.Entry<Period, List<Schedule>> entry : itr.getValue().entrySet()) {
                ScheduleForTeacherDateRangeDTO scheduleForTeacherDateRangeDTO = new ScheduleForTeacherDateRangeDTO();
                scheduleForTeacherDateRangeDTO.setPeriod(periodMapper.convertToDto(entry.getKey()));

                List<LessonTeacherDTO> lessonsTeacherDateRangeDTOS = new ArrayList<>();
                for (Schedule schedule : entry.getValue()) {
                    LessonsTeacherDateRangeDTO lessonsInScheduleDTO = new LessonsTeacherDateRangeDTO();
                    lessonsInScheduleDTO.setSubjectForSite(schedule.getLesson().getSubjectForSite());
                    lessonsInScheduleDTO.setGroupName(schedule.getLesson().getGroup().getTitle());
                    lessonsInScheduleDTO.setRoom(roomForScheduleMapper.roomToRoomForScheduleDTO(schedule.getRoom()));

                    LessonTeacherDTO lessonTeacherDTO = new LessonTeacherDTO();
                    lessonTeacherDTO.setLesson(lessonsInScheduleDTO);
                    lessonsTeacherDateRangeDTOS.add(lessonTeacherDTO);
                }
                scheduleForTeacherDateRangeDTO.setLessons(lessonsTeacherDateRangeDTOS);
                scheduleForTeacherDateRangeDTOS.add(scheduleForTeacherDateRangeDTO);
            }
            scheduleDateRangeFullDTO.setSchedule(scheduleForTeacherDateRangeDTOS);
            fullDTO.add(scheduleDateRangeFullDTO);
        }
        return fullDTO;
    }*/


    private List<ScheduleForTemporaryDateRangeDTO> fullDTOForTemporaryScheduleByTeacherDateRange(Map<LocalDate, Map<Period, Map<Schedule, TemporarySchedule>>> map) {
        List<ScheduleForTemporaryDateRangeDTO> fullDTO = new ArrayList<>();

        for (Map.Entry<LocalDate, Map<Period, Map<Schedule, TemporarySchedule>>> itr : map.entrySet()) {
            ScheduleForTemporaryDateRangeDTO scheduleForTemporaryDateRangeDTO = new ScheduleForTemporaryDateRangeDTO();
            scheduleForTemporaryDateRangeDTO.setDate(itr.getKey());

            List<ScheduleForTemporaryTeacherDateRangeDTO> scheduleForTemporaryTeacherDateRangeDTOS = new ArrayList<>();
            for (Map.Entry<Period, Map<Schedule, TemporarySchedule>> entry : itr.getValue().entrySet()) {
                for (Map.Entry<Schedule, TemporarySchedule> item : entry.getValue().entrySet()) {
                    ScheduleForTemporaryTeacherDateRangeDTO scheduleForTemporaryTeacherDateRangeDTO = new ScheduleForTemporaryTeacherDateRangeDTO();

                    ScheduleTemporaryTeacherDateRangeDTO lessonsInScheduleDTO = new ScheduleTemporaryTeacherDateRangeDTO();
                    lessonsInScheduleDTO.setId(item.getKey().getId());
                    lessonsInScheduleDTO.setPeriod(periodMapper.convertToDto(entry.getKey()));
                    lessonsInScheduleDTO.setLesson(lessonsInScheduleMapper.lessonToLessonsInTemporaryScheduleDTO(item.getKey().getLesson()));
                    lessonsInScheduleDTO.setPeriod(periodMapper.convertToDto(entry.getKey()));
                    lessonsInScheduleDTO.setRoom(roomForScheduleMapper.roomToRoomForScheduleDTO(item.getKey().getRoom()));

                    if (item.getValue().isVacation()) {
                        lessonsInScheduleDTO.setVacation(true);
                    } else {
                        lessonsInScheduleDTO.setVacation(false);
                    }
                    scheduleForTemporaryTeacherDateRangeDTO.setSchedule(lessonsInScheduleDTO);

                    if (item.getValue().getScheduleId() != null) {
                        ScheduleTemporaryTeacherDateRangeDTO temporaryLessonsInScheduleDTO = new ScheduleTemporaryTeacherDateRangeDTO();
                        temporaryLessonsInScheduleDTO.setId(item.getValue().getId());
                        temporaryLessonsInScheduleDTO.setPeriod(periodMapper.convertToDto(item.getValue().getPeriod()));
                        temporaryLessonsInScheduleDTO.setLesson(lessonsInScheduleMapper.lessonToLessonsInTemporaryScheduleDTO(item.getValue()));
                        temporaryLessonsInScheduleDTO.setRoom(roomForScheduleMapper.roomToRoomForScheduleDTO(item.getValue().getRoom()));
                        temporaryLessonsInScheduleDTO.setVacation(false);
                        scheduleForTemporaryTeacherDateRangeDTO.setTemporarySchedule(temporaryLessonsInScheduleDTO);
                    }
                    scheduleForTemporaryTeacherDateRangeDTOS.add(scheduleForTemporaryTeacherDateRangeDTO);
                    scheduleForTemporaryDateRangeDTO.setSchedules(scheduleForTemporaryTeacherDateRangeDTOS);
                }
            }
            fullDTO.add(scheduleForTemporaryDateRangeDTO);
        }
        return fullDTO;
    }

    private List<ScheduleForRoomDTO> fullDTOForRoomSchedule(Map<Room, Map<DayOfWeek, Map<EvenOdd, Map<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>>>>> schedules) {
        List<ScheduleForRoomDTO> scheduleForRoomDTOS = new ArrayList<>();

        for (Map.Entry<Room, Map<DayOfWeek, Map<EvenOdd, Map<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>>>>> roomItem : schedules.entrySet()) {
            ScheduleForRoomDTO scheduleForRoomDTO = new ScheduleForRoomDTO();
            scheduleForRoomDTO.setRoomId(roomItem.getKey().getId());
            scheduleForRoomDTO.setRoomName(roomItem.getKey().getName());
            scheduleForRoomDTO.setRoomType(roomItem.getKey().getType().getDescription());
            List<DaysOfWeekWithClassesForRoomDTO> daysOfWeekWithClassesForRoomDTOList = new ArrayList<>();
            for (Map.Entry<DayOfWeek, Map<EvenOdd, Map<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>>>> dayItem : roomItem.getValue().entrySet()) {
                DaysOfWeekWithClassesForRoomDTO daysOfWeekWithClassesForRoomDTO = new DaysOfWeekWithClassesForRoomDTO();
                daysOfWeekWithClassesForRoomDTO.setDay(dayItem.getKey());
                List<RoomClassesInScheduleDTO> roomClassesInScheduleDTOList = new ArrayList<>();
                RoomClassesInScheduleDTO roomClassesInScheduleDTO = new RoomClassesInScheduleDTO();
                for (Map.Entry<EvenOdd, Map<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>>> evenOddMapEntry : dayItem.getValue().entrySet()) {
                    List<LessonsInRoomScheduleDTO> evenOddLessonsInRoomScheduleDTOList = new ArrayList<>();
                    if (evenOddMapEntry.getValue() != null) {
                        for (Map.Entry<Period, Map<String, Map<String, Map<LessonType, List<Lesson>>>>> periodListEntry : evenOddMapEntry.getValue().entrySet()) {
                            LessonsInRoomScheduleDTO even = new LessonsInRoomScheduleDTO();
                            even.setClassName(periodListEntry.getKey().getName());
                            even.setClassId(periodListEntry.getKey().getId());

                            List<LessonsListInRoomScheduleDTO> lessonsListInRoomScheduleDTOS = new ArrayList<>();
                            for (Map.Entry<String, Map<String, Map<LessonType, List<Lesson>>>> subjectForSiteMap : periodListEntry.getValue().entrySet()) {
                                for (Map.Entry<String, Map<LessonType, List<Lesson>>> teacherForSiteMap : subjectForSiteMap.getValue().entrySet()) {
                                    for (Map.Entry<LessonType, List<Lesson>> lessonTypeListMap : teacherForSiteMap.getValue().entrySet()) {
                                        LessonsListInRoomScheduleDTO lessonsListInRoomScheduleDTO = new LessonsListInRoomScheduleDTO();
                                        lessonsListInRoomScheduleDTO.setLessonType(lessonTypeListMap.getKey());
                                        lessonsListInRoomScheduleDTO.setSubjectName(subjectForSiteMap.getKey());
                                        lessonsListInRoomScheduleDTO.setSurname(teacherForSiteMap.getKey());

                                        List<GroupDTOInRoomSchedule> groupDTOInRoomScheduleList = new ArrayList<>();
                                        for (Lesson lesson : lessonTypeListMap.getValue()) {
                                            GroupDTOInRoomSchedule groupDTOInRoomSchedule = new GroupDTOInRoomSchedule();
                                            groupDTOInRoomSchedule.setGroupId(lesson.getGroup().getId());
                                            groupDTOInRoomSchedule.setGroupName(lesson.getGroup().getTitle());
                                            groupDTOInRoomScheduleList.add(groupDTOInRoomSchedule);
                                        }
                                        lessonsListInRoomScheduleDTO.setGroups(groupDTOInRoomScheduleList);
                                        lessonsListInRoomScheduleDTOS.add(lessonsListInRoomScheduleDTO);
                                    }
                                }
                            }
                            even.setLessons(lessonsListInRoomScheduleDTOS);
                            evenOddLessonsInRoomScheduleDTOList.add(even);
                        }
                    }
                    if (evenOddMapEntry.getKey().equals(EvenOdd.EVEN)) {
                        roomClassesInScheduleDTO.setEven(evenOddLessonsInRoomScheduleDTOList);
                    } else {
                        roomClassesInScheduleDTO.setOdd(evenOddLessonsInRoomScheduleDTOList);
                    }
                }
                roomClassesInScheduleDTOList.add(roomClassesInScheduleDTO);
                daysOfWeekWithClassesForRoomDTO.setClasses(roomClassesInScheduleDTOList);
                daysOfWeekWithClassesForRoomDTOList.add(daysOfWeekWithClassesForRoomDTO);
            }
            scheduleForRoomDTO.setSchedules(daysOfWeekWithClassesForRoomDTOList);
            scheduleForRoomDTOS.add(scheduleForRoomDTO);
        }
        return scheduleForRoomDTOS;

    }
}
