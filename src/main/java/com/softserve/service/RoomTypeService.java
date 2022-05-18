package com.softserve.service;

import com.softserve.entity.RoomType;

public interface RoomTypeService extends BasicService<RoomType, Long> {

    /**
     * Method finds if RoomType with description already exists
     *
     * @param description
     * @return true if RoomType with such description already exist
     */
    boolean isRoomTypeExistsWithDescription(String description);

    /**
     * Method verifies if RoomType with id param exist in repository
     *
     * @param id
     * @return true if RoomType with id param exist
     */
    boolean isExistsWithId(Long id);
}
