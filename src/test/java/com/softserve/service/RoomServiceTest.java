package com.softserve.service;

import com.softserve.entity.Room;
import com.softserve.entity.RoomType;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.RoomRepository;
import com.softserve.service.impl.RoomServiceImpl;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
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

        room = roomService.update(updatedRoom);
        assertNotNull(room);
        assertEquals(updatedRoom, room);
        verify(roomRepository, times(1)).update(updatedRoom);
        verify(roomRepository, times(1)).countRoomDuplicates(any(Room.class));
    }
}
