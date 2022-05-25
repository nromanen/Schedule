package com.softserve.service;

import com.softserve.entity.RoomType;

public interface RoomTypeService extends BasicService<RoomType, Long> {
    boolean isRoomTypeExistsWithDescription(String description);

    boolean isExistsWithId(Long id);
}
