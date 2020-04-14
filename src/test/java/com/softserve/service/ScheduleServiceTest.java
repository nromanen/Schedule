//package com.softserve.service;
//
//import com.softserve.dto.CreateScheduleInfoDTO;
//import com.softserve.dto.RoomForScheduleDTO;
//import com.softserve.entity.*;
//import com.softserve.entity.enums.EvenOdd;
//import com.softserve.exception.EntityNotFoundException;
//import com.softserve.exception.ScheduleConflictException;
//import com.softserve.repository.ScheduleRepository;
//import com.softserve.service.impl.ScheduleServiceImpl;
//import org.junit.Test;
//import org.junit.experimental.categories.Category;
//import org.junit.runner.RunWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.MockitoJUnitRunner;
//
//import java.time.DayOfWeek;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.Assert.*;
//import static org.mockito.ArgumentMatchers.anyLong;
//import static org.mockito.Mockito.*;
//
//@Category(UnitTestCategory.class)
//@RunWith(MockitoJUnitRunner.class)
//public class ScheduleServiceTest {
//    @Mock
//    private ScheduleRepository scheduleRepository;
//
//    @Mock
//    private LessonService lessonService;
//
//    @Mock
//    private RoomService roomService;
//
//    @InjectMocks
//    private ScheduleServiceImpl scheduleService;
//
//    @Test
//    public void getById() {
//        Schedule expectedSchedule = new Schedule();
//        expectedSchedule.setId(1L);
//        expectedSchedule.setDayOfWeek(DayOfWeek.MONDAY.toString());
//        expectedSchedule.setEvenOdd(EvenOdd.ODD);
//        expectedSchedule.setLesson(new Lesson());
//        expectedSchedule.setPeriod(new Period());
//        expectedSchedule.setRoom(new Room());
//        expectedSchedule.setSemester(new Semester());
//
//        doReturn(Optional.of(expectedSchedule)).when(scheduleRepository).findById(1L);
//
//        Schedule actualSchedule = scheduleRepository.findById(1L).get();
//        assertNotNull(actualSchedule);
//        assertEquals(expectedSchedule, actualSchedule);
//        verify(scheduleRepository, times(1)).findById(1L);
//    }
//
//    @Test(expected = EntityNotFoundException.class)
//    public void notFound() {
//        Schedule schedule = new Schedule();
//        schedule.setId(1L);
//
//        scheduleService.getById(2L);
//        verify(scheduleRepository, times(1)).findById(2L);
//    }
//
//    @Test
//    public void save() {
//        Group group = new Group();
//        group.setId(1L);
//        Lesson lesson = new Lesson();
//        lesson.setGroup(group);
//        lesson.setId(1L);
//        Semester semester = new Semester();
//        semester.setId(1L);
//        Period period = new Period();
//        period.setId(1L);
//        Room room = new Room();
//        room.setId(1L);
//        Schedule expectedSchedule = new Schedule();
//        expectedSchedule.setId(1L);
//        expectedSchedule.setDayOfWeek(DayOfWeek.MONDAY.toString());
//        expectedSchedule.setEvenOdd(EvenOdd.ODD);
//        expectedSchedule.setLesson(lesson);
//        expectedSchedule.setPeriod(period);
//        expectedSchedule.setRoom(room);
//        expectedSchedule.setSemester(semester);
//
//        doReturn(lesson).when(lessonService).getById(1L);
//        Long groupId = lessonService.getById(1L).getGroup().getId();
//        doReturn(0L).when(scheduleRepository).conflictForGroupInSchedule(
//                expectedSchedule.getSemester().getId(),
//                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
//                expectedSchedule.getEvenOdd(),
//                expectedSchedule.getPeriod().getId(), groupId);
//        doReturn(expectedSchedule).when(scheduleRepository).save(expectedSchedule);
//
//        Schedule actualSchedule = scheduleService.save(expectedSchedule);
//        assertNotNull(actualSchedule);
//        assertEquals(expectedSchedule, actualSchedule);
//        verify(lessonService, times(2)).getById(1L);
//        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(
//                expectedSchedule.getSemester().getId(),
//                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
//                expectedSchedule.getEvenOdd(),
//                expectedSchedule.getPeriod().getId(), groupId);
//        verify(scheduleRepository, times(1)).save(expectedSchedule);
//    }
//
//    @Test(expected = ScheduleConflictException.class)
//    public void saveWithConflict() {
//        Group group = new Group();
//        group.setId(1L);
//        Lesson lesson = new Lesson();
//        lesson.setGroup(group);
//        lesson.setId(1L);
//        Semester semester = new Semester();
//        semester.setId(1L);
//        Period period = new Period();
//        period.setId(1L);
//        Room room = new Room();
//        room.setId(1L);
//        Schedule expectedSchedule = new Schedule();
//        expectedSchedule.setId(1L);
//        expectedSchedule.setDayOfWeek(DayOfWeek.MONDAY.toString());
//        expectedSchedule.setEvenOdd(EvenOdd.ODD);
//        expectedSchedule.setLesson(lesson);
//        expectedSchedule.setPeriod(period);
//        expectedSchedule.setRoom(room);
//        expectedSchedule.setSemester(semester);
//
//        doReturn(lesson).when(lessonService).getById(1L);
//        Long groupId = lessonService.getById(1L).getGroup().getId();
//        doReturn(1L).when(scheduleRepository).conflictForGroupInSchedule(
//                expectedSchedule.getSemester().getId(),
//                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
//                expectedSchedule.getEvenOdd(),
//                expectedSchedule.getPeriod().getId(), groupId);
//
//        scheduleService.save(expectedSchedule);
//        verify(lessonService, times(2)).getById(1L);
//        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(
//                expectedSchedule.getSemester().getId(),
//                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
//                expectedSchedule.getEvenOdd(),
//                expectedSchedule.getPeriod().getId(), groupId);
//    }
//
//    @Test
//    public void update() {
//        Group oldGroup = new Group();
//        oldGroup.setId(1L);
//        Lesson oldLesson = new Lesson();
//        oldLesson.setGroup(oldGroup);
//        oldLesson.setId(1L);
//        Semester oldSemester = new Semester();
//        oldSemester.setId(1L);
//        Period oldPeriod = new Period();
//        oldPeriod.setId(1L);
//        Room oldRoom = new Room();
//        oldRoom.setId(1L);
//        Schedule oldSchedule = new Schedule();
//        oldSchedule.setId(1L);
//        oldSchedule.setDayOfWeek(DayOfWeek.MONDAY.toString());
//        oldSchedule.setEvenOdd(EvenOdd.ODD);
//        oldSchedule.setLesson(oldLesson);
//        oldSchedule.setPeriod(oldPeriod);
//        oldSchedule.setRoom(oldRoom);
//        oldSchedule.setSemester(oldSemester);
//
//        Group group = new Group();
//        group.setId(2L);
//        Lesson lesson = new Lesson();
//        lesson.setGroup(group);
//        lesson.setId(2L);
//        Semester semester = new Semester();
//        semester.setId(2L);
//        Period period = new Period();
//        period.setId(2L);
//        Room room = new Room();
//        room.setId(2L);
//        Schedule expectedSchedule = new Schedule();
//        expectedSchedule.setId(1L);
//        expectedSchedule.setDayOfWeek(DayOfWeek.TUESDAY.toString());
//        expectedSchedule.setEvenOdd(EvenOdd.EVEN);
//        expectedSchedule.setLesson(lesson);
//        expectedSchedule.setPeriod(period);
//        expectedSchedule.setRoom(room);
//        expectedSchedule.setSemester(semester);
//
//        doReturn(lesson).when(lessonService).getById(2L);
//        Long groupId = lessonService.getById(2L).getGroup().getId();
//        doReturn(0L).when(scheduleRepository).conflictForGroupInSchedule(
//                expectedSchedule.getSemester().getId(),
//                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
//                expectedSchedule.getEvenOdd(),
//                expectedSchedule.getPeriod().getId(), groupId);
//        doReturn(expectedSchedule).when(scheduleRepository).update(expectedSchedule);
//
//        oldSchedule = scheduleService.update(expectedSchedule);
//        assertNotNull(oldSchedule);
//        assertEquals(expectedSchedule, oldSchedule);
//        verify(lessonService, times(2)).getById(2L);
//        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(
//                expectedSchedule.getSemester().getId(),
//                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
//                expectedSchedule.getEvenOdd(),
//                expectedSchedule.getPeriod().getId(), groupId);
//        verify(scheduleRepository, times(1)).update(expectedSchedule);
//    }
//
//    @Test(expected = ScheduleConflictException.class)
//    public void updateWithConflict() {
//        Group oldGroup = new Group();
//        oldGroup.setId(1L);
//        Lesson oldLesson = new Lesson();
//        oldLesson.setGroup(oldGroup);
//        oldLesson.setId(1L);
//        Semester oldSemester = new Semester();
//        oldSemester.setId(1L);
//        Period oldPeriod = new Period();
//        oldPeriod.setId(1L);
//        Room oldRoom = new Room();
//        oldRoom.setId(1L);
//        Schedule oldSchedule = new Schedule();
//        oldSchedule.setId(1L);
//        oldSchedule.setDayOfWeek(DayOfWeek.MONDAY.toString());
//        oldSchedule.setEvenOdd(EvenOdd.ODD);
//        oldSchedule.setLesson(oldLesson);
//        oldSchedule.setPeriod(oldPeriod);
//        oldSchedule.setRoom(oldRoom);
//        oldSchedule.setSemester(oldSemester);
//
//        Group group = new Group();
//        group.setId(2L);
//        Lesson lesson = new Lesson();
//        lesson.setGroup(group);
//        lesson.setId(2L);
//        Semester semester = new Semester();
//        semester.setId(2L);
//        Period period = new Period();
//        period.setId(2L);
//        Room room = new Room();
//        room.setId(2L);
//        Schedule expectedSchedule = new Schedule();
//        expectedSchedule.setId(1L);
//        expectedSchedule.setDayOfWeek(DayOfWeek.TUESDAY.toString());
//        expectedSchedule.setEvenOdd(EvenOdd.EVEN);
//        expectedSchedule.setLesson(lesson);
//        expectedSchedule.setPeriod(period);
//        expectedSchedule.setRoom(room);
//        expectedSchedule.setSemester(semester);
//
//        doReturn(lesson).when(lessonService).getById(2L);
//        Long groupId = lessonService.getById(2L).getGroup().getId();
//        doReturn(1L).when(scheduleRepository).conflictForGroupInSchedule(
//                expectedSchedule.getSemester().getId(),
//                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
//                expectedSchedule.getEvenOdd(),
//                expectedSchedule.getPeriod().getId(), groupId);
//
//        oldSchedule = scheduleService.update(expectedSchedule);
//        assertNotNull(oldSchedule);
//        assertEquals(expectedSchedule, oldSchedule);
//        verify(lessonService, times(2)).getById(2L);
//        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(
//                expectedSchedule.getSemester().getId(),
//                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
//                expectedSchedule.getEvenOdd(),
//                expectedSchedule.getPeriod().getId(), groupId);
//    }
//
//    @Test
//    public void withoutConflictInSchedule() {
//        Long semesterId = 1L;
//        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
//        EvenOdd evenOdd = EvenOdd.EVEN;
//        Long classId = 1L;
//        Group group = new Group();
//        group.setId(1L);
//        Lesson lesson = new Lesson();
//        lesson.setId(1L);
//        lesson.setGroup(group);
//
//        doReturn(lesson).when(lessonService).getById(anyLong());
//        Long groupId = lessonService.getById(1L).getGroup().getId();
//        doReturn(0L).when(scheduleRepository).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
//
//        boolean result = scheduleRepository.conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId) != 0;
//        verify(lessonService, times(1)).getById(anyLong());
//        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
//        assertFalse(result);
//    }
//
//    @Test
//    public void withConflictInSchedule() {
//        Long semesterId = 1L;
//        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
//        EvenOdd evenOdd = EvenOdd.EVEN;
//        Long classId = 1L;
//        Group group = new Group();
//        group.setId(1L);
//        Lesson lesson = new Lesson();
//        lesson.setId(1L);
//        lesson.setGroup(group);
//
//        doReturn(lesson).when(lessonService).getById(anyLong());
//        Long groupId = lessonService.getById(1L).getGroup().getId();
//        doReturn(1L).when(scheduleRepository).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
//
//        boolean result = scheduleRepository.conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId) != 0;
//        verify(lessonService, times(1)).getById(anyLong());
//        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
//        assertTrue(result);
//    }
//
//    @Test
//    public void teacherIsAvailable() {
//        Long semesterId = 1L;
//        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
//        EvenOdd evenOdd = EvenOdd.EVEN;
//        Long classId = 1L;
//        Teacher teacher = new Teacher();
//        teacher.setId(1L);
//        Lesson lesson = new Lesson();
//        lesson.setId(1L);
//        lesson.setTeacher(teacher);
//
//        doReturn(lesson).when(lessonService).getById(anyLong());
//        Long teacherId = lessonService.getById(1L).getTeacher().getId();
//        doReturn(0L).when(scheduleRepository).conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId);
//
//        boolean result = scheduleRepository.conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId) == 0;
//        verify(lessonService, times(1)).getById(anyLong());
//        verify(scheduleRepository, times(1)).conflictForTeacherInSchedule(anyLong(), any(DayOfWeek.class), any(EvenOdd.class), anyLong(), anyLong());
//        assertTrue(result);
//    }
//
//    @Test
//    public void teacherIsNotAvailable() {
//        Long semesterId = 1L;
//        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
//        EvenOdd evenOdd = EvenOdd.EVEN;
//        Long classId = 1L;
//        Teacher teacher = new Teacher();
//        teacher.setId(1L);
//        Lesson lesson = new Lesson();
//        lesson.setId(1L);
//        lesson.setTeacher(teacher);
//
//        doReturn(lesson).when(lessonService).getById(anyLong());
//        Long teacherId = lessonService.getById(1L).getTeacher().getId();
//        doReturn(1L).when(scheduleRepository).conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId);
//
//        boolean result = scheduleRepository.conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId) == 0;
//        verify(lessonService, times(1)).getById(anyLong());
//        verify(scheduleRepository, times(1)).conflictForTeacherInSchedule(anyLong(), any(DayOfWeek.class), any(EvenOdd.class), anyLong(), anyLong());
//        assertFalse(result);
//    }
//
//    @Test
//    public void getInfoForCreatingScheduleGood() {
//        Long semesterId = 1L;
//        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
//        EvenOdd evenOdd = EvenOdd.EVEN;
//        Long classId = 1L;
//        Teacher teacher = new Teacher();
//        teacher.setId(1L);
//        Group group = new Group();
//        group.setId(1L);
//        Lesson lesson = new Lesson();
//        lesson.setId(1L);
//        lesson.setTeacher(teacher);
//        lesson.setGroup(group);
//        Long lessonId = lesson.getId();
//        List<RoomForScheduleDTO> allRooms = new ArrayList<RoomForScheduleDTO>() {{
//            add(new RoomForScheduleDTO() {{
//                setId(1L);
//                setAvailable(true);
//                setName("free name");
//                setType("free type");
//            }});
//            add(new RoomForScheduleDTO() {{
//                setId(2L);
//                setAvailable(true);
//                setName("occupied name");
//                setType("occupied type");
//            }});
//        }};
//        CreateScheduleInfoDTO expectedDTO = new CreateScheduleInfoDTO();
//        expectedDTO.setTeacherAvailable(true);
//        expectedDTO.setRooms(allRooms);
//        expectedDTO.setClassSuitsToTeacher(true);
//
//        doReturn(lesson).when(lessonService).getById(anyLong());
//        Long groupId = lessonService.getById(1L).getGroup().getId();
//        doReturn(0L).when(scheduleRepository).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
//        Long teacherId = lessonService.getById(1L).getTeacher().getId();
//        doReturn(0L).when(scheduleRepository).conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId);
//        doReturn(allRooms).when(roomService).getAllRoomsForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId);
//
//        CreateScheduleInfoDTO actualDTO = scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId, lessonId);
//        assertEquals(expectedDTO.isClassSuitsToTeacher(), actualDTO.isClassSuitsToTeacher());
//        assertEquals(expectedDTO.isTeacherAvailable(), actualDTO.isTeacherAvailable());
//        assertEquals(expectedDTO.getRooms().size(), actualDTO.getRooms().size());
//        assertEquals(expectedDTO.getRooms().get(0), actualDTO.getRooms().get(0));
//        assertEquals(expectedDTO.getRooms().get(1), actualDTO.getRooms().get(1));
//        verify(lessonService, times(4)).getById(anyLong());
//        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
//        verify(scheduleRepository, times(1)).conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId);
//    }
//
//    @Test(expected = ScheduleConflictException.class)
//    public void getInfoForCreatingScheduleBad() {
//        Long semesterId = 1L;
//        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
//        EvenOdd evenOdd = EvenOdd.EVEN;
//        Long classId = 1L;
//        Group group = new Group();
//        group.setId(1L);
//        Lesson lesson = new Lesson();
//        lesson.setId(1L);
//        lesson.setGroup(group);
//
//        doReturn(lesson).when(lessonService).getById(anyLong());
//        Long groupId = lessonService.getById(1L).getGroup().getId();
//        doReturn(1L).when(scheduleRepository).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
//
//        CreateScheduleInfoDTO createScheduleInfoDTO = scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
//        verify(lessonService, times(1)).getById(anyLong());
//        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
//    }
//}
