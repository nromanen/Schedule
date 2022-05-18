package com.softserve.repository;

import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends BasicRepository<Room, Long> {

    /**
     * The method used for getting list of free room by specific period, day of week and number of week from database
     *
     * @param idOfPeriod identity number of period
     * @param dayOfWeek  day of the week
     * @param evenOdd    number of week
     * @return list of rooms
     */
    List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, DayOfWeek dayOfWeek, EvenOdd evenOdd);

    List<Room> getNotAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);

    List<Room> getAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);

    Long countRoomDuplicates(Room room);

    List<Room> getDisabled();

    /**
     * The method used for getting list of entities from database
     *
     * @return list of entities ordered by sortOrder and title
     */
    List<Room> getAllOrdered();

    /**
     * This method for getting max sort_order form database
     *
     * @return max sorting order
     */
    Optional<Double> getMaxSortOrder();

    /**
     * This method for getting min sort_order form database
     *
     * @return min sorting order
     */
    Optional<Double> getMinSortOrder();

    /**
     * This method for getting sorting order of the next element
     *
     * @param position sorting order of the element
     * @return sorting order of the nex element
     */
    Optional<Double> getNextPosition(Double position);

    /**
     * This method for retrieving sorting order by rooms id
     *
     * @param afterId rooms id which sorting order needs to be retrieved
     * @return sorting order of the room
     */
    Optional<Double> getSortOrderAfterId(Long afterId);

}
