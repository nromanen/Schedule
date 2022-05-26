package com.softserve.repository;

import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends BasicRepository<Room, Long> {

    /**
     * Returns all free rooms by specific period, day of week and number of week from database.
     *
     * @param idOfPeriod the id of the period
     * @param dayOfWeek  the day of the week
     * @param evenOdd    the type of the week
     * @return the list of rooms
     */
    List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, DayOfWeek dayOfWeek, EvenOdd evenOdd);

    /**
     * Returns all rooms that are not available.
     *
     * @param semesterId the id of the semester
     * @param dayOfWeek  the day of the week
     * @param evenOdd    the type of the week
     * @param classId    the id of the class
     * @return the list of not available rooms
     */
    List<Room> getNotAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);

    /**
     * Returns all available rooms.
     *
     * @param semesterId the id of the semester
     * @param dayOfWeek  the day of the week
     * @param evenOdd    the type of the week
     * @param classId    the id of the class
     * @return the list of available rooms
     */
    List<Room> getAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);

    /**
     * Returns the number of duplicates of given room.
     *
     * @param room the room entity that needs to be count
     * @return the number of duplicates of given room
     */
    Long countRoomDuplicates(Room room);

    /**
     * {@inheritDoc}
     */
    List<Room> getDisabled();

    /**
     * Returns all rooms from database ordered by sortOrder and title.
     *
     * @return the list of entities ordered by sortOrder and title
     */
    List<Room> getAllOrdered();

    /**
     * Returns max sorting order.
     *
     * @return an Optional describing the max sorting order
     */
    Optional<Double> getMaxSortOrder();

    /**
     * Returns min sorting order.
     *
     * @return an Optional describing the min sorting order
     */
    Optional<Double> getMinSortOrder();

    /**
     * Returns sorting order of the next element.
     *
     * @param position the sorting order of the element
     * @return an Optional describing sorting order of the next element
     */
    Optional<Double> getNextPosition(Double position);

    /**
     * Returns sorting order of the given room id.
     *
     * @param afterId the room id which sorting order needs to be retrieved
     * @return an Optional describing sorting order of the room
     */
    Optional<Double> getSortOrderAfterId(Long afterId);

}
