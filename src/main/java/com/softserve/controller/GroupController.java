package com.softserve.controller;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.GroupOrderDTO;
import com.softserve.dto.GroupWithStudentsDTO;
import com.softserve.service.GroupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "Group API")
@RequestMapping("/groups")
public class GroupController {

    private final GroupService groupService;

    @GetMapping
    @Operation(summary = "Get the list of all groups")
    public ResponseEntity<List<GroupDTO>> getAll() {
        log.info("In getAll()");
        return ResponseEntity.ok(groupService.getAllBySortOrder());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get group info by id")
    public ResponseEntity<GroupDTO> get(@PathVariable("id") Long id) {
        log.info("In get(id = [{}])", id);
        return ResponseEntity.ok(groupService.getById(id));
    }

    @GetMapping("/{id}/with-students")
    @Operation(summary = "Get group info with students by id")
    public ResponseEntity<GroupWithStudentsDTO> getWithStudents(@PathVariable("id") Long id) {
        log.info("In getWithStudents(id = [{}])", id);
        return ResponseEntity.ok(groupService.getWithStudentsById(id));
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get groups by teacher id for the default semester")
    public ResponseEntity<List<GroupDTO>> getByTeacherId(@PathVariable("teacherId") Long teacherId) {
        log.info("In getByTeacherId(teacherId = [{}])", teacherId);
        return ResponseEntity.ok(groupService.getByTeacherId(teacherId));
    }

    @PostMapping
    @Operation(summary = "Create new group")
    public ResponseEntity<GroupDTO> save(@RequestBody GroupDTO groupDTO) {
        log.info("In save(groupDTO = [{}])", groupDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(groupService.save(groupDTO));
    }

    @PutMapping
    @Operation(summary = "Update existing group by id")
    public ResponseEntity<GroupDTO> update(@RequestBody GroupDTO groupDTO) {
        log.info("In update(groupDTO = [{}])", groupDTO);
        return ResponseEntity.ok(groupService.update(groupDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete group by id")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        log.info("In delete(id = [{}])", id);
        groupService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/disabled")
    @Operation(summary = "Get the list of disabled groups")
    public ResponseEntity<List<GroupDTO>> getDisabled() {
        log.info("In getDisabled()");
        return ResponseEntity.ok(groupService.getDisabled());
    }

    @PostMapping("/after")
    @Operation(summary = "Create group ordered after another")
    public ResponseEntity<GroupDTO> createGroupAfter(@RequestBody GroupOrderDTO groupDTO) {
        log.info("In createGroupAfter(groupDTO = [{}])", groupDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(groupService.createAfterOrder(groupDTO, groupDTO.getAfterId()));
    }

    @PutMapping("/after")
    @Operation(summary = "Update group order")
    public ResponseEntity<GroupDTO> updateGroupOrder(@RequestBody GroupOrderDTO groupDTO) {
        log.info("In updateGroupOrder(groupDTO = [{}])", groupDTO);
        return ResponseEntity.ok(groupService.updateAfterOrder(groupDTO, groupDTO.getAfterId()));
    }
}
