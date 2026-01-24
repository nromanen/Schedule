package com.softserve.controller;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import com.softserve.dto.TeacherImportDTO;
import com.softserve.service.ScheduleService;
import com.softserve.service.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;

@RestController
@Tag(name = "Teacher API")
@Slf4j
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;
    private final ScheduleService scheduleService;

    @GetMapping(path = {"/teachers", "/public/teachers"})
    @Operation(summary = "Get the list of all teachers")
    public ResponseEntity<List<TeacherDTO>> getAll() {
        log.info("Getting all teachers");
        return ResponseEntity.ok(teacherService.getAll());
    }

    @GetMapping("/teachers/{id}")
    @Operation(summary = "Get teacher by id")
    public ResponseEntity<TeacherDTO> getById(@PathVariable Long id) {
        log.info("Getting teacher by id: {}", id);
        return ResponseEntity.ok(teacherService.getById(id));
    }

    @PostMapping("/teachers")
    @Operation(summary = "Create new teacher")
    public ResponseEntity<TeacherDTO> create(@RequestBody TeacherDTO teacherDTO) {
        log.info("Creating teacher: {}", teacherDTO);
        TeacherDTO created = teacherService.save(teacherDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/teachers")
    @Operation(summary = "Update existing teacher by id")
    public ResponseEntity<TeacherForUpdateDTO> update(@RequestBody TeacherForUpdateDTO teacherForUpdateDTO) {
        log.info("Updating teacher: {}", teacherForUpdateDTO);
        TeacherForUpdateDTO updated = teacherService.update(teacherForUpdateDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/teachers/{id}")
    @Operation(summary = "Delete teacher by id")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("Deleting teacher by id: {}", id);
        teacherService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/teachers/disabled")
    @Operation(summary = "Get the list of disabled teachers")
    public ResponseEntity<List<TeacherDTO>> getDisabled() {
        log.info("Getting disabled teachers");
        return ResponseEntity.ok(teacherService.getDisabled());
    }

    @GetMapping("/not-registered-teachers")
    @Operation(summary = "Get the list of all teachers, that don't registered in system")
    public ResponseEntity<List<TeacherDTO>> getAllNotRegisteredTeachers() {
        log.info("Getting all teachers without registered user");
        return ResponseEntity.ok(teacherService.getAllTeacherWithoutUser());
    }

    @GetMapping("/send-pdf-to-email/semester/{id}")
    @Operation(summary = "Send pdf with schedule to teachers emails")
    public ResponseEntity<Void> sendSchedulesToEmail(
            @PathVariable("id") Long semesterId,
            @RequestParam Long[] teachersId,
            @RequestParam Locale language) {
        log.info("Sending schedules to teachers: {} for semester: {}", teachersId, semesterId);
        scheduleService.sendScheduleToTeachers(semesterId, teachersId, language);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/teachers/import")
    @Operation(summary = "Import teachers from file to database")
    public ResponseEntity<List<TeacherImportDTO>> importFromCsv(
            @Parameter(description = "CSV format is required")
            @RequestParam("file") MultipartFile file,
            @RequestParam Long departmentId) {
        log.info("Importing teachers from file for department: {}", departmentId);
        List<TeacherImportDTO> imported = teacherService.saveFromFile(file, departmentId);
        return ResponseEntity.ok(imported);
    }
}
