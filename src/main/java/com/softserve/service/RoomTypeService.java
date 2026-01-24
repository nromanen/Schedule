package com.softserve.service;

import com.softserve.dto.RoomTypeDTO;

import java.util.List;

public interface RoomTypeService {

    /**
     * Retrieves a room type by its ID.
     *
     * @param id the ID of the room type
     * @return the room type DTO
     * @throws com.softserve.exception.EntityNotFoundException if room type not found
     */
    RoomTypeDTO getById(Long id);

    /**
     * Returns all room types.
     *
     * @return the list of room type DTOs
     */
    List<RoomTypeDTO> getAll();

    /**
     * Saves a new room type.
     *
     * @param roomTypeDTO the room type DTO to save
     * @return the saved room type DTO
     * @throws com.softserve.exception.FieldAlreadyExistsException if room type with given description already exists
     */
    RoomTypeDTO save(RoomTypeDTO roomTypeDTO);

    /**
     * Updates an existing room type.
     *
     * @param roomTypeDTO the room type DTO to update
     * @return the updated room type DTO
     * @throws com.softserve.exception.EntityNotFoundException     if room type not found
     * @throws com.softserve.exception.FieldAlreadyExistsException if room type with given description already exists
     */
    RoomTypeDTO update(RoomTypeDTO roomTypeDTO);

    /**
     * Deletes a room type by its ID.
     *
     * @param id the ID of the room type to delete
     * @throws com.softserve.exception.EntityNotFoundException if room type not found
     */
    void deleteById(Long id);
}
