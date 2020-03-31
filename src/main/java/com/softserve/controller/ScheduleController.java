package com.softserve.controller;

import com.softserve.dto.CreateScheduleInfoDTO;
import com.softserve.dto.ScheduleDTO;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.service.ScheduleService;
import com.softserve.service.mapper.ScheduleMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@Api(tags = "Schedule API")
@Slf4j
@RequestMapping("/schedules")
public class ScheduleController {
    private final ScheduleService scheduleService;
    private final ScheduleMapper scheduleMapper;


    public ScheduleController(ScheduleService scheduleService, ScheduleMapper scheduleMapper) {
        this.scheduleService = scheduleService;
        this.scheduleMapper = scheduleMapper;
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
        scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek,evenOdd, classId, lessonId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}
