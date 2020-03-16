package com.softserve.repository.impl;

import com.softserve.entity.Room;
import com.softserve.repository.RoomRepository;
import org.springframework.stereotype.Repository;

@Repository
public class RoomRepositoryImpl extends BasicRepositoryImpl<Room, Long> implements RoomRepository {
}
