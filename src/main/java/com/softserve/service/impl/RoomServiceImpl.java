package com.softserve.service.impl;

import com.softserve.dto.RoomDTO;
import com.softserve.dto.RoomForScheduleInfoDTO;
import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.mapper.RoomForScheduleInfoMapper;
import com.softserve.mapper.RoomMapper;
import com.softserve.repository.RoomRepository;
import com.softserve.repository.SortOrderRepository;
import com.softserve.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final RoomForScheduleInfoMapper roomForScheduleInfoMapper;
    private final SortOrderRepository<Room> sortOrderRepository;

    @jakarta.annotation.PostConstruct
    public void init() {
        sortOrderRepository.settClass(Room.class);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomDTO getById(Long id) {
        log.info("Getting room by id: {}", id);
        Room room = findRoomById(id);
        return roomMapper.convertToDto(room);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getAll() {
        log.info("Getting all rooms");
        return roomMapper.convertToDtoList(roomRepository.getAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getDisabled() {
        log.info("Getting disabled rooms");
        return roomMapper.convertToDtoList(roomRepository.getDisabled());
    }

    @Override
    public RoomDTO save(RoomDTO roomDTO) {
        log.info("Saving room: {}", roomDTO);

        Room room = roomMapper.convertToEntity(roomDTO);
        validateRoomUniqueness(room);

        room.setSortOrder(roomRepository.getLastSortOrder().orElse(0) + 1);
        Room saved = roomRepository.save(room);
        return roomMapper.convertToDto(saved);
    }

    @Override
    public RoomDTO update(RoomDTO roomDTO) {
        log.info("Updating room: {}", roomDTO);

        Room room = roomMapper.convertToEntity(roomDTO);
        validateRoomUniqueness(room);

        room.setSortOrder(sortOrderRepository.getSortOrderById(room.getId()).orElse(null));
        Room updated = roomRepository.update(room);
        return roomMapper.convertToDto(updated);
    }

    @Override
    public RoomDTO deleteById(Long id) {
        log.info("Deleting room by id: {}", id);

        Room room = findRoomById(id);
        Room deleted = roomRepository.delete(room);
        roomRepository.shiftSortOrderRange(deleted.getSortOrder() + 1, null, RoomRepository.Direction.UP);
        return roomMapper.convertToDto(deleted);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> freeRoomBySpecificPeriod(Long idOfPeriod, DayOfWeek dayOfWeek, EvenOdd evenOdd) {
        log.info("Getting free rooms by period: {}, day: {}, evenOdd: {}", idOfPeriod, dayOfWeek, evenOdd);
        List<Room> rooms = roomRepository.freeRoomBySpecificPeriod(idOfPeriod, dayOfWeek, evenOdd);
        return roomMapper.convertToDtoList(rooms);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getNotAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        log.info("Getting not available rooms for schedule");
        List<Room> rooms = roomRepository.getNotAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId);
        return roomMapper.convertToDtoList(rooms);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        log.info("Getting available rooms for schedule");
        List<Room> rooms = roomRepository.getAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId);
        return roomMapper.convertToDtoList(rooms);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomForScheduleInfoDTO> getAllRoomsForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        log.info("Getting all rooms for creating schedule");

        List<Room> availableRooms = roomRepository.getAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId);
        List<Room> notAvailableRooms = roomRepository.getNotAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId);

        List<RoomForScheduleInfoDTO> result = roomForScheduleInfoMapper.toRoomForScheduleDTOList(availableRooms);
        result.forEach(room -> room.setAvailable(true));
        result.addAll(roomForScheduleInfoMapper.toRoomForScheduleDTOList(notAvailableRooms));

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getAllOrdered() {
        log.info("Getting all rooms ordered");
        return roomMapper.convertToDtoList(roomRepository.getAllOrdered());
    }

    @Override
    public RoomDTO createAfterOrder(RoomDTO roomDTO, Long afterId) {
        log.info("Creating room after id: {}", afterId);

        Room room = roomMapper.convertToEntity(roomDTO);
        Room saved = sortOrderRepository.createAfterOrder(room, afterId);
        return roomMapper.convertToDto(saved);
    }

    @Override
    public RoomDTO updateAfterOrder(RoomDTO roomDTO, Long afterId) {
        log.info("Updating room order after id: {}", afterId);

        Room room = roomMapper.convertToEntity(roomDTO);
        Room updated = sortOrderRepository.updateAfterOrder(room, afterId);
        return roomMapper.convertToDto(updated);
    }

    // ==================== Private Helper Methods ====================

    private Room findRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Room.class, "id", id.toString()));
    }

    private void validateRoomUniqueness(Room room) {
        if (roomRepository.countRoomDuplicates(room) != 0) {
            throw new EntityAlreadyExistsException("Room with these parameters already exists");
        }
    }
}
