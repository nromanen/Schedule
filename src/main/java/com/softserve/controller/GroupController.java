package com.softserve.controller;

import com.softserve.dto.GroupDTO;
import com.softserve.entity.Group;
import com.softserve.service.GroupService;
import com.softserve.mapper.GroupMapper;
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
    public ResponseEntity<List<GroupDTO>> list() {
        log.info("In list ()");
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.convertListToDtoList(groupService.getAll()));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get group info by id")
    public ResponseEntity<GroupDTO> get(@PathVariable("id") long id){
        log.info("In get(id = [{}])", id);
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.convertToDto(groupService.getById(id)));
    }

    @PostMapping
    @ApiOperation(value = "Create new group")
    public ResponseEntity<GroupDTO> save(@RequestBody GroupDTO groupDTO) {
        log.info("In save (groupDTO = [{}])", groupDTO);
        Group group = groupService.save(groupMapper.convertToEntity(groupDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(groupMapper.convertToDto(group));
    }

    @PutMapping
    @ApiOperation(value = "Update existing group by id")
    public ResponseEntity<GroupDTO> update(@RequestBody GroupDTO groupDTO) {
        log.info("In update (groupDTO = [{}])", groupDTO);
        Group group = groupService.update(groupMapper.convertToEntity(groupDTO));
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.convertToDto(group));
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
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.convertListToDtoList(groupService.getDisabled()));
    }
}
