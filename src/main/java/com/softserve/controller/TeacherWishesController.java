package com.softserve.controller;

import com.softserve.dto.TeacherWishesDTO;
import com.softserve.entity.TeacherWishes;
import com.softserve.service.TeacherWishesService;
import com.softserve.service.mapper.TeacherWishesMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;

@Transactional
@RestController
@Api(tags = "Teacher Wishes API")
@RequestMapping("/teacher_wishes")
@Slf4j
public class TeacherWishesController {
    private final TeacherWishesService teacherWishesService;
    private final TeacherWishesMapper teacherWishesMapper;

    @Autowired
    public TeacherWishesController(TeacherWishesService teacherWishesService, TeacherWishesMapper teacherWishesMapper) {
        this.teacherWishesService = teacherWishesService;
        this.teacherWishesMapper = teacherWishesMapper;
    }

   /* @GetMapping
    @ApiOperation(value = "Get the list of all groups")
    public ResponseEntity<List<GroupDTO>> list() {
        log.info("Enter into list method of {}", getClass().getName());
       // List<Group> groups = groupService.getAll();
        return ResponseEntity.status(HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get group info by id")
    public ResponseEntity<GroupDTO> get(@PathVariable("id") long id){
        log.info("Enter into get method of {} with id {} ", getClass().getName(), id);
        Group group = groupService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(groupMapper.groupToGroupDTO(group));
    }*/

    @PostMapping
    @ApiOperation(value = "Create new teacher wish")
    public ResponseEntity<TeacherWishesDTO> save(@RequestBody TeacherWishesDTO teacherWishesDTO) {
        log.info("Enter into save method with TeacherWishesDTO: {}", teacherWishesDTO);
        TeacherWishes teacherWishes = teacherWishesService.save(teacherWishesMapper.teacherWishesDTOToTeacherWishes(teacherWishesDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(teacherWishesMapper.teacherWishesToTeacherWishesDTO(teacherWishes));
    }

    @PutMapping()
    @ApiOperation(value = "Update existing wish by id")
    public ResponseEntity<TeacherWishesDTO> update(@RequestBody TeacherWishesDTO teacherWishesDTO) {
        log.info("Enter into update method with TeacherWishesDTO: {}", teacherWishesDTO);
        teacherWishesService.getById(teacherWishesDTO.getId());
        TeacherWishes teacherWishes = teacherWishesService.update(teacherWishesMapper.teacherWishesDTOToTeacherWishes(teacherWishesDTO));
        return ResponseEntity.status(HttpStatus.OK).body(teacherWishesMapper.teacherWishesToTeacherWishesDTO(teacherWishes));
    }

   /* @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete group by id")
    public ResponseEntity delete(@PathVariable("id") long id){
        log.info("Enter into delete method of {} with  group id: {}", getClass().getName(), id);
        Group group = groupService.getById(id);
        groupService.delete(group);
        return ResponseEntity.status(HttpStatus.OK).build();
    }*/


}
