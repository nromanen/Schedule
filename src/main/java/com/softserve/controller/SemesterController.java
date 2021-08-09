package com.softserve.controller;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.SemesterDTO;
import com.softserve.dto.SemesterWithGroupsDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Semester;
import com.softserve.mapper.GroupMapper;
import com.softserve.mapper.SemesterMapper;
import com.softserve.service.GroupService;
import com.softserve.service.SemesterService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Api(tags = "Semester API")
@Slf4j
public class SemesterController {

    private final SemesterService semesterService;
    private final SemesterMapper semesterMapper;
    private final GroupMapper groupMapper;
    private final GroupService groupService;

    @Autowired
    public SemesterController(SemesterService semesterService, SemesterMapper semesterMapper, GroupMapper groupMapper, GroupService groupService) {
        this.semesterService = semesterService;
        this.semesterMapper = semesterMapper;
        this.groupMapper = groupMapper;
        this.groupService = groupService;
    }

    @GetMapping(path = {"/semesters", "/public/semesters"})
    @ApiOperation(value = "Get the list of all semesters")
    public ResponseEntity<List<SemesterDTO>> list() {
        log.info("In list ()");
        List<Semester> semesters = semesterService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(semesterMapper.semestersToSemesterDTOs(semesters));
    }

    @GetMapping("/semesters/{id}")
    @ApiOperation(value = "Get semester info by id")
    public ResponseEntity<SemesterWithGroupsDTO> get(@PathVariable("id") long id){
        log.info("In get(id = [{}])", id);
        Semester semester = semesterService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(semesterMapper.semesterToSemesterWithGroupsDTO(semester));
    }

    @GetMapping("/semesters/current")
    @ApiOperation(value = "Get current semester a manager is working on")
    public ResponseEntity<SemesterDTO> getCurrent(){
        log.info("In getCurrent()");
        Semester semester = semesterService.getCurrentSemester();
        return ResponseEntity.status(HttpStatus.OK).body(semesterMapper.semesterToSemesterDTO(semester));
    }

    @GetMapping("/semesters/default")
    @ApiOperation(value = "Get default semester")
    public ResponseEntity<SemesterDTO> getDefault(){
        log.info("In getDefault()");
        Semester semester = semesterService.getDefaultSemester();
        return ResponseEntity.status(HttpStatus.OK).body(semesterMapper.semesterToSemesterDTO(semester));
    }

    @PutMapping("/semesters/current")
    @ApiOperation(value = "Change current semester a manager is working on")
    public ResponseEntity<SemesterDTO> setCurrent(@RequestParam Long semesterId){
        log.info("In setCurrent(semesterId = [{}])", semesterId);
        Semester semester = semesterService.changeCurrentSemester(semesterId);
        return ResponseEntity.status(HttpStatus.OK).body(semesterMapper.semesterToSemesterDTO(semester));
    }

    @PutMapping("/semesters/default")
    @ApiOperation(value = "Change default semester a manager is working on")
    public ResponseEntity<SemesterDTO> setDefault(@RequestParam Long semesterId){
        log.info("In setDefault(semesterId = [{}])", semesterId);
        Semester semester = semesterService.changeDefaultSemester(semesterId);
        return ResponseEntity.status(HttpStatus.OK).body(semesterMapper.semesterToSemesterDTO(semester));
    }

    @PostMapping("/semesters")
    @ApiOperation(value = "Create new semester")
    public ResponseEntity<SemesterDTO> save(@RequestBody SemesterDTO semesterDTO) {
        log.info("In save (semesterDTO = [{}])", semesterDTO);
        Semester semester = semesterService.save(semesterMapper.semesterDTOToSemester(semesterDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(semesterMapper.semesterToSemesterDTO(semester));
    }

    @PutMapping("/semesters")
    @ApiOperation(value = "Update existing semester by id")
    public ResponseEntity<SemesterWithGroupsDTO> update(@RequestBody SemesterDTO semesterDTO) {
        log.info("In update (semesterDTO = [{}])", semesterDTO);
        semesterService.getById(semesterDTO.getId());
        Semester semester = semesterService.update(semesterMapper.semesterDTOToSemester(semesterDTO));
        return ResponseEntity.status(HttpStatus.OK).body(semesterMapper.semesterToSemesterWithGroupsDTO(semester));
    }

    @DeleteMapping("/semesters/{id}")
    @ApiOperation(value = "Delete semester by id")
    public ResponseEntity delete(@PathVariable("id") long id){
        log.info("In delete (id =[{}]", id);
        Semester semester = semesterService.getById(id);
        semesterService.delete(semester);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


    @GetMapping("/semesters/disabled")
    @ApiOperation(value = "Get the list of disabled semester")
    public ResponseEntity<List<SemesterDTO>> getDisabled() {
        log.info("Enter into getDisabled");
        return ResponseEntity.ok().body(semesterMapper.semestersToSemesterDTOs(semesterService.getDisabled()));
    }

    @PutMapping("/semesters/{semesterId}/group")
    @ApiOperation(value = "Add group to semester by id")
    public ResponseEntity<SemesterWithGroupsDTO> addGroupToSemester(@PathVariable Long semesterId, @RequestParam Long groupId) {
        log.info("In addGroup (semesterId = [{}], groupId = [{}])", semesterId, groupId);
        Semester semester = semesterService.addGroupToSemester(semesterService.getById(semesterId), groupService.getById(groupId));
        return ResponseEntity.status(HttpStatus.OK).body(semesterMapper.semesterToSemesterWithGroupsDTO(semester));
    }

    @GetMapping("/semesters/current/groups")
    @ApiOperation(value = "Get the list of all groups for current semester")
    public ResponseEntity<List<GroupDTO>> getGroupsForCurrentSemester(){
        log.info("In getGroupsForCurrentSemester"    );
        List<Group> groups = groupService.getGroupsForCurrentSemester();
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groups));
    }

    @GetMapping("/semesters/default/groups")
    @ApiOperation(value = "Get the list of all groups for default semester")
    public ResponseEntity<List<GroupDTO>> getGroupsForDefaultSemester(){
        log.info("In getGroupsForDefaultSemester"    );
        List<Group> groups = groupService.getGroupsForDefaultSemester();
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groups));
    }

    @GetMapping("/semesters/{semesterId}/groups")
    @ApiOperation(value = "Get the list of all groups for semester by id")
    public ResponseEntity<List<GroupDTO>> getGroupsBySemesterId(@PathVariable Long semesterId){
        log.info("In getGroupsBySemesterId (semesterId =[{}]", semesterId);
        List<Group> groups = groupService.getGroupsBySemesterId(semesterId);
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupsToGroupDTOs(groups));
    }
}
