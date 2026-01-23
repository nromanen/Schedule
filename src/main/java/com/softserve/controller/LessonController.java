package com.softserve.controller;

import com.softserve.dto.*;
import com.softserve.entity.enums.LessonType;
import com.softserve.mapper.LessonInfoMapper;
import com.softserve.service.LessonService;
import com.softserve.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Lesson API")
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/lessons")
public class LessonController {

    private final LessonService lessonService;
    private final LessonInfoMapper lessonInfoMapper;
    private ScheduleService scheduleService;

    @Operation(summary = "Get list of all lessons")
    @GetMapping
    public ResponseEntity<List<LessonInfoDTO>> list(
            @RequestParam(required = false)
            @Parameter(description = "Get all lessons for particular group") Long groupId) {
        log.info("In list(groupId = [{}])", groupId);
        if (groupId != null) {
            return ResponseEntity.ok(lessonService.getAllForGroup(groupId));
        }
        return ResponseEntity.ok(lessonService.getAll());
    }

    @Operation(summary = "Get lesson info by id")
    @GetMapping("/{id}")
    public ResponseEntity<LessonInfoDTO> get(@PathVariable("id") Long id) {
        log.info("In get(id = [{}])", id);
        return ResponseEntity.ok(lessonService.getById(id));
    }

    @Operation(summary = "Get lessons info by teacher")
    @GetMapping("/teacher")
    public ResponseEntity<List<LessonInfoDTO>> getByTeacher(@RequestParam Long teacherId) {
        log.info("In getByTeacher(teacherId = [{}])", teacherId);
        return ResponseEntity.ok(lessonService.getByTeacher(teacherId));
    }

    @Operation(summary = "Create new lessons")
    @PostMapping
    public ResponseEntity<List<LessonInfoDTO>> save(
            @RequestBody LessonForGroupsDTO lessonForGroupsDTO) {
        log.info("In save(lessonForGroupsDTO = [{}])", lessonForGroupsDTO);
        List<LessonInfoDTO> lessons = lessonInfoMapper
                .lessonsToLessonInfoDTOs(
                        lessonInfoMapper.lessonForGroupsDTOToLessons(lessonForGroupsDTO));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lessonService.saveAll(lessons));
    }

    @Operation(summary = "Update existing lesson")
    @PutMapping
    public ResponseEntity<LessonInfoDTO> update(@RequestBody LessonInfoDTO lessonInfoDTO) {
        log.info("In update(lessonInfoDTO = [{}])", lessonInfoDTO);
        return ResponseEntity.ok(lessonService.update(lessonInfoDTO));
    }

    @Operation(summary = "Delete lesson by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        log.info("In delete(id = [{}])", id);
        lessonService.delete(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get all lesson types")
    @GetMapping("/types")
    public ResponseEntity<List<LessonType>> getLessonTypes() {
        log.info("In getLessonTypes()");
        return ResponseEntity.ok(lessonService.getAllLessonTypes());
    }

    @Operation(summary = "Copy all lessons from one semester to another")
    @PostMapping("/copy-lessons")
    public ResponseEntity<List<LessonDTO>> copyLessonsToSemester(
            @RequestParam Long fromSemesterId,
            @RequestParam Long toSemesterId) {
        log.info("In copyLessonsToSemester(from = [{}], to = [{}])", fromSemesterId, toSemesterId);
        return ResponseEntity.ok(lessonService.copyLessonsToSemester(fromSemesterId, toSemesterId));
    }

    @Operation(summary = "Copy lesson for several groups")
    @PostMapping("/copy-lesson-for-groups")
    public ResponseEntity<List<LessonInfoDTO>> copyLessonForGroups(
            @RequestParam Long lessonId,
            @RequestBody List<Long> groupIds) {
        log.info("In copyLessonForGroups(lessonId = [{}], groupIds = [{}])", lessonId, groupIds);
        return ResponseEntity.ok(lessonService.copyLessonForGroups(lessonId, groupIds));
    }

    @Operation(summary = "Get all groups with their lessons for adding a group lesson to schedule")
    @GetMapping("/all-groups-with-their-lessons-for-grouped-lesson/{lessonId}")
    public ResponseEntity<List<GroupWithLessonIdDTO>> getGroupsWithLessonsForGroupedClass(
            @PathVariable("lessonId") Long lessonId) {
        log.info("In getGroupsWithLessonsForGroupedClass(lessonId = [{}])", lessonId);
        return ResponseEntity.ok(scheduleService.getGroupsWithLessonsForGroupedClass(lessonId));
    }

    @Operation(summary = "Update link to meeting")
    @PutMapping("/link")
    public ResponseEntity<Integer> updateLinkToMeeting(
            @RequestBody LessonWithLinkDTO lessonWithLinkDTO) {
        log.info("In updateLinkToMeeting(lessonWithLinkDTO = [{}])", lessonWithLinkDTO);
        return ResponseEntity.ok(lessonService.updateLinkToMeeting(lessonWithLinkDTO));
    }
}
