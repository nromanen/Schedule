package com.softserve.controller;

import com.softserve.dto.GroupDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Room;
import com.softserve.entity.Subject;
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
import java.util.Optional;
import java.util.stream.Collectors;

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
        log.info("Enter into list of GroupController");
        List<Group> groups = groupService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groups));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get group info by id")
    public ResponseEntity<GroupDTO> get(@PathVariable("id") long id){
        log.info("Enter into get of GroupController with id {} ", id);
        Group group = groupService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupToGroupDTO(group));
    }

    @PostMapping
    @ApiOperation(value = "Create new group")
    public ResponseEntity<GroupDTO> save(@RequestBody GroupDTO groupDTO) {
        log.info("Enter into save of GroupController with groupDTO: {}", groupDTO);
        Group group = groupService.save(groupMapper.groupDTOToGroup(groupDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(groupMapper.groupToGroupDTO(group));
    }

    @PutMapping
    @ApiOperation(value = "Update existing group by id")
    public ResponseEntity<?> update(@RequestBody GroupDTO groupDTO) {
        log.info("Enter into update of GroupController with groupDTO: {}", groupDTO);
        Group group = groupService.update(groupMapper.groupDTOToGroup(groupDTO));
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupToGroupDTO(group));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete group by id")
    public ResponseEntity<?> delete(@PathVariable("id") long id){
        log.info("Enter into delete of GroupController with  group id: {}", id);
        Group group = groupService.getById(id);
        groupService.delete(group);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}
