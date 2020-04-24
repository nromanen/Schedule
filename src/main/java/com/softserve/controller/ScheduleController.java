package com.softserve.controller;

import com.softserve.dto.*;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.service.ScheduleService;
import com.softserve.mapper.ScheduleMapper;
import com.softserve.mapper.ScheduleSaveMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@Api(tags = "Schedule API")
@Slf4j
@RequestMapping("/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final ScheduleMapper scheduleMapper;
    private final ScheduleSaveMapper scheduleSaveMapper;

    public ScheduleController(ScheduleService scheduleService, ScheduleMapper scheduleMapper, ScheduleSaveMapper scheduleSaveMapper) {
        this.scheduleService = scheduleService;
        this.scheduleMapper = scheduleMapper;
        this.scheduleSaveMapper = scheduleSaveMapper;
    }

    @GetMapping
    @ApiOperation(value = "Get the list of all schedules")
    public ResponseEntity<List<ScheduleDTO>> list() {
        log.info("In list()");
        List<Schedule> schedules = scheduleService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(scheduleMapper.scheduleToScheduleDTOs(schedules));
    }

    @GetMapping("/data-before")
    @ApiOperation(value = "Get the info for finishing creating the schedule")
    public ResponseEntity<CreateScheduleInfoDTO> getInfoForCreatingSchedule(@RequestParam Long semesterId,
                                                                            @RequestParam DayOfWeek dayOfWeek,
                                                                            @RequestParam EvenOdd evenOdd,
                                                                            @RequestParam Long classId,
                                                                            @RequestParam Long lessonId){
        log.info("In getInfoForCreatingSchedule(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], lessonId = [{}])", semesterId, dayOfWeek, evenOdd, classId, lessonId);
        return ResponseEntity.status(HttpStatus.OK).body(scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek,evenOdd, classId, lessonId));
    }

    @GetMapping("/full/groups")
    @ApiOperation(value = "Get full schedule for semester. If groupId isn't specified returns schedule for all groups")
    public ResponseEntity<List<ScheduleForGroupDTO>> getFullScheduleForGroup(@RequestParam Long semesterId,
                                                                     @RequestParam(required = false) Long groupId) {
        log.info("In, getFullScheduleForGroup (semesterId = [{}], groupId = [{}]) ", semesterId, groupId);
        return ResponseEntity.status(HttpStatus.OK).body(scheduleService.getFullSchedule(semesterId, groupId));
    }

    @GetMapping("/full/teachers")
    @ApiOperation(value = "Get full schedule for teacher by semester")
    public ResponseEntity<List<ScheduleForGroupDTO>> getFullScheduleForTeacher(@RequestParam Long semesterId,
                                                                             @RequestParam Long teacherId) {
        log.info("In, getFullScheduleForTeacher (semesterId = [{}], teacherId = [{}]) ", semesterId, teacherId);
        return ResponseEntity.status(HttpStatus.OK).body(scheduleService.getScheduleForTeacher(semesterId, teacherId));
    }

    @PostMapping
    @ApiOperation(value = "Create new schedule")
    public ResponseEntity<ScheduleSaveDTO> save(@RequestBody ScheduleSaveDTO scheduleSaveDTO) {
        log.info("In save(scheduleSaveDTO = [{}])", scheduleSaveDTO);
        Schedule schedule = scheduleService.save(scheduleSaveMapper.scheduleSaveDTOToSchedule(scheduleSaveDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(scheduleSaveMapper.scheduleToScheduleSaveDTO(schedule));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete schedule by id")
    public ResponseEntity delete(@PathVariable("id") long id){
        log.info("In delete(id =[{}]", id);
        Schedule schedule = scheduleService.getById(id);
        scheduleService.delete(schedule);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
