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
import java.util.*;

@RestController
@Tag(name = "Schedule API")
@Slf4j
@RequestMapping("/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final SemesterService semesterService;
    private final RoomService roomService;
    private final ConverterToSchedulesInRoom converterToSchedulesInRoom;
    private final SchedulePublishService publishService;


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

    @GetMapping("/full/teachers/active")
    @Operation(summary = "Get full schedule for teacher for all active semesters")
    public ResponseEntity<?> getFullScheduleForTeacherActiveSemesters(@RequestParam Long teacherId,
                                                                      Authentication authentication) {
        log.info("In getFullScheduleForTeacherActiveSemesters(teacherId = [{}])", teacherId);

        if (!isManager(authentication) && !publishService.isPublished()) {
            return ResponseEntity.ok(publishService.getStatus());
        }

        return ResponseEntity.ok(scheduleService.getScheduleForTeacherForActiveSemesters(teacherId));
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

    @GetMapping("/full/rooms/active")
    @Operation(summary = "Get combined busy rooms schedule for all semesters active this week")
    public ResponseEntity<CombinedRoomScheduleDTO> getFullScheduleForRoomActive() {
        log.info("In getFullScheduleForRoomActive()");
        return ResponseEntity.status(HttpStatus.OK)
                .body(scheduleService.getCombinedRoomScheduleForActiveWeek());
    }

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
    public ResponseEntity<List<ScheduleDTO>> changeScheduleByRoom(@RequestParam Long scheduleId,
                                                                  @RequestParam Long roomId) {
        log.info("In changeScheduleByRoom with scheduleId = {} and roomId = {}", scheduleId, roomId);
        List<ScheduleDTO> updated = scheduleService.changeRoom(scheduleId, roomId);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/move")
    @Operation(summary = "Move schedule item to another slot and room")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ScheduleDTO>> moveScheduleItem(
            @RequestParam Long scheduleId,
            @RequestParam Long roomId,
            @RequestParam String dayOfWeek,
            @RequestParam Long periodId,
            @RequestParam String evenOdd) {
        log.info("In moveScheduleItem with scheduleId = {}, roomId = {}, dayOfWeek = {}, periodId = {}, evenOdd = {}",
                scheduleId, roomId, dayOfWeek, periodId, evenOdd);
        List<ScheduleDTO> updated = scheduleService.moveSchedule(scheduleId, roomId, dayOfWeek, periodId, evenOdd);
        return ResponseEntity.ok(updated);
    }
}
