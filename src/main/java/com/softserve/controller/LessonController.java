package com.softserve.controller;


import com.softserve.dto.LessonInfoDTO;
import com.softserve.entity.Lesson;
import com.softserve.service.LessonService;
import com.softserve.service.mapper.LessonInfoMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
        if (groupId == null){
            log.info("Enter into list method of {}", getClass().getName());
            List<Lesson> lessons = lessonService.getAll();
            return  ResponseEntity.status(HttpStatus.OK).body(lessons.stream().map(lessonInfoMapper::lessonToLessonInfoDTO).collect(Collectors.toList()));
        }
        else {
            log.info("List method of {} . Get list of all lessons for group with id = {}", getClass().getName(), groupId);
            List<Lesson> lessons = lessonService.getAllForGroup(groupId);
            return  ResponseEntity.status(HttpStatus.OK).body(lessonInfoMapper.lessonsToLessonInfoDTOs(lessons));
        }

    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get lesson info by id")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<LessonInfoDTO> get(@PathVariable("id") long id){
        log.info("Enter into get method of {} with id {} ", getClass().getName(), id);
        Lesson lesson = lessonService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(lessonInfoMapper.lessonToLessonInfoDTO(lesson));
    }


    @PostMapping
    @ApiOperation(value = "Create new lesson")
    public ResponseEntity<LessonInfoDTO> save(@RequestBody LessonInfoDTO lessonInfoDTO) {
        log.info("Enter into save method of {} with lessonInfoDTO: {}", getClass().getName(), lessonInfoDTO);
       Lesson newLesson = lessonService.save(lessonInfoMapper.lessonInfoDTOToLesson(lessonInfoDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(lessonInfoMapper.lessonToLessonInfoDTO(newLesson));
    }

    @PutMapping
    @ApiOperation(value = "Update existing lesson")
    public ResponseEntity<LessonInfoDTO> update( @RequestBody LessonInfoDTO lessonInfoDTO) {
        log.info("Enter into update method of {} with lessonInfoDTO: {}", getClass().getName(), lessonInfoDTO);
        lessonService.getById(lessonInfoDTO.getId());
        Lesson updatedLesson = lessonService.update(lessonInfoMapper.lessonInfoDTOToLesson(lessonInfoDTO));
        return ResponseEntity.status(HttpStatus.OK).body(lessonInfoMapper.lessonToLessonInfoDTO(updatedLesson));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete lesson by id")
    public ResponseEntity delete(@PathVariable("id") long id) {
        log.info("Enter into delete method of {} with  group id: {}", getClass().getName(), id);
        Lesson lesson = lessonService.getById(id);
        lessonService.delete(lesson);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
