package com.softserve.service;

import com.softserve.entity.Room;
import com.softserve.entity.RoomType;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.SortOrderNotExistsException;
import com.softserve.repository.RoomRepository;
import com.softserve.service.impl.RoomServiceImpl;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(MockitoJUnitRunner.class)
public class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomServiceImpl roomService;

    @Test
    public void getRoomById() {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(1L);
        room.setName("1 Room");
        room.setType(roomType);

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));

        Room result = roomService.getById(1L);
        assertNotNull(result);
        assertEquals(room.getId(), result.getId());
        assertEquals(room.getType(), result.getType());
        verify(roomRepository, times(1)).findById(anyLong());
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionIfRoomNotFounded() {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(1L);
        room.setName("1 Room");
        room.setType(roomType);

        roomService.getById(2L);
        verify(roomRepository, times(1)).findById(2L);
    }

    @Test
    public void saveRoomIfNameAndTypeAreNotExist() {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(1L);
        room.setName("1 Room");
        room.setType(roomType);

        when(roomRepository.countRoomDuplicates(any(Room.class))).thenReturn(0L);
        when(roomRepository.save(room)).thenReturn(room);

        Room result = roomService.save(room);
        assertNotNull(result);
        assertEquals(room.getName(), result.getName());
        assertEquals(room.getType(), result.getType());
        verify(roomRepository, times(1)).save(room);
        verify(roomRepository, times(1)).countRoomDuplicates(room);
    }

    @Test(expected = EntityAlreadyExistsException.class)
    public void throwEntityAlreadyExistsExceptionIfSavedRoomAlreadyExists() {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(1L);
        room.setName("1 Room");
        room.setType(roomType);

        when(roomRepository.countRoomDuplicates(room)).thenReturn(1L);

        roomService.save(room);
        verify(roomRepository, times(1)).save(room);
        verify(roomRepository, times(1)).countRoomDuplicates(room);
    }

    @Test
    public void updateRoomIfNameAndTypeAreNotExist() {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(1L);
        room.setName("1 Room");
        room.setType(roomType);
        RoomType updatedType = new RoomType();
        updatedType.setId(2L);
        updatedType.setDescription("Medium auditory");
        Room updatedRoom = new Room();
        updatedRoom.setId(1L);
        updatedRoom.setName("1 Room updated");
        updatedRoom.setType(updatedType);

        when(roomRepository.countRoomDuplicates(any(Room.class))).thenReturn(0L);
        when(roomRepository.update(updatedRoom)).thenReturn(updatedRoom);

        room = roomService.update(updatedRoom);
        assertNotNull(room);
        assertEquals(updatedRoom, room);
        verify(roomRepository, times(1)).update(updatedRoom);
        verify(roomRepository, times(1)).countRoomDuplicates(any(Room.class));
    }

    @Test(expected = EntityAlreadyExistsException.class)
    public void throwEntityAlreadyExistsExceptionIfUpdatedNameAndTypeAlreadyExist() {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(1L);
        room.setName("1 Room");
        room.setType(roomType);
        RoomType updatedType = new RoomType();
        updatedType.setId(2L);
        updatedType.setDescription("Medium auditory");
        Room updatedRoom = new Room();
        updatedRoom.setId(1L);
        updatedRoom.setName("1 Room updated");
        updatedRoom.setType(updatedType);

        when(roomRepository.countRoomDuplicates(any(Room.class))).thenReturn(1L);

        roomService.update(updatedRoom);
        verify(roomRepository, times(1)).update(updatedRoom);
        verify(roomRepository, times(1)).countRoomDuplicates(any(Room.class));
    }

    @Test
    public void saveAfterId_WhenSaveInTheMiddleOfOrderAfterExistenceRoom_ShouldReturnSavedRoom() {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(3L);
        room.setName("3 Room");
        room.setType(roomType);
        Long afterId = 2L;

        when(roomRepository.getSortOrderById(afterId)).thenReturn(Optional.of(2));
        doNothing().when(roomRepository).shiftSortOrderRange(3, null, RoomRepository.Direction.DOWN);
        when(roomRepository.save(room)).thenReturn(room);

        Room result = roomService.saveAfterId(room, afterId);
        assertNotNull(result);
        assertEquals(Integer.valueOf(3), result.getSortOrder());
        assertEquals(room.getId(), result.getId());
        assertEquals(room.getType(), result.getType());
        verify(roomRepository, times(1)).getSortOrderById(anyLong());
        verify(roomRepository, times(1)).shiftSortOrderRange(3, null, RoomRepository.Direction.DOWN);
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    public void saveAfterId_WhenSaveAtFirstPositionInSortOrder_ShouldReturnSavedRoom () {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(3L);
        room.setName("3 Room");
        room.setType(roomType);
        Long afterId = 0L;

        doNothing().when(roomRepository).shiftSortOrderRange(1, null, RoomRepository.Direction.DOWN);
        when(roomRepository.save(room)).thenReturn(room);

        Room result = roomService.saveAfterId(room, afterId);
        assertNotNull(result);
        assertEquals(Integer.valueOf(1), result.getSortOrder());
        assertEquals(room.getId(), result.getId());
        assertEquals(room.getType(), result.getType());
        verify(roomRepository, times(0)).getSortOrderById(anyLong());
        verify(roomRepository, times(1)).shiftSortOrderRange(1, null, RoomRepository.Direction.DOWN);
        verify(roomRepository, times(1)).save(any(Room.class));

    }

    @Test(expected = SortOrderNotExistsException.class)
    public void saveAfterId_WhenSaveAfterNotExistRoom_ShouldThrowSortingOrderNotExistsException() throws SortOrderNotExistsException {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(11L);
        room.setName("11 Room");
        room.setType(roomType);
        Long afterNotExistRoomId = 10L;

        when(roomRepository.getSortOrderById(afterNotExistRoomId)).thenReturn(Optional.empty());

        roomService.saveAfterId(room, afterNotExistRoomId);
    }

    @Test
    public void updateSortOrder_WhenUpdateInTheMiddleOfSortOrderFromEndAfterExistenceRoom_ShouldReturnUpdatedRoom() {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(10L);
        room.setName("Laboratory");
        room.setType(roomType);
        Long afterId = 6L;

        when(roomRepository.isExistsById(10L)).thenReturn(true);
        when(roomRepository.getSortOrderById(afterId)).thenReturn(Optional.of(3));
        when(roomRepository.getSortOrderById(10L)).thenReturn(Optional.of(10));
        doNothing().when(roomRepository).shiftSortOrderRange(4, 10, RoomRepository.Direction.DOWN);
        when(roomRepository.update(room)).thenReturn(room);

        Room result = roomService.updateSortOrder(room, afterId);
        assertNotNull(result);
        assertEquals(Integer.valueOf(4), result.getSortOrder());
        assertEquals(room.getId(), result.getId());
        assertEquals(room.getType(), result.getType());
        verify(roomRepository, times(2)).getSortOrderById(anyLong());
        verify(roomRepository, times(1)).shiftSortOrderRange(4, 10, RoomRepository.Direction.DOWN);
        verify(roomRepository, times(1)).update(any(Room.class));
    }

    @Test
    public void updateSortOrder_WhenPlaceRoomInTheMiddleOfSortOrderFromBeginAfterExistenceRoom_ShouldReturnUpdatedRoom() {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(1L);
        room.setName("Laboratory");
        room.setType(roomType);
        Long afterId = 6L;

        when(roomRepository.isExistsById(1L)).thenReturn(true);
        when(roomRepository.getSortOrderById(afterId)).thenReturn(Optional.of(3));
        when(roomRepository.getSortOrderById(1L)).thenReturn(Optional.of(1));
        doNothing().when(roomRepository).shiftSortOrderRange(2, 3, RoomRepository.Direction.UP);
        when(roomRepository.update(room)).thenReturn(room);

        Room result = roomService.updateSortOrder(room, afterId);
        assertNotNull(result);
        assertEquals(Integer.valueOf(3), result.getSortOrder());
        assertEquals(room.getId(), result.getId());
        assertEquals(room.getType(), result.getType());
        verify(roomRepository, times(2)).getSortOrderById(anyLong());
        verify(roomRepository, times(1)).shiftSortOrderRange(2, 3, RoomRepository.Direction.UP);
        verify(roomRepository, times(1)).update(any(Room.class));
    }

    @Test
    public void updateSortOrder_WhenPlaceAtFirstPositionInSortOrder_ShouldReturnUpdatedRoom () {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(3L);
        room.setName("3 Room");
        room.setType(roomType);
        Long afterId = 0L;

        when(roomRepository.isExistsById(3L)).thenReturn(true);
        doNothing().when(roomRepository).shiftSortOrderRange(1, null, RoomRepository.Direction.DOWN);
        when(roomRepository.update(room)).thenReturn(room);

        Room result = roomService.updateSortOrder(room, afterId);
        assertNotNull(result);
        assertEquals(Integer.valueOf(1), result.getSortOrder());
        assertEquals(room.getId(), result.getId());
        assertEquals(room.getType(), result.getType());
        verify(roomRepository, times(0)).getSortOrderById(anyLong());
        verify(roomRepository, times(1)).shiftSortOrderRange(1, null, RoomRepository.Direction.DOWN);
        verify(roomRepository, times(1)).update(any(Room.class));

    }

    @Test(expected = EntityNotFoundException.class)
    public void updateSortOrder_WhenUpdatedRoomNotExist_ShouldThrowEntityNotFoundException() throws EntityNotFoundException {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(11L);
        room.setName("11 Room");
        room.setType(roomType);
        Long afterNotExistRoomId = 10L;

        roomService.updateSortOrder(room, afterNotExistRoomId);
    }

    @Test(expected = EntityNotFoundException.class)
    public void updateSortOrder_WhenRoomPlacedAfterSameRoomId_ShouldThrowEntityNotFoundException() throws EntityNotFoundException {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Small auditory");
        Room room = new Room();
        room.setId(11L);
        room.setName("11 Room");
        room.setType(roomType);
        Long afterNotExistRoomId = 10L;

        roomService.updateSortOrder(room, afterNotExistRoomId);
    }

}
