package com.softserve.controller;

import com.softserve.dto.AddRoomDTO;
import com.softserve.dto.MessageDTO;
import com.softserve.dto.RoomDTO;
import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.service.RoomService;
import com.softserve.service.mapper.RoomMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Api(tags = "Room API")
@RequestMapping("/rooms")
@Slf4j
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
        log.info("Enter into list of RoomController");
        return ResponseEntity.ok().body(roomMapper.convertToDtoList(roomService.getAll()));
    }

    @GetMapping("/free")
    @ResponseStatus(HttpStatus.OK)
    @ApiOperation(value = "Get the list of all free rooms by specific day and period")
    public ResponseEntity<List<RoomDTO>> freeRoomList(@RequestParam(value = "id") Long id,
                                                      @RequestParam(value = "dayOfWeek") String dayOfWeek,
                                                      @RequestParam(value = "evenOdd", defaultValue = "WEEKLY")EvenOdd evenOdd
                                                      ) {
        log.info("Enter into freeRoomList of RoomController with id {}, dayOfWeek {} and evenOdd {} ", id, dayOfWeek, evenOdd);
        List<Room> rooms = roomService.freeRoomBySpecificPeriod(id, dayOfWeek, evenOdd);
        return ResponseEntity.ok().body(roomMapper.convertToDtoList(rooms));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "Get room info by id")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<RoomDTO> get(@PathVariable("id") long id){
        log.info("Enter into get of RoomController with id {} ", id);
        Room room = roomService.getById(id);
        return ResponseEntity.ok().body(roomMapper.convertToDto(room));
    }

    @PostMapping
    @ApiOperation(value = "Create new room")
    public ResponseEntity<RoomDTO> save(@RequestBody AddRoomDTO addRoomDTO) {
        log.info("Enter into save of RoomController with addRoomDTO: {}", addRoomDTO);
        Room newRoom = roomService.save(roomMapper.convertToEntity(addRoomDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(roomMapper.convertToDto(newRoom));
    }

    @PutMapping
    @ApiOperation(value = "Update existing room")
    public ResponseEntity<RoomDTO> update(@RequestBody RoomDTO roomDTO) {
        log.info("Enter into update of RoomController with roomDTO: {}", roomDTO);
        Room newRoom = roomService.update(roomMapper.convertToEntity(roomDTO));
        return ResponseEntity.ok().body(roomMapper.convertToDto(newRoom));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete room by id")
    public ResponseEntity<MessageDTO> delete(@PathVariable("id") long id) {
        log.info("Enter into delete of RoomController with id: {}", id);
        roomService.delete(roomService.getById(id));
        return ResponseEntity.ok().body(new MessageDTO("Room has been deleted successfully."));
    }

    @GetMapping("/types")
    @ApiOperation(value = "Get all room types")
    public ResponseEntity<List<String>> getAllUniqueRoomTypes(){
        return ResponseEntity.ok().body(roomService.allUniqueRoomTypes());
    }

}