package com.softserve.controller;

import com.softserve.dto.RoomTypeDTO;
import com.softserve.entity.RoomType;
import com.softserve.mapper.RoomTypeMapper;
import com.softserve.service.RoomTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Room Type API")
@RequestMapping("/room-types")
@Slf4j
public class RoomTypeController {

    private final RoomTypeService roomTypeService;
    private final RoomTypeMapper roomTypeMapper;

    @Autowired
    public RoomTypeController(RoomTypeService roomTypeService, RoomTypeMapper roomTypeMapper) {
        this.roomTypeService = roomTypeService;
        this.roomTypeMapper = roomTypeMapper;
    }

    @GetMapping
    @Operation(summary = "Get the list of all room types")
    public ResponseEntity<List<RoomTypeDTO>> list() {
        log.info("In list ()");
        List<RoomType> roomTypes = roomTypeService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(roomTypeMapper.roomTypesToRoomTypeDTOs(roomTypes));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room type info by id")
    public ResponseEntity<RoomTypeDTO> get(@PathVariable("id") long id) {
        log.info("In get(id = [{}])", id);
        RoomType roomType = roomTypeService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(roomTypeMapper.roomTypeToRoomTypeDTO(roomType));
    }

    @PostMapping
    @Operation(summary = "Create new room type")
    public ResponseEntity<RoomTypeDTO> save(@RequestBody RoomTypeDTO roomTypeDTO) {
        log.info("In save (roomTypeDTO = [{}])", roomTypeDTO);
        RoomType roomType = roomTypeService.save(roomTypeMapper.roomTypeDTOTRoomType(roomTypeDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(roomTypeMapper.roomTypeToRoomTypeDTO(roomType));
    }

    @PutMapping
    @Operation(summary = "Update existing room type by id")
    public ResponseEntity<RoomTypeDTO> update(@RequestBody RoomTypeDTO roomTypeDTO) {
        log.info("In update (roomTypeDTO = [{}])", roomTypeDTO);
        RoomType roomType = roomTypeService.update(roomTypeMapper.roomTypeDTOTRoomType(roomTypeDTO));
        return ResponseEntity.status(HttpStatus.OK).body(roomTypeMapper.roomTypeToRoomTypeDTO(roomType));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete room type by id")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) {
        log.info("In delete (id =[{}]", id);
        RoomType roomType = roomTypeService.getById(id);
        roomTypeService.delete(roomType);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
