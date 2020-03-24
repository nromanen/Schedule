package com.softserve.controller;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.SubjectDTO;
import com.softserve.entity.Room;
import com.softserve.entity.Subject;
import com.softserve.service.SubjectService;
import com.softserve.service.mapper.SubjectMapper;
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
@Api(tags = "Subject API")
@RequestMapping("/subjects")
@Slf4j
public class SubjectController {
    private final SubjectService subjectService;
    private final SubjectMapper subjectMapper;

    @Autowired
    public SubjectController(SubjectService subjectService, SubjectMapper subjectMapper) {
        this.subjectService = subjectService;
        this.subjectMapper = subjectMapper;
    }

    @GetMapping
    @ApiOperation(value = "Get the list of all subjects")
    public ResponseEntity<List<SubjectDTO>> list() {
        log.info("Enter into list method of {}", getClass().getName());
        List<Subject> subjects = subjectService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(subjectMapper.subjectsToSubjectDTOs(subjects));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get subject info by id")
    public ResponseEntity<SubjectDTO> get(@PathVariable("id") long id){
        log.info("Enter into get method of {} with id {} ", getClass().getName(), id);
        Subject subject = subjectService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(subjectMapper.subjectToSubjectDTO(subject));
    }

    @PostMapping
    @ApiOperation(value = "Create new subject")
    public ResponseEntity<SubjectDTO> save(@RequestBody SubjectDTO subjectDTO) {
        log.info("Enter into save method of {} with subjectDTO: {}", getClass().getName(), subjectDTO);
        Subject subject = subjectService.save(subjectMapper.subjectDTOToSubject(subjectDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectMapper.subjectToSubjectDTO(subject));
    }

    @PutMapping
    @ApiOperation(value = "Update existing subject by id")
    public ResponseEntity<SubjectDTO> update(@RequestBody SubjectDTO subjectDTO) {
        log.info("Enter into update method of {} with subjectDTO: {}", getClass().getName(), subjectDTO);
        Subject subject = subjectService.update(subjectMapper.subjectDTOToSubject(subjectDTO));
        return ResponseEntity.status(HttpStatus.OK).body(subjectMapper.subjectToSubjectDTO(subject));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete subject by id")
    public ResponseEntity<?> delete(@PathVariable("id") long id){
        log.info("Enter into delete method of {} with  subject id: {}", getClass().getName(), id);
        Subject subject = subjectService.getById(id);
        subjectService.delete(subject);
        return ResponseEntity.status(HttpStatus.OK).build();

    }
}
