package com.softserve.controller;

import com.softserve.dto.GroupDTO;
import com.softserve.entity.Group;
import com.softserve.service.GroupService;
import com.softserve.service.mapper.GroupMapper;
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
@RequestMapping("/groups")
@Slf4j
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
    public ResponseEntity<List<GroupDTO>> list() {
        log.info("In list method ");
        List<Group> groups = groupService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groups));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get group info by id")
    public ResponseEntity<GroupDTO> get(@PathVariable("id") long id){
        log.info("Enter into get method with id {} ", id);
        Group group = groupService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupToGroupDTO(group));
    }

    @PostMapping
    @ApiOperation(value = "Create new group")
    public ResponseEntity<GroupDTO> save(@RequestBody GroupDTO groupDTO) {
        log.info("Enter into save method with groupDTO: {}", groupDTO);
        Group group = groupService.save(groupMapper.groupDTOToGroup(groupDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(groupMapper.groupToGroupDTO(group));
    }

    @PutMapping()
    @ApiOperation(value = "Update existing group by id")
    public ResponseEntity<GroupDTO> update(@RequestBody GroupDTO groupDTO) {
        log.info("Enter into update method with groupDTO: {}", groupDTO);
        Group group = groupService.update(groupMapper.groupDTOToGroup(groupDTO));
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupToGroupDTO(group));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete group by id")
    public ResponseEntity delete(@PathVariable("id") long id){
        log.info("Enter into delete method with group id: {}", id);
        Group group = groupService.getById(id);
        groupService.delete(group);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}
