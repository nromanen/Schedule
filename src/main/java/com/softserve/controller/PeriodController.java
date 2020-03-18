package com.softserve.controller;


import com.softserve.dto.PeriodDTO;
import com.softserve.dto.AddPeriodDTO;
import com.softserve.entity.Period;
import com.softserve.service.PeriodService;
import com.softserve.service.mapper.PeriodMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Api(tags = "Period API")
@RequestMapping("/periods")
public class PeriodController {

    private final PeriodService periodService;

    private final PeriodMapper periodMapper;

    @Autowired
    public PeriodController(PeriodService periodService, PeriodMapper periodMapper) {
        this.periodService = periodService;
        this.periodMapper = periodMapper;
    }

    @GetMapping
    @ApiOperation(value = "Get the list of all periods")
    public ResponseEntity<List<PeriodDTO>> list() {
        List<Period> periods = periodService.getAll();
        return ResponseEntity.ok().body(periods.stream().map(periodMapper::convertToDto).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get period info by id")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<PeriodDTO> get(@PathVariable("id") long id) {
        Period period = periodService.getById(id);
        return ResponseEntity.ok().body(periodMapper.convertToDto(period));
    }

    @PostMapping
    @ApiOperation(value = "Create new period")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> save(@RequestBody AddPeriodDTO period) {
        long id = periodService.save(periodMapper.convertToEntity(period)).getId();
        return ResponseEntity.status(HttpStatus.CREATED).body("New period has been saved with ID:" + id);
    }

    @PostMapping("/all")
    @ApiOperation(value = "Create a list of periods")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> save(@RequestBody List<AddPeriodDTO> periods) {
        periodService.save(periods.stream().map(periodMapper::convertToEntity).collect(Collectors.toList()));
        return ResponseEntity.status(HttpStatus.CREATED).body("New periods have been saved");
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Update existing period by id")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> update(@PathVariable("id") long id, @RequestBody PeriodDTO period) {
        periodService.update(periodMapper.convertToEntity(period));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Period has been updated successfully.");
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @ApiOperation(value = "Delete period by id")
    public ResponseEntity<?> delete(@PathVariable("id") long id){
        periodService.delete(periodService.getById(id));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Period has been deleted successfully.");
    }
}