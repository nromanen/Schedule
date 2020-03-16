package com.softserve.service.mapper.impl;

import com.softserve.dto.RoomDTO;
import com.softserve.dto.AddRoomDTO;
import com.softserve.entity.Room;
import com.softserve.service.mapper.RoomMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class RoomMapperImpl implements RoomMapper {

    ModelMapper modelMapper;

    @Autowired
    public RoomMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public Room convertToEntity(AddRoomDTO addRoomDTO) {
        return Objects.isNull(addRoomDTO) ? null : modelMapper.map(addRoomDTO, Room.class);
    }

    @Override
    public Room convertToEntity(RoomDTO dto) {
        return Objects.isNull(dto) ? null : modelMapper.map(dto, Room.class);
    }

    @Override
    public RoomDTO convertToDto(Room entity) {
        return Objects.isNull(entity) ? null : modelMapper.map(entity, RoomDTO.class);
    }
}
