package com.softserve.service;

import com.softserve.dto.RoomDTO;
import com.softserve.dto.RoomTypeDTO;
import com.softserve.entity.Room;
import com.softserve.entity.RoomType;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.SortOrderNotExistsException;
import com.softserve.mapper.RoomMapper;
import com.softserve.repository.RoomRepository;
import com.softserve.repository.SortOrderRepository;
import com.softserve.service.impl.RoomServiceImpl;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@Tag("unit")
@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private SortOrderRepository<Room> sortOrderRepository;

    @Mock
    private RoomMapper roomMapper;

    @InjectMocks
    private RoomServiceImpl roomService;

    @Test
    void getRoomById() {
        Room room = createRoom(1L, "1 Room", createRoomType(1L, "Small auditory"));
        RoomDTO expectedDTO = createRoomDTO(1L, "1 Room", createRoomTypeDTO(1L, "Small auditory"));

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(roomMapper.convertToDto(room)).thenReturn(expectedDTO);

        RoomDTO result = roomService.getById(1L);

        assertNotNull(result);
        assertEquals(expectedDTO.getId(), result.getId());
        assertEquals(expectedDTO.getName(), result.getName());
        verify(roomRepository).findById(1L);
        verify(roomMapper).convertToDto(room);
    }

    @Test
    void throwEntityNotFoundExceptionIfRoomNotFound() {
        when(roomRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> roomService.getById(2L));
        verify(roomRepository).findById(2L);
    }

    @Test
    void saveRoomIfNameAndTypeAreNotExist() {
        Room room = createRoom(1L, "1 Room", createRoomType(1L, "Small auditory"));
        RoomDTO inputDTO = createRoomDTO(null, "1 Room", createRoomTypeDTO(1L, "Small auditory"));
        RoomDTO expectedDTO = createRoomDTO(1L, "1 Room", createRoomTypeDTO(1L, "Small auditory"));

        when(roomMapper.convertToEntity(inputDTO)).thenReturn(room);
        when(roomRepository.countRoomDuplicates(any(Room.class))).thenReturn(0L);
        when(roomRepository.save(room)).thenReturn(room);
        when(roomMapper.convertToDto(room)).thenReturn(expectedDTO);

        RoomDTO result = roomService.save(inputDTO);

        assertNotNull(result);
        assertEquals(expectedDTO.getName(), result.getName());
        assertEquals(expectedDTO.getType(), result.getType());
        verify(roomRepository).save(room);
        verify(roomRepository).countRoomDuplicates(room);
    }

    @Test
    void throwEntityAlreadyExistsExceptionIfSavedRoomAlreadyExists() {
        Room room = createRoom(1L, "1 Room", createRoomType(1L, "Small auditory"));
        RoomDTO inputDTO = createRoomDTO(null, "1 Room", createRoomTypeDTO(1L, "Small auditory"));

        when(roomMapper.convertToEntity(inputDTO)).thenReturn(room);
        when(roomRepository.countRoomDuplicates(room)).thenReturn(1L);

        assertThrows(EntityAlreadyExistsException.class, () -> roomService.save(inputDTO));
        verify(roomRepository).countRoomDuplicates(room);
        verify(roomRepository, never()).save(any());
    }

    @Test
    void updateRoomIfNameAndTypeAreNotExist() {
        Room room = createRoom(1L, "1 Room updated", createRoomType(1L, "Small auditory"));
        RoomDTO inputDTO = createRoomDTO(1L, "1 Room updated", createRoomTypeDTO(1L, "Small auditory"));
        RoomDTO expectedDTO = createRoomDTO(1L, "1 Room updated", createRoomTypeDTO(1L, "Small auditory"));
        Integer expectedSortOrder = 1;

        when(roomMapper.convertToEntity(inputDTO)).thenReturn(room);
        when(roomRepository.countRoomDuplicates(any(Room.class))).thenReturn(0L);
        when(sortOrderRepository.getSortOrderById(anyLong())).thenReturn(Optional.of(expectedSortOrder));
        when(roomRepository.update(room)).thenReturn(room);
        when(roomMapper.convertToDto(room)).thenReturn(expectedDTO);

        RoomDTO result = roomService.update(inputDTO);

        assertNotNull(result);
        assertEquals(expectedDTO.getId(), result.getId());
        assertEquals(expectedDTO.getName(), result.getName());
        verify(roomRepository).update(room);
        verify(roomRepository).countRoomDuplicates(any(Room.class));
    }

    @Test
    void throwEntityAlreadyExistsExceptionIfUpdatedNameAndTypeAlreadyExist() {
        Room room = createRoom(1L, "1 Room updated", createRoomType(2L, "Medium auditory"));
        RoomDTO inputDTO = createRoomDTO(1L, "1 Room updated", createRoomTypeDTO(2L, "Medium auditory"));

        when(roomMapper.convertToEntity(inputDTO)).thenReturn(room);
        when(roomRepository.countRoomDuplicates(any(Room.class))).thenReturn(1L);

        assertThrows(EntityAlreadyExistsException.class, () -> roomService.update(inputDTO));
        verify(roomRepository).countRoomDuplicates(any(Room.class));
        verify(roomRepository, never()).update(any());
    }

    @Test
    void throwSortOrderNotExistsExceptionWhenSaveAfterNonExistentRoom() {
        Room room = createRoom(11L, "11 Room", createRoomType(1L, "Small auditory"));
        RoomDTO inputDTO = createRoomDTO(11L, "11 Room", createRoomTypeDTO(1L, "Small auditory"));
        Long afterNotExistRoomId = 10L;

        when(roomMapper.convertToEntity(inputDTO)).thenReturn(room);
        when(sortOrderRepository.createAfterOrder(room, afterNotExistRoomId))
                .thenThrow(SortOrderNotExistsException.class);

        assertThrows(SortOrderNotExistsException.class,
                () -> roomService.createAfterOrder(inputDTO, afterNotExistRoomId));
        verify(sortOrderRepository).createAfterOrder(room, afterNotExistRoomId);
    }

    @Test
    void saveAfterOrderSuccessfully() {
        RoomType roomType = createRoomType(1L, "Small auditory");
        Room room = createRoom(null, "11 Room", roomType);
        Room savedRoom = createRoom(null, "11 Room", roomType);
        savedRoom.setSortOrder(1);
        RoomDTO inputDTO = createRoomDTO(null, "11 Room", createRoomTypeDTO(1L, "Small auditory"));
        RoomDTO expectedDTO = createRoomDTO(null, "11 Room", createRoomTypeDTO(1L, "Small auditory"));
        Long afterRoomId = 0L;

        when(roomMapper.convertToEntity(inputDTO)).thenReturn(room);
        when(sortOrderRepository.createAfterOrder(room, afterRoomId)).thenReturn(savedRoom);
        when(roomMapper.convertToDto(savedRoom)).thenReturn(expectedDTO);

        RoomDTO result = roomService.createAfterOrder(inputDTO, afterRoomId);

        assertNotNull(result);
        assertEquals(expectedDTO, result);
        verify(sortOrderRepository).createAfterOrder(room, afterRoomId);
    }

    // ==================== Helper methods ====================

    private RoomType createRoomType(Long id, String description) {
        RoomType roomType = new RoomType();
        roomType.setId(id);
        roomType.setDescription(description);
        return roomType;
    }

    private RoomTypeDTO createRoomTypeDTO(Long id, String description) {
        RoomTypeDTO roomTypeDTO = new RoomTypeDTO();
        roomTypeDTO.setId(id);
        roomTypeDTO.setDescription(description);
        return roomTypeDTO;
    }

    private Room createRoom(Long id, String name, RoomType roomType) {
        Room room = new Room();
        room.setId(id);
        room.setName(name);
        room.setType(roomType);
        return room;
    }

    private RoomDTO createRoomDTO(Long id, String name, RoomTypeDTO roomTypeDTO) {
        RoomDTO dto = new RoomDTO();
        dto.setId(id);
        dto.setName(name);
        dto.setType(roomTypeDTO);
        return dto;
    }
}
