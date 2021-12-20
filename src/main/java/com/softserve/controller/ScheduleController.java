package com.softserve.controller;

import com.softserve.dto.*;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.LessonType;
import com.softserve.mapper.*;
import com.softserve.mapper.converter.ScheduleConverter;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private final ScheduleConverter scheduleConverter;

    @Autowired
    public ScheduleController(ScheduleService scheduleService, SemesterService semesterService,
                              SemesterMapper semesterMapper, ScheduleMapper scheduleMapper,
                              ScheduleSaveMapper scheduleSaveMapper, ScheduleWithoutSemesterMapper scheduleWithoutSemesterMapper,
                              TeacherService teacherService, PeriodMapper periodMapper,
                              RoomForScheduleMapper roomForScheduleMapper, LessonService lessonService,
                              LessonsInScheduleMapper lessonsInScheduleMapper, RoomService roomService,
                              ScheduleConverter scheduleConverter) {
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
        this.scheduleConverter = scheduleConverter;
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
        scheduleFullDTO.setSchedule(scheduleConverter.getFullScheduleForGroup(scheduleService.getFullScheduleForGroup(semesterId, groupId)));
        return ResponseEntity.status(HttpStatus.OK).body(scheduleFullDTO);
    }

    @GetMapping("/full/semester")
    @ApiOperation(value = "Get full schedule for semester")
    public ResponseEntity<ScheduleFullDTO> getFullScheduleForSemester(@RequestParam Long semesterId) {
        log.info("In, getFullScheduleForGroup (semesterId = [{}]) ", semesterId);
        return ResponseEntity.status(HttpStatus.OK).body(scheduleConverter.getFullScheduleForSemester(scheduleService.getFullScheduleForSemester(semesterId)));
    }

    @GetMapping("/full/teachers")
    @ApiOperation(value = "Get full schedule for teacher by semester")
    public ResponseEntity<ScheduleForTeacherDTO> getFullScheduleForTeacher(@RequestParam Long semesterId,
                                                                           @RequestParam Long teacherId) {
        log.info("In, getFullScheduleForTeacher (semesterId = [{}], teacherId = [{}]) ", semesterId, teacherId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(scheduleConverter.getScheduleForTeacher(
                        scheduleService.getScheduleForTeacher(semesterId, teacherId))
                );
    }

    @GetMapping("/full/rooms")
    @ApiOperation(value = "Get full schedule for semester. Returns schedule for  rooms")
    public ResponseEntity<List<ScheduleForRoomDTO>> getFullScheduleForRoom(@RequestParam Long semesterId) {
        log.info("In, getFullScheduleForRoom (semesterId = [{}]) ", semesterId);
        List<ScheduleForRoomDTO> scheduleForRoomDTOS =
                scheduleConverter.getScheduleForRooms(scheduleService.getScheduleForRooms(semesterId));
        return ResponseEntity.status(HttpStatus.OK).body(scheduleForRoomDTOS);
    }


    @PostMapping
    @ApiOperation(value = "Create new schedules")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ScheduleSaveDTO>> save(@RequestBody ScheduleSaveDTO scheduleSaveDTO) {
        log.info("In save(scheduleSaveDTO = [{}])", scheduleSaveDTO);
        Schedule schedule = scheduleSaveMapper.scheduleSaveDTOToSchedule(scheduleSaveDTO);
        schedule.setLesson(lessonService.getById(scheduleSaveDTO.getLessonId()));
        List<Schedule> schedules = new ArrayList<>();
        if (schedule.getLesson().isGrouped()){
            schedules = scheduleService.schedulesForGroupedLessons(schedule);
            schedules.forEach(scheduleService::checkReferences);
            schedules.forEach(scheduleService::save);
        } else {
            schedules.add(scheduleService.save(schedule));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(scheduleSaveMapper.schedulesListToScheduleSaveDTOsList(schedules));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete schedule by id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity delete(@PathVariable("id") long id) {
        log.info("In delete(id =[{}]", id);
        Schedule schedule = scheduleService.getById(id);
        if (schedule.getLesson().isGrouped()){
            List<Schedule> schedules = scheduleService.getSchedulesForGroupedLessons(schedule);
            schedules.forEach(scheduleService::delete);
        } else {
            scheduleService.delete(schedule);
        }
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
        List<ScheduleForTemporaryDateRangeDTO> dto =  new ArrayList<>();
//                fullDTOForTemporaryScheduleByTeacherDateRange(
//                        scheduleService.scheduleByDateRangeForTeacher(fromDate, toDate, teacher.getId())
//                );
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
        Map<LocalDate, Map<Period, Schedule>> mapSchedules = new HashMap<>();
//                scheduleService.scheduleByDateRangeForTeacher(fromDate, toDate, teacherId);

        List<ScheduleForTemporaryDateRangeDTO> dto = fullDTOForTemporaryScheduleByTeacherDateRange(mapSchedules);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    @DeleteMapping("/delete-schedules")
    @ApiOperation(value = "Delete all schedules by semester id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> deleteSchedulesBySemesterId(@RequestParam Long semesterId) {
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


    //convert schedule map to schedule dto
    private List<ScheduleDateRangeFullDTO> fullDTOForTeacherDateRange(Map<LocalDate, Map<Period, List<Schedule>>> map) {
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
    }


    private List<ScheduleForTemporaryDateRangeDTO> fullDTOForTemporaryScheduleByTeacherDateRange(
            Map<LocalDate, Map<Period, Schedule>> map) {
        List<ScheduleForTemporaryDateRangeDTO> fullDTO = new ArrayList<>();

        for (Map.Entry<LocalDate, Map<Period, Schedule>> itr : map.entrySet()) {
            ScheduleForTemporaryDateRangeDTO scheduleForTemporaryDateRangeDTO = new ScheduleForTemporaryDateRangeDTO();
            scheduleForTemporaryDateRangeDTO.setDate(itr.getKey());

            List<ScheduleForTemporaryTeacherDateRangeDTO> scheduleForTemporaryTeacherDateRangeDTOS = new ArrayList<>();
            for (Map.Entry<Period, Schedule> entry : itr.getValue().entrySet()) {
                    ScheduleForTemporaryTeacherDateRangeDTO scheduleForTemporaryTeacherDateRangeDTO = new ScheduleForTemporaryTeacherDateRangeDTO();
                    ScheduleTemporaryTeacherDateRangeDTO lessonsInScheduleDTO = new ScheduleTemporaryTeacherDateRangeDTO();
                    lessonsInScheduleDTO.setId(entry.getValue().getId());
                    lessonsInScheduleDTO.setPeriod(periodMapper.convertToDto(entry.getKey()));
                    lessonsInScheduleDTO.setLesson(lessonsInScheduleMapper.lessonToLessonsInTemporaryScheduleDTO(entry.getValue().getLesson()));
                    lessonsInScheduleDTO.setPeriod(periodMapper.convertToDto(entry.getKey()));
                    lessonsInScheduleDTO.setRoom(roomForScheduleMapper.roomToRoomForScheduleDTO(entry.getValue().getRoom()));
                    scheduleForTemporaryTeacherDateRangeDTOS.add(scheduleForTemporaryTeacherDateRangeDTO);
                    scheduleForTemporaryDateRangeDTO.setSchedules(scheduleForTemporaryTeacherDateRangeDTOS);

            }
            fullDTO.add(scheduleForTemporaryDateRangeDTO);
        }
        return fullDTO;
    }


}
