package com.softserve.controller;

import com.softserve.dto.RoomDTO;
import com.softserve.dto.AddRoomDTO;
import com.softserve.entity.Room;
import com.softserve.service.RoomService;
import com.softserve.service.mapper.RoomMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Api(tags = "Room API")
@RequestMapping("/rooms")
public class RoomController {

    final private RoomService roomService;
    private final RoomMapper roomMapper;

    @Autowired
    public RoomController(RoomService roomService, RoomMapper roomMapper) {
        this.roomService = roomService;
        this.roomMapper = roomMapper;
    }

    @GetMapping
    @ApiOperation(value = "Get the list of all rooms")
    public ResponseEntity<List<RoomDTO>> list() {
        List<Room> periods = roomService.getAll();
        return ResponseEntity.ok().body(periods.stream().map(roomMapper::convertToDto).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get room info by id")
    public ResponseEntity<RoomDTO> get(@PathVariable("id") long id) {
        Room room = roomService.getById(id).orElse(null);
        return ResponseEntity.ok().body(roomMapper.convertToDto(room));
    }

    @PostMapping
    @ApiOperation(value = "Create new room")
    public ResponseEntity<?> save(@RequestBody AddRoomDTO room) {
        long id = roomService.save(roomMapper.convertToEntity(room)).getId();
        return ResponseEntity.ok().body("New room has been saved with ID:" + id);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Update existing room by id")
    public ResponseEntity<?> update(@PathVariable("id") long id, @RequestBody RoomDTO room) {
        roomService.update(roomMapper.convertToEntity(room));
        return ResponseEntity.ok().body("Room has been updated successfully.");
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete room by id")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        roomService.delete(roomService.getById(id).orElse(null));
        return ResponseEntity.ok().body("Room has been deleted successfully.");
    }
}