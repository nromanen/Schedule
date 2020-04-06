package com.softserve.service;

import com.softserve.dto.CreateScheduleInfoDTO;
import com.softserve.dto.RoomForScheduleDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Lesson;
import com.softserve.entity.Room;
import com.softserve.entity.Teacher;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.ScheduleConflictException;
import com.softserve.repository.ScheduleRepository;
import com.softserve.service.impl.ScheduleServiceImpl;
import com.softserve.service.mapper.RoomForScheduleMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class ScheduleServiceTest {
    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private LessonService lessonService;

    @Mock
    private RoomService roomService;

    @Mock
    private RoomForScheduleMapper roomForScheduleMapper;

    @InjectMocks
    private ScheduleServiceImpl scheduleService;

    @Test
    public void withoutConflictInSchedule() {
        Long semesterId = 1L;
        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
        EvenOdd evenOdd = EvenOdd.EVEN;
        Long classId = 1L;
        Group group = new Group();
        group.setId(1L);
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setGroup(group);

        doReturn(lesson).when(lessonService).getById(anyLong());
        Long groupId = lessonService.getById(1L).getGroup().getId();
        doReturn(0L).when(scheduleRepository).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);

        boolean result = scheduleRepository.conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId) != 0;
        verify(lessonService, times(1)).getById(anyLong());
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
        assertFalse(result);
    }

    @Test
    public void withConflictInSchedule() {
        Long semesterId = 1L;
        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
        EvenOdd evenOdd = EvenOdd.EVEN;
        Long classId = 1L;
        Group group = new Group();
        group.setId(1L);
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setGroup(group);

        doReturn(lesson).when(lessonService).getById(anyLong());
        Long groupId = lessonService.getById(1L).getGroup().getId();
        doReturn(1L).when(scheduleRepository).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);

        boolean result = scheduleRepository.conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId) != 0;
        verify(lessonService, times(1)).getById(anyLong());
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
        assertTrue(result);
    }

    @Test
    public void teacherIsAvailable() {
        Long semesterId = 1L;
        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
        EvenOdd evenOdd = EvenOdd.EVEN;
        Long classId = 1L;
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTeacher(teacher);

        doReturn(lesson).when(lessonService).getById(anyLong());
        Long teacherId = lessonService.getById(1L).getTeacher().getId();
        doReturn(0L).when(scheduleRepository).conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId);

        boolean result = scheduleRepository.conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId) == 0;
        verify(lessonService, times(1)).getById(anyLong());
        verify(scheduleRepository, times(1)).conflictForTeacherInSchedule(anyLong(), any(DayOfWeek.class), any(EvenOdd.class), anyLong(), anyLong());
        assertTrue(result);
    }

    @Test
    public void teacherIsNotAvailable() {
        Long semesterId = 1L;
        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
        EvenOdd evenOdd = EvenOdd.EVEN;
        Long classId = 1L;
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTeacher(teacher);

        doReturn(lesson).when(lessonService).getById(anyLong());
        Long teacherId = lessonService.getById(1L).getTeacher().getId();
        doReturn(1L).when(scheduleRepository).conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId);

        boolean result = scheduleRepository.conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId) == 0;
        verify(lessonService, times(1)).getById(anyLong());
        verify(scheduleRepository, times(1)).conflictForTeacherInSchedule(anyLong(), any(DayOfWeek.class), any(EvenOdd.class), anyLong(), anyLong());
        assertFalse(result);
    }

    @Test
    public void getInfoForCreatingScheduleGood() {
        Long semesterId = 1L;
        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
        EvenOdd evenOdd = EvenOdd.EVEN;
        Long classId = 1L;
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        Group group = new Group();
        group.setId(1L);
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTeacher(teacher);
        lesson.setGroup(group);
        Long lessonId = lesson.getId();
        Room freeRoom = new Room() {{
            setId(1);
            setName("free room");
            setType("free room");
        }};
        Room occupiedRoom = new Room() {{
            setId(2);
            setName("occupied room");
            setType("occupied room");
        }};
        List<Room> freeRoomList = new ArrayList<>();
        freeRoomList.add(freeRoom);
        List<Room> occupiedRoomList = new ArrayList<>();
        occupiedRoomList.add(occupiedRoom);
        List<RoomForScheduleDTO> allRooms = new ArrayList<RoomForScheduleDTO>() {{
            add(new RoomForScheduleDTO() {{
                setId(1L);
                setAvailable(true);
                setName("free name");
                setType("free type");
            }});
            add(new RoomForScheduleDTO() {{
                setId(2L);
                setAvailable(true);
                setName("occupied name");
                setType("occupied type");
            }});
        }};
        CreateScheduleInfoDTO expectedDTO = new CreateScheduleInfoDTO();
        expectedDTO.setTeacherAvailable(true);
        expectedDTO.setRooms(allRooms);
        expectedDTO.setClassSuitsToTeacher(true);

        doReturn(lesson).when(lessonService).getById(anyLong());
        Long groupId = lessonService.getById(1L).getGroup().getId();
        doReturn(0L).when(scheduleRepository).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
        Long teacherId = lessonService.getById(1L).getTeacher().getId();
        doReturn(0L).when(scheduleRepository).conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId);
        doReturn(allRooms).when(roomForScheduleMapper).toRoomForScheduleDTOList(any(List.class));
        doReturn(freeRoomList).when(roomService).getAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId);
        doReturn(occupiedRoomList).when(roomService).getNotAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId);

        CreateScheduleInfoDTO actualDTO = scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId, lessonId);
        assertEquals(expectedDTO.isClassSuitsToTeacher(), actualDTO.isClassSuitsToTeacher());
        assertEquals(expectedDTO.isTeacherAvailable(), actualDTO.isTeacherAvailable());
        assertEquals(expectedDTO.getRooms().size(), actualDTO.getRooms().size());
        assertEquals(expectedDTO.getRooms().get(0), actualDTO.getRooms().get(0));
        assertEquals(expectedDTO.getRooms().get(1), actualDTO.getRooms().get(1));
        assertEquals(expectedDTO.getRooms().get(2), actualDTO.getRooms().get(2));
        assertEquals(expectedDTO.getRooms().get(3), actualDTO.getRooms().get(3));
        verify(roomService, times(1)).getAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId);
        verify(roomService, times(1)).getNotAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId);
        verify(lessonService, times(4)).getById(anyLong());
        verify(roomForScheduleMapper, times(2)).toRoomForScheduleDTOList(any(List.class));
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
        verify(scheduleRepository, times(1)).conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId);
    }

    @Test(expected = ScheduleConflictException.class)
    public void getInfoForCreatingScheduleBad() {
        Long semesterId = 1L;
        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
        EvenOdd evenOdd = EvenOdd.EVEN;
        Long classId = 1L;
        Group group = new Group();
        group.setId(1L);
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setGroup(group);

        doReturn(lesson).when(lessonService).getById(anyLong());
        Long groupId = lessonService.getById(1L).getGroup().getId();
        doReturn(1L).when(scheduleRepository).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);

        CreateScheduleInfoDTO createScheduleInfoDTO = scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
        verify(lessonService, times(1)).getById(anyLong());
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
    }
}
