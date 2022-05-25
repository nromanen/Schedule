package com.softserve.repository;

import com.softserve.entity.RoomType;

public interface RoomTypeRepository extends BasicRepository<RoomType, Long> {
    Long countRoomTypesWithDescription(String description);

    Long countByRoomTypeId(Long id);
}
