package com.softserve.service.mapper;

import com.softserve.dto.RoomForScheduleInfoDTO;
import com.softserve.entity.Room;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomForScheduleInfoMapper {

    List<RoomForScheduleInfoDTO> toRoomForScheduleDTOList (List<Room> room);
}
