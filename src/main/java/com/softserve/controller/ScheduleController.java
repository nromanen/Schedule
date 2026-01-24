package com.softserve.controller;

import com.softserve.dto.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.mapper.*;
import com.softserve.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@Tag(name = "Schedule API")
@Slf4j
@RequestMapping("/schedules")
@RequiredArgsConstructor
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
    private final ConverterToSchedulesInRoom converterToSchedulesInRoom;
    private final SchedulePublishService publishService;

//    @GetMapping
//    @Operation(summary = "Get the list of all schedules")
//    @PreAuthorize("hasRole('MANAGER')")
//    public ResponseEntity<List<ScheduleDTO>> list() {
//        log.info("In list()");
//        List<Schedule> schedules = scheduleService.getAll();
//
//        return ResponseEntity.status(HttpStatus.OK).body(scheduleMapper.scheduleToScheduleDTOs(schedules));
//    }

    @GetMapping("/public/status")
    @Operation(
            summary = "Get schedule publish status",
            description = "Check if schedule is currently published and visible to students"
    )
    public ResponseEntity<ScheduleStatusDTO> getPublishStatus() {
        log.info("In getPublishStatus()");
        return ResponseEntity.ok(publishService.getStatus());
    }

    @PostMapping("/publish")
    @Operation(
            summary = "Publish schedule",
            description = "Make schedule visible to students"
    )
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> publish() {
        log.info("In publish()");
        publishService.publish();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/publish")
    @Operation(
            summary = "Hide schedule",
            description = "Hide schedule from students with optional message"
    )
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> unpublish(
            @Parameter(description = "Message to show when schedule is hidden")
            @RequestParam(required = false) String message
    ) {
        log.info("In unpublish(message = [{}])", message);
        if (message != null && !message.isBlank()) {
            publishService.unpublish(message);
        } else {
            publishService.unpublish();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Operation(summary = "Get the list of all schedules for default semester")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ScheduleWithoutSemesterDTO>> list() {
        log.info("In list()");
        Long semesterId = semesterService.getDefaultSemester().getId();
        return ResponseEntity.status(HttpStatus.OK).body(scheduleService.getSchedulesBySemester(semesterId));
    }

    @GetMapping("/semester")
    @Operation(summary = "Get the list of all schedules")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ScheduleWithoutSemesterDTO>> listForSemester(@RequestParam Long semesterId) {
        log.info("In listForSemester()");
        return ResponseEntity.status(HttpStatus.OK).body(scheduleService.getSchedulesBySemester(semesterId));
    }

    @GetMapping("/data-before")
    @Operation(summary = "Get the info for finishing creating the schedule")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<CreateScheduleInfoDTO> getInfoForCreatingSchedule(@RequestParam Long semesterId,
                                                                            @RequestParam DayOfWeek dayOfWeek,
                                                                            @RequestParam EvenOdd evenOdd,
                                                                            @RequestParam Long classId,
                                                                            @RequestParam Long lessonId) {
        log.info("In getInfoForCreatingSchedule(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], lessonId = [{}])",
                semesterId, dayOfWeek, evenOdd, classId, lessonId);
        return ResponseEntity.status(HttpStatus.OK).body(
                scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId, lessonId));
    }

    private boolean isManager(Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_MANAGER")
                        || a.getAuthority().equals("ROLE_ADMIN"));
    }

    @GetMapping("/full/groups")
    @Operation(summary = "Get full schedule for groupId in some semester")
    public ResponseEntity<?> getFullScheduleForGroup(@RequestParam Long semesterId,
                                                     @RequestParam Long groupId, Authentication authentication) {
        log.info("In getFullScheduleForGroup(semesterId = [{}], groupId = [{}])", semesterId, groupId);

        if (!isManager(authentication) && !publishService.isPublished()) {
            return ResponseEntity.ok(publishService.getStatus());
        }

        ScheduleFullDTO scheduleFullDTO = new ScheduleFullDTO();
        scheduleFullDTO.setSemester(semesterService.getById(semesterId));
        scheduleFullDTO.setSchedule(scheduleService.getFullScheduleForGroup(semesterId, groupId));
        return ResponseEntity.ok(scheduleFullDTO);
    }

    @GetMapping("/full/semester")
    @Operation(summary = "Get full schedule for semester")
    public ResponseEntity<?> getFullScheduleForSemester(@RequestParam Long semesterId, Authentication authentication) {
        log.info("In getFullScheduleForSemester(semesterId = [{}])", semesterId);

        if (!isManager(authentication) && !publishService.isPublished()) {
            return ResponseEntity.ok(publishService.getStatus());
        }

        return ResponseEntity.ok(scheduleService.getFullScheduleForSemester(semesterId));
    }

    @GetMapping("/full/teachers")
    @Operation(summary = "Get full schedule for teacher by semester")
    public ResponseEntity<?> getFullScheduleForTeacher(@RequestParam Long semesterId,
                                                       @RequestParam Long teacherId, Authentication authentication) {
        log.info("In getFullScheduleForTeacher(semesterId = [{}], teacherId = [{}])", semesterId, teacherId);

        if (!isManager(authentication) && !publishService.isPublished()) {
            return ResponseEntity.ok(publishService.getStatus());
        }

        return ResponseEntity.ok(scheduleService.getScheduleForTeacher(semesterId, teacherId));
    }

    @GetMapping("/full/rooms")
    @Operation(summary = "Get full schedule for semester. Returns schedule for rooms")
    public ResponseEntity<List<ScheduleForRoomDTO>> getFullScheduleForRoom(@RequestParam Long semesterId) {
        log.info("In getFullScheduleForRoom(semesterId = [{}])", semesterId);
        SemesterWithGroupsDTO semester = semesterService.getById(semesterId);
        List<RoomDTO> rooms = roomService.getAllOrdered();
        List<ScheduleForRoomDTO> scheduleForRoomDTOS =
                converterToSchedulesInRoom.getBySemester(rooms, semester,
                        scheduleService.getAllOrdered(semesterId));
        return ResponseEntity.status(HttpStatus.OK).body(scheduleForRoomDTOS);
    }


    //    @PostMapping
//    @Operation(summary = "Create new schedules")
//    @PreAuthorize("hasRole('MANAGER')")
//    public ResponseEntity<List<ScheduleSaveDTO>> save(@RequestBody ScheduleSaveDTO scheduleSaveDTO) {
//        log.info("In save(scheduleSaveDTO = [{}])", scheduleSaveDTO);
//        Schedule schedule = scheduleSaveMapper.scheduleSaveDTOToSchedule(scheduleSaveDTO);
//        schedule.setLesson(lessonService.getById(scheduleSaveDTO.getLessonId()));
//        List<Schedule> schedules = new ArrayList<>();
//        if (schedule.getLesson().isGrouped()) {
//            schedules = scheduleService.schedulesForGroupedLessons(schedule);
//            schedules.forEach(scheduleService::checkReferences);
//            schedules.forEach(scheduleService::save);
//        } else {
//            schedules.add(scheduleService.save(schedule));
//        }
//        return ResponseEntity.status(HttpStatus.CREATED).body(scheduleSaveMapper.schedulesListToScheduleSaveDTOsList(schedules));
//    }
    @PostMapping
    @Operation(summary = "Create new schedules")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ScheduleWithoutSemesterDTO>> save(@RequestBody ScheduleSaveDTO scheduleSaveDTO) {
        log.info("In save(scheduleSaveDTO = [{}])", scheduleSaveDTO);
        List<ScheduleWithoutSemesterDTO> savedSchedules = scheduleService.saveSchedule(scheduleSaveDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSchedules);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete schedule by id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Long>> delete(@PathVariable("id") long id) {
        log.info("In delete(id = [{}])", id);
        return ResponseEntity.ok(scheduleService.deleteScheduleById(id));
    }

//    @GetMapping("/teacher")
//    @Operation(summary = "Get full schedule for current teacher by date range")
//    @PreAuthorize("hasRole('TEACHER')")
//    public ResponseEntity<List<ScheduleForTemporaryDateRangeDTO>> getScheduleByDateRangeForCurrentTeacher(@RequestParam String from,
//                                                                                                          @RequestParam String to,
//                                                                                                          @CurrentUser JwtUser jwtUser) {
//        log.info("In getScheduleByDateRangeForCurrentTeacher with from = {} and to = {}", from, to);
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
//        DateTimeFormatter currentFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//        LocalDate fromDate = LocalDate.parse(LocalDate.parse(from, formatter).toString(), currentFormatter);
//        LocalDate toDate = LocalDate.parse(LocalDate.parse(to, formatter).toString(), currentFormatter);
//        Teacher teacher = teacherService.findByUserId(jwtUser.getId());
//        List<ScheduleForTemporaryDateRangeDTO> dto = fullDTOForTemporaryScheduleByTeacherDateRange(
//                scheduleService.temporaryScheduleByDateRangeForTeacher(fromDate, toDate, teacher.getId()));
//        return ResponseEntity.status(HttpStatus.OK).body(dto);
//    }

//    @GetMapping("/full/teachers/date-range")
//    @Operation(summary = "Get full schedule for teacher by date range")
//    @PreAuthorize("hasRole('MANAGER')")
//    public ResponseEntity<List<ScheduleForTemporaryDateRangeDTO>> getScheduleByDateRangeForTeacher(@RequestParam String from,
//                                                                                                   @RequestParam String to,
//                                                                                                   @RequestParam Long teacherId) {
//        log.info("In getScheduleByDateForTeacher with from = {}, to={}, teacherId = {}", from, to, teacherId);
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
//        DateTimeFormatter currentFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//        LocalDate fromDate = LocalDate.parse(LocalDate.parse(from, formatter).toString(), currentFormatter);
//        LocalDate toDate = LocalDate.parse(LocalDate.parse(to, formatter).toString(), currentFormatter);
//        teacherService.getById(teacherId);
//        Map<LocalDate, Map<Period, Map<Schedule, TemporarySchedule>>> mapSchedules = scheduleService
//                .temporaryScheduleByDateRangeForTeacher(fromDate, toDate, teacherId);
//
//        List<ScheduleForTemporaryDateRangeDTO> dto = fullDTOForTemporaryScheduleByTeacherDateRange(mapSchedules);
//        return ResponseEntity.status(HttpStatus.OK).body(dto);
//    }

    @DeleteMapping("/delete-schedules")
    @Operation(summary = "Delete all schedules by semester id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> deleteSchedulesBySemesterId(@RequestParam Long semesterId) {
        log.info("In deleteSchedulesBySemesterId with semesterId = {}", semesterId);
        scheduleService.deleteSchedulesBySemesterId(semesterId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/by-room")
    @Operation(summary = "Change schedule by room Id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ScheduleDTO> changeScheduleByRoom(@RequestParam Long scheduleId,
                                                            @RequestParam Long roomId) {
        log.info("In changeScheduleByRoom with scheduleId = {} and roomId = {}", scheduleId, roomId);
        ScheduleDTO updated = scheduleService.changeRoom(scheduleId, roomId);
        return ResponseEntity.ok(updated);
    }

//    private List<ScheduleForTemporaryDateRangeDTO> fullDTOForTemporaryScheduleByTeacherDateRange(Map<LocalDate, Map<Period,
//            Map<Schedule, TemporarySchedule>>> map) {
//        List<ScheduleForTemporaryDateRangeDTO> fullDTO = new ArrayList<>();
//
//        for (Map.Entry<LocalDate, Map<Period, Map<Schedule, TemporarySchedule>>> itr : map.entrySet()) {
//            ScheduleForTemporaryDateRangeDTO scheduleForTemporaryDateRangeDTO = new ScheduleForTemporaryDateRangeDTO();
//            scheduleForTemporaryDateRangeDTO.setDate(itr.getKey());
//
//            List<ScheduleForTemporaryTeacherDateRangeDTO> scheduleForTemporaryTeacherDateRangeDTOS = new ArrayList<>();
//            for (Map.Entry<Period, Map<Schedule, TemporarySchedule>> entry : itr.getValue().entrySet()) {
//                for (Map.Entry<Schedule, TemporarySchedule> item : entry.getValue().entrySet()) {
//                    ScheduleForTemporaryTeacherDateRangeDTO scheduleForTemporaryTeacherDateRangeDTO = new ScheduleForTemporaryTeacherDateRangeDTO();
//
//                    ScheduleTemporaryTeacherDateRangeDTO lessonsInScheduleDTO = new ScheduleTemporaryTeacherDateRangeDTO();
//                    lessonsInScheduleDTO.setId(item.getKey().getId());
//                    lessonsInScheduleDTO.setPeriod(periodMapper.convertToDto(entry.getKey()));
//                    lessonsInScheduleDTO.setLesson(lessonsInScheduleMapper.lessonToLessonsInTemporaryScheduleDTO(item.getKey().getLesson()));
//                    lessonsInScheduleDTO.setPeriod(periodMapper.convertToDto(entry.getKey()));
//                    lessonsInScheduleDTO.setRoom(roomForScheduleMapper.roomToRoomForScheduleDTO(item.getKey().getRoom()));
//                    lessonsInScheduleDTO.setVacation(item.getValue().isVacation());
//
//                    scheduleForTemporaryTeacherDateRangeDTO.setSchedule(lessonsInScheduleDTO);
//
//                    if (item.getValue().getScheduleId() != null) {
//                        ScheduleTemporaryTeacherDateRangeDTO temporaryLessonsInScheduleDTO = new ScheduleTemporaryTeacherDateRangeDTO();
//                        temporaryLessonsInScheduleDTO.setId(item.getValue().getId());
//                        temporaryLessonsInScheduleDTO.setPeriod(periodMapper.convertToDto(item.getValue().getPeriod()));
//                        temporaryLessonsInScheduleDTO.setLesson(lessonsInScheduleMapper.lessonToLessonsInTemporaryScheduleDTO(item.getValue()));
//                        temporaryLessonsInScheduleDTO.setRoom(roomForScheduleMapper.roomToRoomForScheduleDTO(item.getValue().getRoom()));
//                        temporaryLessonsInScheduleDTO.setVacation(false);
//                        scheduleForTemporaryTeacherDateRangeDTO.setTemporarySchedule(temporaryLessonsInScheduleDTO);
//                    }
//                    scheduleForTemporaryTeacherDateRangeDTOS.add(scheduleForTemporaryTeacherDateRangeDTO);
//                    scheduleForTemporaryDateRangeDTO.setSchedules(scheduleForTemporaryTeacherDateRangeDTOS);
//                }
//            }
//            fullDTO.add(scheduleForTemporaryDateRangeDTO);
//        }
//        return fullDTO;
//    }
}
