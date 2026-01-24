package com.softserve.repository;

import com.softserve.entity.RoomType;

public interface RoomTypeRepository extends BasicRepository<RoomType, Long> {

    /**
     * Counts the number of room types with given description.
     *
     * @param description the string represent description of room type
     * @return the number of room types with given description
     */
    Long countRoomTypesWithDescription(String description);

    /**
     * Counts the number of room types with given description, ignoring the specified id.
     *
     * @param id          the id to ignore
     * @param description the string represent description of room type
     * @return the number of room types with given description excluding the specified id
     */
    Long countRoomTypesWithDescriptionAndIgnoreId(Long id, String description);

    /**
     * Counts the number of room types with given id.
     *
     * @param id the id of the room type
     * @return the number of room types with given id
     */
    Long countByRoomTypeId(Long id);
}
