package com.softserve.controller;

import com.softserve.dto.RoomTypeDTO;
import com.softserve.service.RoomTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Room Type API")
@RequestMapping("/room-types")
@Slf4j
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @GetMapping
    @Operation(summary = "Get the list of all room types")
    public ResponseEntity<List<RoomTypeDTO>> getAll() {
        log.info("Getting all room types");
        return ResponseEntity.ok(roomTypeService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room type info by id")
    public ResponseEntity<RoomTypeDTO> getById(@PathVariable Long id) {
        log.info("Getting room type by id: {}", id);
        return ResponseEntity.ok(roomTypeService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Create new room type")
    public ResponseEntity<RoomTypeDTO> create(@RequestBody RoomTypeDTO roomTypeDTO) {
        log.info("Creating room type: {}", roomTypeDTO);
        RoomTypeDTO created = roomTypeService.save(roomTypeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping
    @Operation(summary = "Update existing room type by id")
    public ResponseEntity<RoomTypeDTO> update(@RequestBody RoomTypeDTO roomTypeDTO) {
        log.info("Updating room type: {}", roomTypeDTO);
        RoomTypeDTO updated = roomTypeService.update(roomTypeDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete room type by id")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("Deleting room type by id: {}", id);
        roomTypeService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
