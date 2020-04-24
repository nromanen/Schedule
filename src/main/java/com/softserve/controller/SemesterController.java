package com.softserve.controller;

import com.softserve.dto.SemesterDTO;
import com.softserve.entity.Semester;
import com.softserve.service.SemesterService;
import com.softserve.mapper.SemesterMapper;
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
@RequestMapping("/semesters")
@Slf4j
public class SemesterController {

    private final SemesterService semesterService;
    private final SemesterMapper semesterMapper;

    @Autowired
    public SemesterController(SemesterService semesterService, SemesterMapper semesterMapper) {
        this.semesterService = semesterService;
        this.semesterMapper = semesterMapper;
    }

    @GetMapping
    @ApiOperation(value = "Get the list of all semesters")
    public ResponseEntity<List<SemesterDTO>> list() {
        log.info("In list ()");
        List<Semester> semesters = semesterService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(semesterMapper.semestersToSemesterDTOs(semesters));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get semester info by id")
    public ResponseEntity<SemesterDTO> get(@PathVariable("id") long id){
        log.info("In get(id = [{}])", id);
        Semester semester = semesterService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(semesterMapper.semesterToSemesterDTO(semester));
    }

    @PostMapping
    @ApiOperation(value = "Create new semester")
    public ResponseEntity<SemesterDTO> save(@RequestBody SemesterDTO semesterDTO) {
        log.info("In save (semesterDTO = [{}])", semesterDTO);
        Semester semester = semesterService.save(semesterMapper.semesterDTOToSemester(semesterDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(semesterMapper.semesterToSemesterDTO(semester));
    }

    @PutMapping()
    @ApiOperation(value = "Update existing semester by id")
    public ResponseEntity<SemesterDTO> update(@RequestBody SemesterDTO semesterDTO) {
        log.info("In update (semesterDTO = [{}])", semesterDTO);
        semesterService.getById(semesterDTO.getId());
        Semester semester = semesterService.update(semesterMapper.semesterDTOToSemester(semesterDTO));
        return ResponseEntity.status(HttpStatus.OK).body(semesterMapper.semesterToSemesterDTO(semester));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete semester by id")
    public ResponseEntity delete(@PathVariable("id") long id){
        log.info("In delete (id =[{}]", id);
        Semester semester = semesterService.getById(id);
        semesterService.delete(semester);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
