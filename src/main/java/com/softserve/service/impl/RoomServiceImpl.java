package com.softserve.service.impl;

import com.softserve.dto.RoomForScheduleInfoDTO;
import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.mapper.RoomForScheduleInfoMapper;
import com.softserve.repository.RoomRepository;
import com.softserve.service.RoomService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.List;

@Transactional
@Service
@Slf4j
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomForScheduleInfoMapper roomForScheduleInfoMapper;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository, RoomForScheduleInfoMapper roomForScheduleInfoMapper) {
        this.roomRepository = roomRepository;
        this.roomForScheduleInfoMapper = roomForScheduleInfoMapper;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Room getById(Long id) {
        log.info("Enter into getById of RoomServiceImpl with id {}", id);
        return roomRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Room.class, "id", id.toString())
        );
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Room> getAll() {
        log.info("Enter into getAll of RoomServiceImpl");
        return roomRepository.getAll();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Room> getDisabled() {
        log.info("Enter into getAll of getDisabled");
        return roomRepository.getDisabled();
    }

    /**
     * {@inheritDoc}
     *
     * @throws EntityAlreadyExistsException if given room already exists
     */
    @Override
    public Room save(Room object) {
        log.info("Enter into save of RoomServiceImpl with entity:{}", object);
        if (isRoomExists(object)) {
            throw new EntityAlreadyExistsException("Room with this parameters already exists");
        } else {
            return roomRepository.save(object);
        }
    }

    /**
     * {@inheritDoc}
     *
     * @throws EntityAlreadyExistsException if there is already another room with parameters as in the given room
     */
    @Override
    public Room update(Room object) {
        log.info("Enter into update of RoomServiceImpl with entity:{}", object);
        if (isRoomExists(object)) {
            throw new EntityAlreadyExistsException("Room with this parameters already exists");
        } else {
            return roomRepository.update(object);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Room delete(Room object) {
        log.info("Enter into delete of RoomServiceImpl with entity:{}", object);
        return roomRepository.delete(object);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, DayOfWeek dayOfWeek, EvenOdd evenOdd) {
        log.info("Enter into freeRoomBySpecificPeriod of RoomServiceImpl with id {}, dayOfWeek {} and evenOdd {} ",
                idOfPeriod, dayOfWeek, evenOdd);
        return roomRepository.freeRoomBySpecificPeriod(idOfPeriod, dayOfWeek, evenOdd);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Room> getNotAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        return roomRepository.getNotAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Room> getAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        return roomRepository.getAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<RoomForScheduleInfoDTO> getAllRoomsForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        List<RoomForScheduleInfoDTO> rooms = roomForScheduleInfoMapper.toRoomForScheduleDTOList(
                getAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId));
        rooms.forEach(roomForScheduleDTO -> roomForScheduleDTO.setAvailable(true));
        rooms.addAll(roomForScheduleInfoMapper.toRoomForScheduleDTOList(getNotAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId)));
        return rooms;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean isRoomExists(Room room) {
        return roomRepository.countRoomDuplicates(room) != 0;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Room> getAllOrdered() {
        log.info("Entered getAllOrdered()");
        return roomRepository.getAllOrdered();
    }

    /**
     * {@inheritDoc}
     */
    @Transactional
    @Override
    public Room saveRoomAfterId(Room room, Long afterId) {
        log.info("Entered saveRoomAfterId({},{})", room, afterId);
        Double maxOrder = roomRepository.getMaxSortOrder().orElse(0.0);
        Double minOrder = roomRepository.getMinSortOrder().orElse(0.0);
        if (afterId != null) {
            if (afterId == 0) {
                room.setSortOrder(minOrder / 2);
            } else {
                Double prevPos = roomRepository.getSortOrderAfterId(afterId).orElse(0.0);
                Double nextPos = roomRepository.getNextPosition(prevPos).orElse(prevPos + 2);
                Double newPos = ((nextPos + prevPos) / 2);
                room.setSortOrder(newPos);
            }
        } else {
            room.setSortOrder(maxOrder + 1);
        }
        return roomRepository.save(room);
    }

    /**
     * {@inheritDoc}
     */
    @Transactional
    @Override
    public Room updateRoomAfterId(Room room, Long afterId) {
        log.info("Entered updateRoomAfterId({},{})", room, afterId);
        Double minOrder = roomRepository.getMinSortOrder().orElse(0.0);
        if (afterId != null) {
            if (afterId == room.getId()) {
                Double myOrder = roomRepository.getSortOrderAfterId(afterId).orElse(0.0);
                room.setSortOrder(myOrder);
            } else if (afterId == 0) {
                room.setSortOrder(minOrder / 2);
            } else {
                Double prevPos = roomRepository.getSortOrderAfterId(afterId).orElse(0.0);
                Double nextPos = roomRepository.getNextPosition(prevPos).orElse(prevPos + 2);
                Double newPos = ((nextPos + prevPos) / 2);
                room.setSortOrder(newPos);
            }
        } else {
            room.setSortOrder(1.0);
        }
        return roomRepository.update(room);
    }

}
