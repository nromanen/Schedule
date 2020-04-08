package com.softserve.controller;

import com.softserve.dto.CreateScheduleInfoDTO;
import com.softserve.dto.ScheduleDTO;
import com.softserve.dto.ScheduleSaveDTO;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.service.ScheduleService;
import com.softserve.service.mapper.ScheduleMapper;
import com.softserve.service.mapper.ScheduleSaveMapper;
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
        log.info("Enter into list method ");
        List<Schedule> schedules = scheduleService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(scheduleMapper.scheduleToScheduleDTOs(schedules));
    }

    @GetMapping("/getInfo")
    @ApiOperation(value = "Get the info for saving the schedule")
    public ResponseEntity<CreateScheduleInfoDTO> getInfoForCreatingSchedule(@RequestParam Long semesterId,
                                                                            @RequestParam DayOfWeek dayOfWeek,
                                                                            @RequestParam EvenOdd evenOdd,
                                                                            @RequestParam Long classId,
                                                                            @RequestParam Long lessonId){
        log.info("Enter into getInfoForCreatingSchedule method ");
        return ResponseEntity.status(HttpStatus.OK).body(scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek,evenOdd, classId, lessonId));
    }

    @PostMapping
    @ApiOperation(value = "Create new schedule")
    public ResponseEntity<ScheduleSaveDTO> save(@RequestBody ScheduleSaveDTO scheduleSaveDTO) {
        log.info("Enter into save method with scheduleSaveDTO: {}", scheduleSaveDTO);
        Schedule schedule = scheduleService.save(scheduleSaveMapper.scheduleSaveDTOToSchedule(scheduleSaveDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(scheduleSaveMapper.scheduleToScheduleSaveDTO(schedule));
    }


    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete schedule by id")
    public ResponseEntity delete(@PathVariable("id") long id){
        log.info("Enter into delete method with semester id: {}", id);
        Schedule schedule = scheduleService.getById(id);
        scheduleService.delete(schedule);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
