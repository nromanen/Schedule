package com.softserve.controller;

import com.softserve.dto.*;
import com.softserve.entity.CurrentUser;
import com.softserve.entity.Teacher;
import com.softserve.entity.TemporarySchedule;
import com.softserve.mapper.TemporaryScheduleMapper;
import com.softserve.security.jwt.JwtUser;
import com.softserve.service.TeacherService;
import com.softserve.service.TemporaryScheduleService;
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
@Api(tags = "Temporary Schedule API")
@RequestMapping("/temporary_schedules")
@Slf4j
public class TemporaryScheduleController {

    private final TemporaryScheduleService temporaryScheduleService;
    private final TemporaryScheduleMapper temporaryScheduleMapper;
    private final TeacherService teacherService;

    @Autowired
    public TemporaryScheduleController(TemporaryScheduleService temporaryScheduleService, TemporaryScheduleMapper temporaryScheduleMapper, TeacherService teacherService) {
        this.temporaryScheduleService = temporaryScheduleService;
        this.temporaryScheduleMapper = temporaryScheduleMapper;
        this.teacherService = teacherService;
    }
    @PostMapping
    @ApiOperation(value = "Create new temporary schedule")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<TemporaryScheduleDTO> save(@RequestBody TemporaryScheduleSaveDTO temporaryScheduleDTO) {
        log.info("Enter into save of TemporaryScheduleController with temporaryScheduleDTO: {}", temporaryScheduleDTO);
        TemporarySchedule temporarySchedule = temporaryScheduleService.save(temporaryScheduleMapper.convertToEntity(temporaryScheduleDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(temporaryScheduleMapper.convertToDto(temporarySchedule));
    }
    @GetMapping("/{id}")
    @ApiOperation(value = "Get temporary schedule by id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<TemporaryScheduleDTO> getById(@PathVariable("id") long id) {
        log.info("Enter into getById of TemporaryScheduleController");
        return ResponseEntity.ok().body(temporaryScheduleMapper.convertToDto(temporaryScheduleService.getById(id)));
    }

    @GetMapping
    @ApiOperation(value = "Get all temporary schedules by teacher")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<TemporaryScheduleDTO>> getAll(@PathVariable("id") long id) {
        log.info("Enter into getAll of TemporaryScheduleController");
        return ResponseEntity.ok().body(temporaryScheduleMapper.convertToDtoList(temporaryScheduleService.getAllByTeacher(id)));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete temporary schedule by id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<MessageDTO> delete(@PathVariable("id") long id) {
        log.info("Enter into delete of TemporaryScheduleController with id: {}", id);
        temporaryScheduleService.delete(temporaryScheduleService.getById(id));
        return ResponseEntity.ok().body(new MessageDTO("Temporary schedule has been deleted successfully."));
    }

    @GetMapping("/teacher")
    @ApiOperation(value = "Get temporary schedules for current teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<TemporaryScheduleDTO>> getTemporarySchedulesForCurrentTeacher(@CurrentUser JwtUser jwtUser) {
        log.info("In getTemporarySchedulesForCurrentTeacher");
        Teacher teacher = teacherService.findByUserId(Integer.parseInt(jwtUser.getId().toString()));
        return ResponseEntity.ok().body(temporaryScheduleMapper.convertToDtoList(temporaryScheduleService.getAllByTeacher(teacher.getId())));
    }


}