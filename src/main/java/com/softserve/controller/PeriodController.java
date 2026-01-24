package com.softserve.controller;

import com.softserve.dto.AddPeriodDTO;
import com.softserve.dto.MessageDTO;
import com.softserve.dto.PeriodDTO;
import com.softserve.service.PeriodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Class API")
@Slf4j
@RequiredArgsConstructor
public class PeriodController {

    private final PeriodService periodService;

    @GetMapping(path = {"/classes", "/public/classes"})
    @Operation(summary = "Get the list of all classes")
    public ResponseEntity<List<PeriodDTO>> getAll() {
        log.info("Getting all periods");
        return ResponseEntity.ok(periodService.getAll());
    }

    @GetMapping("/classes/{id}")
    @Operation(summary = "Get class info by id")
    public ResponseEntity<PeriodDTO> getById(@PathVariable Long id) {
        log.info("Getting period by id: {}", id);
        return ResponseEntity.ok(periodService.getById(id));
    }

    @PostMapping("/classes")
    @Operation(summary = "Create new class")
    public ResponseEntity<PeriodDTO> create(@RequestBody AddPeriodDTO addPeriodDTO) {
        log.info("Creating period: {}", addPeriodDTO);
        PeriodDTO created = periodService.save(addPeriodDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/classes/all")
    @Operation(summary = "Create a list of classes")
    public ResponseEntity<List<PeriodDTO>> createAll(@RequestBody List<AddPeriodDTO> periods) {
        log.info("Creating periods: {}", periods);
        List<PeriodDTO> created = periodService.saveAll(periods);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/classes")
    @Operation(summary = "Update existing class")
    public ResponseEntity<PeriodDTO> update(@RequestBody PeriodDTO periodDTO) {
        log.info("Updating period: {}", periodDTO);
        PeriodDTO updated = periodService.update(periodDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/classes/{id}")
    @Operation(summary = "Delete class by id")
    public ResponseEntity<MessageDTO> delete(@PathVariable Long id) {
        log.info("Deleting period by id: {}", id);
        periodService.deleteById(id);
        return ResponseEntity.ok(new MessageDTO("Period has been deleted successfully."));
    }
}
