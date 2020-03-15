package com.softserve.controller;


import com.softserve.dto.PeriodDTO;
import com.softserve.dto.SimplePeriodDTO;
import com.softserve.entity.Period;
import com.softserve.service.PeriodService;
import com.softserve.service.mapper.PeriodMapper;
import com.softserve.service.mapper.impl.PeriodMapperImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Api(tags = "Period API")
@RequestMapping("/periods")
public class PeriodController {

    final private PeriodService periodService;
    private final PeriodMapper periodMapper;

    @Autowired
    public PeriodController(PeriodService periodService, PeriodMapperImpl periodMapper) {
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
    public ResponseEntity<PeriodDTO> get(@PathVariable("id") long id) {
        Period period = periodService.getById(id).orElse(null);
        return ResponseEntity.ok().body(periodMapper.convertToDto(period));
    }

    @PostMapping
    @ApiOperation(value = "Create new period")
    public ResponseEntity<?> save(@RequestBody SimplePeriodDTO period) {
        long id = periodService.save(periodMapper.convertToEntity(period)).getId();
        return ResponseEntity.ok().body("New period has been saved with ID:" + id);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Update existing period by id")
    public ResponseEntity<?> update(@PathVariable("id") long id, @RequestBody PeriodDTO period) {
        periodService.update(periodMapper.convertToEntity(period));
        return ResponseEntity.ok().body("Period has been updated successfully.");
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete period by id")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        periodService.delete(periodService.getById(id).orElse(null));
        return ResponseEntity.ok().body("Period has been deleted successfully.");
    }
}