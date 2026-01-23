package com.softserve.controller;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.SemesterDTO;
import com.softserve.dto.SemesterWithGroupsDTO;
import com.softserve.service.GroupService;
import com.softserve.service.SemesterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "Semester API")
public class SemesterController {

    private final SemesterService semesterService;
    private final GroupService groupService;

    @GetMapping(path = {"/semesters", "/public/semesters"})
    @Operation(summary = "Get the list of all semesters")
    public ResponseEntity<List<SemesterWithGroupsDTO>> list() {
        log.info("In list()");
        return ResponseEntity.ok(semesterService.getAll());
    }

    @GetMapping("/semesters/{id}")
    @Operation(summary = "Get semester info by id")
    public ResponseEntity<SemesterWithGroupsDTO> get(@PathVariable("id") Long id) {
        log.info("In get(id = [{}])", id);
        return ResponseEntity.ok(semesterService.getById(id));
    }

    @GetMapping("/semesters/current")
    @Operation(summary = "Get current semester a manager is working on")
    public ResponseEntity<SemesterWithGroupsDTO> getCurrent() {
        log.info("In getCurrent()");
        return ResponseEntity.ok(semesterService.getCurrentSemester());
    }

    @GetMapping("/semesters/default")
    @Operation(summary = "Get default semester")
    public ResponseEntity<SemesterWithGroupsDTO> getDefault() {
        log.info("In getDefault()");
        return ResponseEntity.ok(semesterService.getDefaultSemester());
    }

    @PutMapping("/semesters/current")
    @Operation(summary = "Change current semester a manager is working on")
    public ResponseEntity<SemesterDTO> setCurrent(@RequestParam Long semesterId) {
        log.info("In setCurrent(semesterId = [{}])", semesterId);
        return ResponseEntity.ok(semesterService.changeCurrentSemester(semesterId));
    }

    @PutMapping("/semesters/default")
    @Operation(summary = "Change default semester a manager is working on")
    public ResponseEntity<SemesterDTO> setDefault(@RequestParam Long semesterId) {
        log.info("In setDefault(semesterId = [{}])", semesterId);
        return ResponseEntity.ok(semesterService.changeDefaultSemester(semesterId));
    }

    @PostMapping("/semesters")
    @Operation(summary = "Create new semester")
    public ResponseEntity<SemesterWithGroupsDTO> save(@RequestBody SemesterWithGroupsDTO semesterDTO) {
        log.info("In save(semesterDTO = [{}])", semesterDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(semesterService.save(semesterDTO));
    }

    @PutMapping("/semesters")
    @Operation(summary = "Update existing semester by id")
    public ResponseEntity<SemesterWithGroupsDTO> update(@RequestBody SemesterWithGroupsDTO semesterDTO) {
        log.info("In update(semesterDTO = [{}])", semesterDTO);
        return ResponseEntity.ok(semesterService.update(semesterDTO));
    }

    @DeleteMapping("/semesters/{id}")
    @Operation(summary = "Delete semester by id")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        log.info("In delete(id = [{}])", id);
        semesterService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/semesters/disabled")
    @Operation(summary = "Get the list of disabled semester")
    public ResponseEntity<List<SemesterDTO>> getDisabled() {
        log.info("In getDisabled()");
        return ResponseEntity.ok(semesterService.getDisabled());
    }

    @PutMapping("/semesters/{semesterId}/groups")
    @Operation(summary = "Replace groups in semester by id")
    public ResponseEntity<SemesterWithGroupsDTO> addGroupsToSemester(
            @PathVariable Long semesterId,
            @RequestBody List<Long> groupIds) {
        log.info("In addGroupsToSemester(semesterId = [{}], groupIds = [{}])", semesterId, groupIds);
        return ResponseEntity.ok(semesterService.addGroupsToSemester(semesterId, groupIds));
    }

    @GetMapping("/semesters/current/groups")
    @Operation(summary = "Get the list of all groups for current semester")
    public ResponseEntity<List<GroupDTO>> getGroupsForCurrentSemester() {
        log.info("In getGroupsForCurrentSemester()");
        return ResponseEntity.ok(new ArrayList<>(groupService.getGroupsForCurrentSemester()));
    }

    @GetMapping("/semesters/default/groups")
    @Operation(summary = "Get the list of all groups for default semester")
    public ResponseEntity<List<GroupDTO>> getGroupsForDefaultSemester() {
        log.info("In getGroupsForDefaultSemester()");
        return ResponseEntity.ok(new ArrayList<>(groupService.getGroupsForDefaultSemester()));
    }

    @GetMapping("/semesters/{semesterId}/groups")
    @Operation(summary = "Get the list of all groups for semester by id")
    public ResponseEntity<List<GroupDTO>> getGroupsBySemesterId(@PathVariable Long semesterId) {
        log.info("In getGroupsBySemesterId(semesterId = [{}])", semesterId);
        return ResponseEntity.ok(new ArrayList<>(groupService.getGroupsBySemesterId(semesterId)));
    }

    @PostMapping("/semesters/copy-semester")
    @Operation(summary = "Copy full semester from one to another semester")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<SemesterWithGroupsDTO> copySemester(
            @RequestParam Long fromSemesterId,
            @RequestParam Long toSemesterId) {
        log.info("In copySemester(fromSemesterId = [{}], toSemesterId = [{}])", fromSemesterId, toSemesterId);
        return ResponseEntity.ok(semesterService.copySemester(fromSemesterId, toSemesterId));
    }
}
