package com.softserve.controller;

import com.softserve.dto.MessageDTO;
import com.softserve.dto.ScheduleForArchiveDTO;
import com.softserve.dto.ScheduleWithoutSemesterDTO;
import com.softserve.dto.SemesterDTO;
import com.softserve.entity.Schedule;
import com.softserve.entity.Semester;
import com.softserve.mapper.ScheduleWithoutSemesterMapper;
import com.softserve.mapper.SemesterMapper;
import com.softserve.service.ArchiveService;
import com.softserve.service.LessonService;
import com.softserve.service.ScheduleService;
import com.softserve.service.SemesterService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/archive")
@Api(tags = "Archive API")
@Slf4j
public class ArchiveController {

    private final ArchiveService archiveService;
    private final SemesterMapper semesterMapper;
    private final ScheduleService scheduleService;
    private final ScheduleWithoutSemesterMapper scheduleWithoutSemesterMapper;
    private final SemesterService semesterService;
    private final LessonService lessonService;

    @Autowired
    public ArchiveController(ArchiveService archiveService, SemesterMapper semesterMapper, ScheduleService scheduleService, ScheduleWithoutSemesterMapper scheduleWithoutSemesterMapper, SemesterService semesterService, LessonService lessonService) {
        this.archiveService = archiveService;
        this.semesterMapper = semesterMapper;
        this.scheduleService = scheduleService;
        this.scheduleWithoutSemesterMapper = scheduleWithoutSemesterMapper;
        this.semesterService = semesterService;
        this.lessonService = lessonService;
    }

    @PostMapping("/{semesterId}")
    @ApiOperation(value = "Save archive schedule by semesterId in mongo db")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ScheduleForArchiveDTO> archiveScheduleBySemester(@PathVariable("semesterId") Long semesterId) {
        log.info("In archiveScheduleBySemester with semesterId = {}", semesterId);
        Semester semester = semesterService.getById(semesterId);
        SemesterDTO semesterDTO = semesterMapper.semesterToSemesterDTO(semester);
        List<Schedule> schedules = scheduleService.getSchedulesBySemester(semesterId);
        List<ScheduleWithoutSemesterDTO> scheduleWithoutSemesterDTOS = scheduleWithoutSemesterMapper.scheduleToScheduleWithoutSemesterDTOs(schedules);
        ScheduleForArchiveDTO scheduleForArchiveDTO = new ScheduleForArchiveDTO(semesterDTO ,scheduleWithoutSemesterDTOS);
        scheduleService.deleteSchedulesBySemesterId(semesterId);
        lessonService.deleteLessonBySemesterId(semesterId);
        semesterService.delete(semester);
        return ResponseEntity.status(HttpStatus.OK).body(archiveService.saveScheduleForArchive(scheduleForArchiveDTO));
    }

    @GetMapping
    @ApiOperation(value = "Get archive schedule by semesterId from mongo db")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ScheduleForArchiveDTO> getScheduleBySemesterId(@RequestParam Long semesterId) {
        log.info("In getScheduleBySemesterId with semesterId = {}", semesterId);
        return ResponseEntity.ok().body(archiveService.getArchiveScheduleBySemesterId(semesterId));
    }

    @GetMapping(value = "all-semesters")
    @ApiOperation(value = "Get all semesters from archived schedules, that contains it")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<SemesterDTO>> getAllSemestersInArchiveSchedule() {
        log.info("In getAllSemestersInArchiveSchedule ");
        return ResponseEntity.ok().body(archiveService.getAllSemestersInArchiveSchedule());
    }

    @DeleteMapping
    @ApiOperation(value = "Delete archive schedule by semesterId from mongo db")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<MessageDTO> removeArchiveScheduleBySemesterId(@RequestParam Long semesterId) {
        log.info("In removeArchiveScheduleBySemesterId with semesterId = {}", semesterId);
        archiveService.deleteArchiveScheduleBySemesterId(semesterId);
        return ResponseEntity.ok().body(new MessageDTO("Object deleted successfully"));
    }
}