package com.softserve.service.mapper;

import com.softserve.dto.AddRoomDTO;
import com.softserve.dto.RoomDTO;
import com.softserve.entity.Room;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    Room convertToEntity(AddRoomDTO addRoomDTO);

    Room convertToEntity(RoomDTO dto);

    RoomDTO convertToDto(Room entity);
}
