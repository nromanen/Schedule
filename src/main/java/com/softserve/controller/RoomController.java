package com.softserve.controller;

import com.softserve.dto.MessageDTO;
import com.softserve.dto.RoomDTO;
import com.softserve.dto.RoomForScheduleInfoDTO;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@Tag(name = "Room API")
@RequestMapping("/rooms")
@Slf4j
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    @Operation(summary = "Get the list of all rooms")
    public ResponseEntity<List<RoomDTO>> getAll() {
        log.info("Getting all rooms");
        return ResponseEntity.ok(roomService.getAll());
    }

    @GetMapping("/free")
    @Operation(summary = "Get the list of all free rooms by specific day and period")
    public ResponseEntity<List<RoomDTO>> getFreeRooms(
            @RequestParam Long semesterId,
            @RequestParam Long classId,
            @RequestParam DayOfWeek dayOfWeek,
            @RequestParam EvenOdd evenOdd) {
        log.info("Getting free rooms: semesterId={}, classId={}, dayOfWeek={}, evenOdd={}",
                semesterId, classId, dayOfWeek, evenOdd);
        return ResponseEntity.ok(roomService.getAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room info by id")
    public ResponseEntity<RoomDTO> getById(@PathVariable Long id) {
        log.info("Getting room by id: {}", id);
        return ResponseEntity.ok(roomService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Create new room")
    public ResponseEntity<RoomDTO> create(@RequestBody RoomDTO roomDTO) {
        log.info("Creating room: {}", roomDTO);
        RoomDTO created = roomService.save(roomDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping
    @Operation(summary = "Update existing room")
    public ResponseEntity<RoomDTO> update(@RequestBody RoomDTO roomDTO) {
        log.info("Updating room: {}", roomDTO);
        RoomDTO updated = roomService.update(roomDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete room by id")
    public ResponseEntity<MessageDTO> delete(@PathVariable Long id) {
        log.info("Deleting room by id: {}", id);
        roomService.deleteById(id);
        return ResponseEntity.ok(new MessageDTO("Room has been deleted successfully."));
    }

    @GetMapping("/disabled")
    @Operation(summary = "Get the list of disabled rooms")
    public ResponseEntity<List<RoomDTO>> getDisabled() {
        log.info("Getting disabled rooms");
        return ResponseEntity.ok(roomService.getDisabled());
    }

    @GetMapping("/available")
    @Operation(summary = "Get the list of all rooms (available/not available) with status")
    public ResponseEntity<List<RoomForScheduleInfoDTO>> getAllRoomsWithAvailability(
            @RequestParam Long semesterId,
            @RequestParam Long classId,
            @RequestParam DayOfWeek dayOfWeek,
            @RequestParam EvenOdd evenOdd) {
        log.info("Getting all rooms with availability status");
        return ResponseEntity.ok(roomService.getAllRoomsForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId));
    }

    @GetMapping("/ordered")
    @Operation(summary = "Get the list of all rooms sorted by order")
    public ResponseEntity<List<RoomDTO>> getAllOrdered() {
        log.info("Getting all rooms ordered");
        return ResponseEntity.ok(roomService.getAllOrdered());
    }

    @PostMapping("/after/{id}")
    @Operation(summary = "Create room after id")
    public ResponseEntity<RoomDTO> createAfterOrder(@PathVariable Long id, @RequestBody RoomDTO roomDTO) {
        log.info("Creating room after id: {}", id);
        RoomDTO created = roomService.createAfterOrder(roomDTO, id);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/after/{id}")
    @Operation(summary = "Update room order")
    public ResponseEntity<RoomDTO> updateAfterOrder(@PathVariable Long id, @RequestBody RoomDTO roomDTO) {
        log.info("Updating room order after id: {}", id);
        RoomDTO updated = roomService.updateAfterOrder(roomDTO, id);
        return ResponseEntity.ok(updated);
    }
}
