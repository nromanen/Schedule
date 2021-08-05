package com.softserve.controller;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.GroupForUpdateDTO;
import com.softserve.entity.Group;
import com.softserve.mapper.GroupMapper;
import com.softserve.service.GroupService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@Api(tags = "Group API")
@RequestMapping("/groups")
public class GroupController {

    private final GroupService groupService;
    private final GroupMapper groupMapper;

    @Autowired
    public GroupController(GroupService groupService, GroupMapper groupMapper) {
        this.groupService = groupService;
        this.groupMapper = groupMapper;
    }

    @GetMapping
    @ApiOperation(value = "Get the list of all groups")
    public ResponseEntity<List<GroupDTO>> getAll() {
        log.info("In getAll ()");
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groupService.getAll()));
    }

    @GetMapping("/no-students")
    @ApiOperation(value = "Get the list of all groups, but sets student list to empty")
    public ResponseEntity<List<GroupDTO>> getAllWithoutStudents() {
        log.info("In getAll ()");
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groupService.getAllWithoutStudents()));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get group info by id")
    public ResponseEntity<GroupDTO> get(@PathVariable("id") long id){
        log.info("In get(id = [{}])", id);
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupToGroupDTO(groupService.getById(id)));
    }

    @PostMapping
    @ApiOperation(value = "Create new group")
    public ResponseEntity<GroupDTO> save(@RequestBody GroupDTO groupDTO) {
        log.info("In save (groupDTO = [{}])", groupDTO);
        Group group = groupService.save(groupMapper.groupDTOToGroup(groupDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(groupMapper.groupToGroupDTO(group));
    }

    @PutMapping
    @ApiOperation(value = "Update existing group by id")
    public ResponseEntity<GroupForUpdateDTO> update(@RequestBody GroupForUpdateDTO groupForUpdateDTO) {
        log.info("In update (groupDTO = [{}])", groupForUpdateDTO);
        Group group = groupService.update(groupMapper.groupForUpdateDTOToGroup(groupForUpdateDTO));
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupToGroupForUpdateDTO(group));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete group by id")
    public ResponseEntity<Void> delete(@PathVariable("id") long id){
        log.info("In delete (id =[{}]", id);
        groupService.delete(groupService.getById(id));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/disabled")
    @ApiOperation(value = "Get the list of disabled groups")
    public ResponseEntity<List<GroupDTO>> getDisabled() {
        log.info("Enter into getDisabled");
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groupService.getDisabled()));
    }

    @GetMapping("/disabled/no-students")
    @ApiOperation(value = "Get the list of disabled groups, but sets student list to empty")
    public ResponseEntity<List<GroupDTO>> getDisabledWithoutStudents() {
        log.info("Enter into getDisabled");
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groupService.getDisabledWithoutStudents()));
    }

}
