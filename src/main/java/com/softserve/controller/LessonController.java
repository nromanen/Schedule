package com.softserve.controller;


import com.softserve.dto.LessonInfoDTO;
import com.softserve.entity.Lesson;
import com.softserve.entity.enums.LessonType;
import com.softserve.service.LessonService;
import com.softserve.mapper.LessonInfoMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Api(tags = "Lesson API")
@Slf4j
@RequestMapping("/lessons")
public class LessonController {

    private final LessonService lessonService;
    private final LessonInfoMapper lessonInfoMapper;

    @Autowired
    public LessonController(LessonService lessonService, LessonInfoMapper lessonInfoMapper) {
        this.lessonService = lessonService;
        this.lessonInfoMapper = lessonInfoMapper;
    }


    @ApiOperation(value = "Get list of all lessons")
    @GetMapping
    public ResponseEntity<List<LessonInfoDTO>> list(@RequestParam(required = false) @ApiParam(value = "Get all lessons for particular group") Long groupId) {
        log.info("In list ()");
        List<Lesson> lessons = groupId == null ? lessonService.getAll() : lessonService.getAllForGroup(groupId);
        return  ResponseEntity.status(HttpStatus.OK).body(lessonInfoMapper.lessonsToLessonInfoDTOs(lessons));

    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get lesson info by id")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<LessonInfoDTO> get(@PathVariable("id") long id){
        log.info("In get(id = [{}])", id);
        Lesson lesson = lessonService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(lessonInfoMapper.lessonToLessonInfoDTO(lesson));
    }

    @GetMapping("/teacher")
    @ApiOperation(value = "Get lessons info by teacher")
    public ResponseEntity<List<LessonInfoDTO>> getLessonByTeacher(@RequestParam long teacherId){
        log.info("In getLessonByTeacher(teacherId = [{}])", teacherId);
        List<Lesson> lessons = lessonService.getLessonByTeacher(teacherId);
        return ResponseEntity.status(HttpStatus.OK).body(lessonInfoMapper.lessonsToLessonInfoDTOs(lessons));
    }

    @PostMapping
    @ApiOperation(value = "Create new lesson")
    public ResponseEntity<LessonInfoDTO> save(@RequestBody LessonInfoDTO lessonInfoDTO) {
        log.info("In save (lessonInfoDTO = [{}])", lessonInfoDTO);
        Lesson newLesson = lessonService.save(lessonInfoMapper.lessonInfoDTOToLesson(lessonInfoDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(lessonInfoMapper.lessonToLessonInfoDTO(newLesson));
    }

    @PutMapping
    @ApiOperation(value = "Update existing lesson")
    public ResponseEntity<LessonInfoDTO> update( @RequestBody LessonInfoDTO lessonInfoDTO) {
        log.info("In update (lessonInfoDTO = [{}])", lessonInfoDTO);
        lessonService.getById(lessonInfoDTO.getId());
        Lesson updatedLesson = lessonService.update(lessonInfoMapper.lessonInfoDTOToLesson(lessonInfoDTO));
        return ResponseEntity.status(HttpStatus.OK).body(lessonInfoMapper.lessonToLessonInfoDTO(updatedLesson));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete lesson by id")
    public ResponseEntity delete(@PathVariable("id") long id) {
        log.info("In delete (id =[{}]", id);
        Lesson lesson = lessonService.getById(id);
        lessonService.delete(lesson);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/types")
    @ApiOperation(value = "Get all lesson types")
    public ResponseEntity<List<LessonType>> getLessonTypes() {
        log.info("In getLessonTypes()");
        return ResponseEntity.status(HttpStatus.OK).body(lessonService.getAllLessonTypes());
    }

}
