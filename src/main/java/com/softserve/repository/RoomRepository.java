package com.softserve.repository;

import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;

import java.util.List;

public interface RoomRepository extends BasicRepository<Room, Long>  {

    List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, String dayOfWeek, EvenOdd evenOdd);
}
