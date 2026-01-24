package com.softserve.controller;

import com.softserve.dto.SubjectDTO;
import com.softserve.dto.SubjectNameWithTypesDTO;
import com.softserve.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Subject API")
@RequestMapping("/subjects")
@Slf4j
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    @Operation(summary = "Get the list of all subjects")
    public ResponseEntity<List<SubjectDTO>> getAll() {
        log.info("Getting all subjects");
        return ResponseEntity.ok(subjectService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get subject info by id")
    public ResponseEntity<SubjectDTO> getById(@PathVariable Long id) {
        log.info("Getting subject by id: {}", id);
        return ResponseEntity.ok(subjectService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Create new subject")
    public ResponseEntity<SubjectDTO> create(@RequestBody SubjectDTO subjectDTO) {
        log.info("Creating subject: {}", subjectDTO);
        SubjectDTO created = subjectService.save(subjectDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping
    @Operation(summary = "Update existing subject by id")
    public ResponseEntity<SubjectDTO> update(@RequestBody SubjectDTO subjectDTO) {
        log.info("Updating subject: {}", subjectDTO);
        SubjectDTO updated = subjectService.update(subjectDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete subject by id")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("Deleting subject by id: {}", id);
        subjectService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/disabled")
    @Operation(summary = "Get the list of disabled subjects")
    public ResponseEntity<List<SubjectDTO>> getDisabled() {
        log.info("Getting disabled subjects");
        return ResponseEntity.ok(subjectService.getDisabled());
    }

    @GetMapping("/semester/{semesterId}/teacher/{teacherId}")
    @Operation(summary = "Get the list of subjects by teacher id and semester id")
    public ResponseEntity<List<SubjectNameWithTypesDTO>> getSubjectsWithTypes(
            @PathVariable Long semesterId,
            @PathVariable Long teacherId) {
        log.info("Getting subjects with types for semester: {} and teacher: {}", semesterId, teacherId);
        return ResponseEntity.ok(subjectService.getSubjectsWithTypes(semesterId, teacherId));
    }
}
