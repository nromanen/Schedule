package com.softserve.controller;

import com.softserve.dto.DepartmentDTO;
import com.softserve.dto.TeacherDTO;
import com.softserve.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/departments")
@Tag(name = "Department API")
@Slf4j
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    @Operation(summary = "Get the list of all departments")
    public ResponseEntity<List<DepartmentDTO>> getAll() {
        log.info("In getAll()");
        return ResponseEntity.ok(departmentService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get department info by id")
    public ResponseEntity<DepartmentDTO> getById(@PathVariable("id") Long id) {
        log.info("In getById(id = [{}])", id);
        return ResponseEntity.ok(departmentService.getById(id));
    }

    @GetMapping("/{id}/teachers")
    @Operation(summary = "Get the list of all teachers in the department")
    public ResponseEntity<List<TeacherDTO>> getAllTeachers(@PathVariable("id") Long id) {
        log.info("In getAllTeachers(id = [{}])", id);
        return ResponseEntity.ok(departmentService.getAllTeachers(id));
    }

    @PostMapping
    @Operation(summary = "Create new department")
    public ResponseEntity<DepartmentDTO> save(@RequestBody DepartmentDTO departmentDTO) {
        log.info("In save(departmentDTO = [{}])", departmentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.save(departmentDTO));
    }

    @PutMapping
    @Operation(summary = "Update existing department")
    public ResponseEntity<DepartmentDTO> update(@RequestBody DepartmentDTO departmentDTO) {
        log.info("In update(departmentDTO = [{}])", departmentDTO);
        return ResponseEntity.ok(departmentService.update(departmentDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete department by id")
    public ResponseEntity<DepartmentDTO> deleteById(@PathVariable("id") Long id) {
        log.info("In deleteById(id = [{}])", id);
        return ResponseEntity.ok(departmentService.delete(id));
    }

    @GetMapping("/disabled")
    @Operation(summary = "Get the list of disabled departments")
    public ResponseEntity<List<DepartmentDTO>> getDisabled() {
        log.info("In getDisabled()");
        return ResponseEntity.ok(departmentService.getDisabled());
    }
}
