package com.softserve.repository;

import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends BasicRepository<Room, Long>  {
    List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, DayOfWeek dayOfWeek, EvenOdd evenOdd);
    List<Room> getNotAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);
    List<Room> getAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);

    Long countRoomDuplicates(Room room);
    List<Room> getDisabled();

    List<Room> getAllOrdered();
    Optional<Double> getMaxSortOrder();
    Optional<Double> getMinSortOrder();
    Optional<Double> getNextPosition(Double position);
    Optional<Double> getSortOrderAfterId(Long afterId);

}
