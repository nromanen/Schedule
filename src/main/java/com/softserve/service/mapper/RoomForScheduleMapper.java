package com.softserve.service.mapper;

import com.softserve.dto.RoomForScheduleDTO;
import com.softserve.entity.Room;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomForScheduleMapper {

    List<RoomForScheduleDTO> toRoomForScheduleDTOList (List<Room> room);
}
