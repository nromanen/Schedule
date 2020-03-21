package com.softserve.controller;

import com.softserve.dto.MessageDTO;
import com.softserve.dto.RoomDTO;
import com.softserve.dto.AddRoomDTO;
import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;
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

    private final RoomService roomService;
    private final RoomMapper roomMapper;

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
    public ResponseEntity<RoomDTO> get(@PathVariable("id") long id){
        Room room = roomService.getById(id);
        return ResponseEntity.ok().body(roomMapper.convertToDto(room));
    }

    @PostMapping
    @ApiOperation(value = "Create new room")
    public ResponseEntity<RoomDTO> save(@RequestBody AddRoomDTO addRoomDTO) {
        Room newRoom = roomService.save(roomMapper.convertToEntity(addRoomDTO));
        return ResponseEntity.ok().body(roomMapper.convertToDto(newRoom));
    }

    @PutMapping
    @ApiOperation(value = "Update existing room")
    public ResponseEntity<RoomDTO> update(@RequestBody RoomDTO roomDTO) {
        Room newRoom = roomService.update(roomMapper.convertToEntity(roomDTO));
        return ResponseEntity.ok().body(roomMapper.convertToDto(newRoom));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete room by id")
    public ResponseEntity<MessageDTO> delete(@PathVariable("id") long id) {
        roomService.delete(roomService.getById(id));
        return ResponseEntity.ok().body(new MessageDTO("Room has been deleted successfully."));
    }
}