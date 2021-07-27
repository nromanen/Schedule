package com.softserve.controller;

import com.softserve.dto.GroupDTO;
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

@RestController
@Api(tags = "Group API")
@Slf4j
public class GroupController {

    private final GroupService groupService;
    private final GroupMapper groupMapper;

    @Autowired
    public GroupController(GroupService groupService, GroupMapper groupMapper) {
        this.groupService = groupService;
        this.groupMapper = groupMapper;
    }

    @GetMapping(path = {"/groups", "/public/groups"})
    @ApiOperation(value = "Get the list of all groups")
    public ResponseEntity<List<GroupDTO>> list() {
        log.info("In list ()");
        List<Group> groups = groupService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groups));
    }

    @GetMapping("/groups/{id}")
    @ApiOperation(value = "Get group info by id")
    public ResponseEntity<GroupDTO> get(@PathVariable("id") long id){
        log.info("In get(id = [{}])", id);
        Group group = groupService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupToGroupDTO(group));
    }

    @PostMapping("/groups")
    @ApiOperation(value = "Create new group")
    public ResponseEntity<GroupDTO> save(@RequestBody GroupDTO groupDTO) {
        log.info("In save (groupDTO = [{}])", groupDTO);
        Group group = groupService.save(groupMapper.groupDTOToGroup(groupDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(groupMapper.groupToGroupDTO(group));
    }

    @PutMapping("/groups")
    @ApiOperation(value = "Update existing group by id")
    public ResponseEntity<GroupDTO> update(@RequestBody GroupDTO groupDTO) {
        log.info("In update (groupDTO = [{}])", groupDTO);
        Group group = groupService.update(groupMapper.groupDTOToGroup(groupDTO));
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupToGroupDTO(group));
    }

    @DeleteMapping("/groups/{id}")
    @ApiOperation(value = "Delete group by id")
    public ResponseEntity delete(@PathVariable("id") long id){
        log.info("In delete (id =[{}]", id);
        Group group = groupService.getById(id);
        groupService.delete(group);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/groups/disabled")
    @ApiOperation(value = "Get the list of disabled groups")
    public ResponseEntity<List<GroupDTO>> getDisabled() {
        log.info("Enter into getDisabled");
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groupService.getDisabled()));
    }

    @GetMapping("/groups/current")
    @ApiOperation(value = "Get the list of all groups for current semester")
    public ResponseEntity<List<GroupDTO>> getGroupsByCurrentSemester(){
        log.info("In getGroupsByCurrentSemester");
        List<Group> groups = groupService.getGroupsByCurrentSemester();
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groups));
    }

    @GetMapping("/groups/semester/{semesterId}")
    @ApiOperation(value = "Get the list of all groups for semester by id")
    public ResponseEntity<List<GroupDTO>> getGroupsBySemesterId(@PathVariable Long semesterId){
        log.info("In getGroupsBySemesterId (semesterId =[{}]", semesterId);
        List<Group> groups = groupService.getGroupsBySemesterId(semesterId);
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groups));
    }
}
