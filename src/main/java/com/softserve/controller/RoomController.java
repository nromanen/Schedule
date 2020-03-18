package com.softserve.controller;

import com.softserve.dto.RoomDTO;
import com.softserve.dto.AddRoomDTO;
import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.DeleteEntityException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.service.RoomService;
import com.softserve.service.mapper.RoomMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Api(tags = "Room API")
@RequestMapping("/rooms")
public class RoomController {

    final private RoomService roomService;
    final private RoomMapper roomMapper;

    @Autowired
    public RoomController(RoomService roomService, RoomMapper roomMapper) {
        this.roomService = roomService;
        this.roomMapper = roomMapper;
    }

    @GetMapping
    @ApiOperation(value = "Get the list of all rooms")
    public ResponseEntity<List<RoomDTO>> list() {
        List<Room> rooms = roomService.getAll();
        return ResponseEntity.ok().body(rooms.stream().map(roomMapper::convertToDto).collect(Collectors.toList()));
    }

    @GetMapping("/free")
    @ResponseStatus(HttpStatus.OK)
    @ApiOperation(value = "Get the list of all free rooms by specific day and period")
    public ResponseEntity<List<RoomDTO>> freeRoomList(@RequestParam(value = "id") Long id,
                                                      @RequestParam(value = "dayOfWeek") String dayOfWeek,
                                                      @RequestParam(value = "evenOdd", defaultValue = "WEEKLY")EvenOdd evenOdd
                                                      ) {
        List<Room> rooms = roomService.freeRoomBySpecificPeriod(id, dayOfWeek, evenOdd);
        return ResponseEntity.ok().body(rooms.stream().map(roomMapper::convertToDto).collect(Collectors.toList()));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "Get room info by id")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<RoomDTO> get(@PathVariable("id") long id) throws EntityNotFoundException {
        Room room = roomService.getById(id).orElseThrow(
                () -> new EntityNotFoundException("this room doesn't exist"));;
        return ResponseEntity.ok().body(roomMapper.convertToDto(room));
    }

    @PostMapping
    @ApiOperation(value = "Create new room")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> save(@RequestBody AddRoomDTO room) {
        long id = roomService.save(roomMapper.convertToEntity(room)).getId();
        return ResponseEntity.status(HttpStatus.CREATED).body("New room has been saved with ID:" + id);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Update existing room by id")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> update(@PathVariable("id") long id, @RequestBody RoomDTO room) {
        roomService.update(roomMapper.convertToEntity(room));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Room has been updated successfully.");
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete room by id")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> delete(@PathVariable("id") long id) throws DeleteEntityException {
        roomService.delete(roomService.getById(id).orElseThrow(
                () -> new DeleteEntityException("This room has already connected with schedule and can't be deleted "))
        );
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Room has been deleted successfully.");
    }
}