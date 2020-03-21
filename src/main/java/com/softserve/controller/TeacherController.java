package com.softserve.controller;

import com.softserve.dto.TeacherDTO;
import com.softserve.entity.Teacher;
import com.softserve.service.TeacherService;
import com.softserve.service.mapper.TeacherMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping("teachers")
@Api(tags = "Teacher")
public class TeacherController {

    @Autowired
    private final TeacherService teacherService;
    private final TeacherMapper teacherMapper;

    @GetMapping
    @ApiOperation(value = "Get the list of all teachers")
    public ResponseEntity<List<TeacherDTO>> getAll() {
        return ResponseEntity.ok(teacherMapper.teachersToTeacherDTOs(teacherService.getAll()));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "Get teacher by id")
    public ResponseEntity<TeacherDTO> get(@PathVariable("id") Long id) {
        Teacher teacher = teacherService.getById(id);
        return ResponseEntity.ok().body(teacherMapper.teacherToTeacherDTO(teacher));
    }

    @PostMapping
    @ApiOperation(value = "Create new teacher")
    public ResponseEntity<TeacherDTO> save(@RequestBody TeacherDTO teacherDTO) {
        Teacher teacher = teacherService.save(teacherMapper.teacherDTOToTeacher(teacherDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(teacherMapper.teacherToTeacherDTO(teacher));
    }

    @PutMapping
    @ApiOperation(value = "Update existing teacher by id")
    public ResponseEntity<TeacherDTO> update(@RequestBody TeacherDTO updateTeacherDTO) {
        Teacher teacher = teacherService.update(teacherMapper.teacherDTOToTeacher(updateTeacherDTO));
        return ResponseEntity.status(HttpStatus.OK).body(teacherMapper.teacherToTeacherDTO(teacher));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete teacher by id")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        Teacher teacher = teacherService.getById(id);
        teacherService.delete(teacher);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}