package com.softserve.controller;


import com.softserve.dto.AddPeriodDTO;
import com.softserve.dto.MessageDTO;
import com.softserve.dto.PeriodDTO;
import com.softserve.entity.Period;
import com.softserve.service.PeriodService;
import com.softserve.service.mapper.PeriodMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Api(tags = "Class API")
@RequestMapping("/classes")
@Slf4j
public class PeriodController {

    private final PeriodService periodService;

    private final PeriodMapper periodMapper;

    @Autowired
    public PeriodController(PeriodService periodService, PeriodMapper periodMapper) {
        this.periodService = periodService;
        this.periodMapper = periodMapper;
    }

    @GetMapping
    @ApiOperation(value = "Get the list of all class")
    public ResponseEntity<List<PeriodDTO>> list() {
        log.info("Enter into list of PeriodController");
        return ResponseEntity.ok().body(periodMapper.convertToDtoList(periodService.getAll()));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get class info by id")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<PeriodDTO> get(@PathVariable("id") long id) {
        log.info("Enter into get of PeriodController with id {} ", id);
        Period period = periodService.getById(id);
        return ResponseEntity.ok().body(periodMapper.convertToDto(period));
    }

    @PostMapping
    @ApiOperation(value = "Create new class")
    public ResponseEntity<PeriodDTO> save(@RequestBody AddPeriodDTO addPeriodDTO) {
        log.info("Enter into save of PeriodController with addPeriodDTO: {}", addPeriodDTO);
        Period newPeriod = periodService.save(periodMapper.convertToEntity(addPeriodDTO));
        return ResponseEntity.ok().body(periodMapper.convertToDto(newPeriod));
    }
    @PostMapping("/all")
    @ApiOperation(value = "Create a list of classes")
    public ResponseEntity<MessageDTO> save(@RequestBody List<AddPeriodDTO> periods) {
        log.info("Enter into save of PeriodController with List of addPeriodDTO: {}", periods);
        periodService.save(periodMapper.convertToEntityList(periods));
        return ResponseEntity.ok().body(new MessageDTO("New periods have been saved"));
    }

    @PutMapping
    @ApiOperation(value = "Update existing class")
    public ResponseEntity<PeriodDTO> update(@RequestBody PeriodDTO periodDTO) {
        log.info("Enter into update of PeriodController with periodDTO: {}", periodDTO);
        Period newPeriod = periodService.update(periodMapper.convertToEntity(periodDTO));
        return ResponseEntity.ok().body(periodMapper.convertToDto(newPeriod));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete class by id")
    public ResponseEntity<MessageDTO> delete(@PathVariable("id") long id){
        log.info("Enter into delete of PeriodController with id: {}", id);
        periodService.delete(periodService.getById(id));
        return ResponseEntity.ok().body(new MessageDTO("Period has been deleted successfully."));
    }
}