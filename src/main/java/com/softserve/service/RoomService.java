package com.softserve.service;

import com.softserve.dto.RoomForScheduleInfoDTO;
import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;
import java.util.List;

public interface RoomService extends BasicService<Room, Long> {

    /**
     * The method used for getting list of free room by specific period, day of week and number of week
     *
     * @param idOfPeriod identity number of period
     * @param dayOfWeek  day of the week
     * @param evenOdd    number of week
     * @return list of rooms
     */
    List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, DayOfWeek dayOfWeek, EvenOdd evenOdd);

    List<Room> getNotAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);

    List<Room> getAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);

    List<RoomForScheduleInfoDTO> getAllRoomsForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);

    boolean isRoomExists(Room room);

    /**
     * The method used for getting all rooms
     *
     * @return list of rooms
     */
    List<Room> getDisabled();

    /**
     * The method used for getting list of rooms ordered by sort_order
     *
     * @return list of rooms
     */
    List<Room> getAllOrdered();

    /**
     * The method used for saving room after specific one
     *
     * @param room    Room entity that we want to save
     * @param afterId id of room after which we want to insert our room
     * @return room
     */
    Room saveRoomAfterId(Room room, Long afterId);

    /**
     * The method used for updating room after specific one
     *
     * @param room    Room entity that we want to save
     * @param afterId id of room after which we want to insert our room
     * @return room
     */
    Room updateRoomAfterId(Room room, Long afterId);
}
