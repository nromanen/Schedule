package com.softserve.service.impl;

import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.RoomsException;
import com.softserve.repository.RoomRepository;
import com.softserve.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public Room getById(Long id) {
        return roomRepository.findById(id).orElseThrow(
                () -> new RoomsException("room doesn't exist")
        );
    }

    @Override
    public List<Room> getAll() {
        return roomRepository.getAll();
    }

    @Override
    public Room save(Room object) {
        return roomRepository.save(object);
    }

    @Override
    public Room update(Room object) {
        return roomRepository.save(object);
    }

    @Override
    public Room delete(Room object) {
        return roomRepository.delete(object);
    }

    @Override
    public List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, String dayOfWeek, EvenOdd evenOdd) {
        return roomRepository.freeRoomBySpecificPeriod(idOfPeriod, dayOfWeek, evenOdd);
    }
}
