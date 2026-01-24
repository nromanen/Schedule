package com.softserve.service;

import com.softserve.dto.RoomDTO;
import com.softserve.dto.RoomForScheduleInfoDTO;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;
import java.util.List;

public interface RoomService extends SortService<RoomDTO> {

    /**
     * Retrieves a room by its ID.
     *
     * @param id the ID of the room
     * @return the room DTO
     * @throws com.softserve.exception.EntityNotFoundException if room not found
     */
    RoomDTO getById(Long id);

    /**
     * Returns all rooms.
     *
     * @return the list of room DTOs
     */
    List<RoomDTO> getAll();

    /**
     * Returns all disabled rooms.
     *
     * @return the list of disabled room DTOs
     */
    List<RoomDTO> getDisabled();

    /**
     * Saves a new room.
     *
     * @param roomDTO the room DTO to save
     * @return the saved room DTO
     * @throws com.softserve.exception.EntityAlreadyExistsException if room with these parameters already exists
     */
    RoomDTO save(RoomDTO roomDTO);

    /**
     * Updates an existing room.
     *
     * @param roomDTO the room DTO to update
     * @return the updated room DTO
     * @throws com.softserve.exception.EntityAlreadyExistsException if room with these parameters already exists
     */
    RoomDTO update(RoomDTO roomDTO);

    /**
     * Deletes a room by its ID.
     *
     * @param id the ID of the room to delete
     * @return the deleted room DTO
     * @throws com.softserve.exception.EntityNotFoundException if room not found
     */
    RoomDTO deleteById(Long id);

    /**
     * Returns all free rooms by the given day of the week, period and type of the week.
     *
     * @param idOfPeriod the id of the period
     * @param dayOfWeek  the day of the week
     * @param evenOdd    the type of the week
     * @return the list of free room DTOs
     */
    List<RoomDTO> freeRoomBySpecificPeriod(Long idOfPeriod, DayOfWeek dayOfWeek, EvenOdd evenOdd);

    /**
     * Returns all not available rooms by given semester id, day of the week, type of the week and class id.
     *
     * @param semesterId the id of the semester
     * @param dayOfWeek  the day of the week
     * @param evenOdd    the type of the week
     * @param classId    the id of the class
     * @return the list of not available room DTOs
     */
    List<RoomDTO> getNotAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);

    /**
     * Returns all available rooms by given semester id, day of the week, type of the week and class id.
     *
     * @param semesterId the id of the semester
     * @param dayOfWeek  the day of the week
     * @param evenOdd    the type of the week
     * @param classId    the id of the class
     * @return the list of available room DTOs
     */
    List<RoomDTO> getAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);

    /**
     * Returns all rooms with availability status by given semester id, day of the week, type of the week and class id.
     *
     * @param semesterId the id of the semester
     * @param dayOfWeek  the day of the week
     * @param evenOdd    the type of the week
     * @param classId    the id of the class
     * @return the list of rooms with availability info
     */
    List<RoomForScheduleInfoDTO> getAllRoomsForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);

    /**
     * Returns all rooms ordered by sortOrder.
     *
     * @return the list of room DTOs ordered by sortOrder
     */
    List<RoomDTO> getAllOrdered();
}
