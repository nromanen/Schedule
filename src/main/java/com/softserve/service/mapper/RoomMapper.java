package com.softserve.service.mapper;

import com.softserve.dto.RoomDTO;
import com.softserve.dto.AddRoomDTO;
import com.softserve.entity.Room;

public interface RoomMapper extends Mapper<Room, RoomDTO> {
    Room convertToEntity(AddRoomDTO addRoomDTO);
}
