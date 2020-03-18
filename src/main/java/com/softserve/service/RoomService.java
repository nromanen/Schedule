package com.softserve.service;

import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;

import java.util.List;

public interface RoomService extends BasicService<Room, Long>  {
    List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, String dayOfWeek, EvenOdd evenOdd);
}
