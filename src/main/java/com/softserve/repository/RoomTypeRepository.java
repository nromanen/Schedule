package com.softserve.repository;

import com.softserve.entity.RoomType;

public interface RoomTypeRepository extends BasicRepository<RoomType, Long> {

    /**
     * The method used for getting number of RoomTypes with description from database
     *
     * @param description String description used to find RoomType
     * @return Long number of records with description
     */
    Long countRoomTypesWithDescription(String description);

    /**
     * Method used to verify if RoomType with such id exists
     *
     * @param id of the RoomType
     * @return 0 if there is no RoomType with such id, 1 if record with id exists
     */
    Long countByRoomTypeId(Long id);
}
