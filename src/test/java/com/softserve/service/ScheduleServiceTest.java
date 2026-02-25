package com.softserve.service;

import com.softserve.dto.ScheduleDTO;
import com.softserve.dto.SemesterWithGroupsDTO;
import com.softserve.dto.TeacherDTO;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.mapper.*;
import com.softserve.repository.LessonRepository;
import com.softserve.repository.PeriodRepository;
import com.softserve.repository.RoomRepository;
import com.softserve.repository.ScheduleRepository;
import com.softserve.service.impl.ScheduleCacheService;
import com.softserve.service.impl.ScheduleServiceImpl;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@Tag("unit")
@ExtendWith(MockitoExtension.class)
class ScheduleServiceTest {

    @Mock
    private ScheduleRepository scheduleRepository;
    @Mock
    private ScheduleCacheService cacheService;
    @Mock
    private LessonService lessonService;
    @Mock
    private RoomService roomService;
    @Mock
    private GroupService groupService;
    @Mock
    private TeacherService teacherService;
    @Mock
    private SemesterService semesterService;
    @Mock
    private MailService mailService;
    @Mock
    private GroupMapper groupMapper;
    @Mock
    private PeriodMapper periodMapper;
    @Mock
    private LessonsInScheduleMapper lessonsInScheduleMapper;
    @Mock
    private RoomForScheduleMapper roomForScheduleMapper;
    @Mock
    private LessonForTeacherScheduleMapper lessonForTeacherScheduleMapper;
    @Mock
    private ScheduleWithoutSemesterMapper scheduleWithoutSemesterMapper;
    @Mock
    private ScheduleSaveMapper scheduleSaveMapper;
    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private ScheduleMapper scheduleMapper;
    @Mock
    private RoomRepository roomRepository;
    @Mock
    private PeriodRepository periodRepository;

    @InjectMocks
    private ScheduleServiceImpl scheduleServiceImpl;

    // ---- Helper methods ----

    private Semester createSemester(Long id) {
        Semester semester = new Semester();
        semester.setId(id);
        return semester;
    }

    private Group createGroup(Long id) {
        Group group = new Group();
        group.setId(id);
        return group;
    }

    private Teacher createTeacher(Long id) {
        Teacher teacher = new Teacher();
        teacher.setId(id);
        return teacher;
    }

    private Room createRoom(Long id, String name) {
        Room room = new Room();
        room.setId(id);
        room.setName(name);
        return room;
    }

    private Period createPeriod(Long id) {
        Period period = new Period();
        period.setId(id);
        return period;
    }

    private Lesson createLesson(Long id, Semester semester, Group group, Teacher teacher, boolean grouped) {
        Lesson lesson = new Lesson();
        lesson.setId(id);
        lesson.setSemester(semester);
        lesson.setGroup(group);
        lesson.setTeacher(teacher);
        lesson.setGrouped(grouped);
        return lesson;
    }

    private Schedule createSchedule(Long id, Lesson lesson, Period period, Room room, DayOfWeek day, EvenOdd evenOdd) {
        Schedule schedule = new Schedule();
        schedule.setId(id);
        schedule.setLesson(lesson);
        schedule.setPeriod(period);
        schedule.setRoom(room);
        schedule.setDayOfWeek(day);
        schedule.setEvenOdd(evenOdd);
        return schedule;
    }

    // ---- Tests ----

    @Test
    void getById() {
        Semester semester = createSemester(1L);
        semester.setDaysOfWeek(new HashSet<>());
        semester.setPeriods(new HashSet<>());
        semester.setGroups(new HashSet<>());
        Lesson lesson = createLesson(1L, semester, createGroup(1L), createTeacher(1L), false);
        Schedule schedule = createSchedule(1L, lesson, createPeriod(1L), createRoom(1L, "Room1"), DayOfWeek.MONDAY, EvenOdd.ODD);

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));

        Schedule result = scheduleServiceImpl.getById(1L);

        assertNotNull(result);
        assertEquals(schedule.getId(), result.getId());
        verify(scheduleRepository).findById(1L);
    }

    @Test
    void throwEntityNotFoundExceptionIfScheduleNotFound() {
        when(scheduleRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> scheduleServiceImpl.getById(2L));
    }

    @Test
    void save() {
        Semester semester = createSemester(1L);
        Group group = createGroup(1L);
        Teacher teacher = createTeacher(1L);
        Lesson lesson = createLesson(1L, semester, group, teacher, false);
        Schedule schedule = createSchedule(1L, lesson, createPeriod(1L), createRoom(1L, "Room1"), DayOfWeek.MONDAY, EvenOdd.ODD);

        when(scheduleRepository.conflictForGroupInSchedule(anyLong(), any(), any(), anyLong(), anyLong())).thenReturn(0L);
        when(scheduleRepository.save(any(Schedule.class))).thenReturn(schedule);

        Schedule result = scheduleServiceImpl.save(schedule);

        assertNotNull(result);
        verify(scheduleRepository).save(schedule);
        verify(cacheService).evictCachesForSchedule(1L, 1L, 1L);
    }

    @Test
    void update() {
        Semester semester = createSemester(1L);
        Lesson lesson = createLesson(1L, semester, createGroup(1L), createTeacher(1L), false);
        Schedule schedule = createSchedule(1L, lesson, createPeriod(1L), createRoom(1L, "Room1"), DayOfWeek.MONDAY, EvenOdd.EVEN);

        when(scheduleRepository.conflictForGroupInSchedule(anyLong(), any(), any(), anyLong(), anyLong())).thenReturn(0L);
        when(scheduleRepository.update(schedule)).thenReturn(schedule);

        Schedule result = scheduleServiceImpl.update(schedule);

        assertNotNull(result);
        assertEquals(schedule, result);
        verify(scheduleRepository).update(schedule);
        verify(cacheService).evictCachesForSchedule(1L, 1L, 1L);
    }

    @Test
    void changeRoomForNonGroupedLesson() {
        Semester semester = createSemester(1L);
        Lesson lesson = createLesson(1L, semester, createGroup(1L), createTeacher(1L), false);
        Room oldRoom = createRoom(1L, "Old Room");
        Room newRoom = createRoom(2L, "New Room");
        Schedule schedule = createSchedule(1L, lesson, createPeriod(1L), oldRoom, DayOfWeek.MONDAY, EvenOdd.ODD);
        Schedule updatedSchedule = createSchedule(1L, lesson, createPeriod(1L), newRoom, DayOfWeek.MONDAY, EvenOdd.ODD);
        ScheduleDTO expectedDTO = new ScheduleDTO();
        expectedDTO.setId(1L);

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));
        when(roomRepository.findById(2L)).thenReturn(Optional.of(newRoom));
        when(scheduleRepository.update(schedule)).thenReturn(updatedSchedule);
        when(scheduleMapper.scheduleToScheduleDTO(updatedSchedule)).thenReturn(expectedDTO);

        List<ScheduleDTO> result = scheduleServiceImpl.changeRoom(1L, 2L);

        assertEquals(1, result.size());
        assertEquals(expectedDTO, result.get(0));
        verify(scheduleRepository).update(schedule);
        verify(cacheService).evictCachesForSchedule(1L, 1L, 1L);
    }

    @Test
    void changeRoomForGroupedLesson() {
        Semester semester = createSemester(1L);
        Group group1 = createGroup(1L);
        Group group2 = createGroup(2L);
        Teacher teacher = createTeacher(1L);
        Lesson lesson1 = createLesson(1L, semester, group1, teacher, true);
        Lesson lesson2 = createLesson(2L, semester, group2, teacher, true);
        Room oldRoom = createRoom(1L, "Old Room");
        Room newRoom = createRoom(2L, "New Room");
        Period period = createPeriod(1L);

        Schedule schedule1 = createSchedule(1L, lesson1, period, oldRoom, DayOfWeek.MONDAY, EvenOdd.ODD);
        Schedule schedule2 = createSchedule(2L, lesson2, period, oldRoom, DayOfWeek.MONDAY, EvenOdd.ODD);
        Schedule updated1 = createSchedule(1L, lesson1, period, newRoom, DayOfWeek.MONDAY, EvenOdd.ODD);
        Schedule updated2 = createSchedule(2L, lesson2, period, newRoom, DayOfWeek.MONDAY, EvenOdd.ODD);

        ScheduleDTO dto1 = new ScheduleDTO();
        dto1.setId(1L);
        ScheduleDTO dto2 = new ScheduleDTO();
        dto2.setId(2L);

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule1));
        when(roomRepository.findById(2L)).thenReturn(Optional.of(newRoom));
        when(lessonService.getAllGroupedLessonsByLesson(lesson1)).thenReturn(List.of(lesson1, lesson2));
        when(scheduleRepository.getScheduleByObject(any(Schedule.class)))
                .thenReturn(schedule1)
                .thenReturn(schedule2);
        when(scheduleRepository.update(schedule1)).thenReturn(updated1);
        when(scheduleRepository.update(schedule2)).thenReturn(updated2);
        when(scheduleMapper.scheduleToScheduleDTO(updated1)).thenReturn(dto1);
        when(scheduleMapper.scheduleToScheduleDTO(updated2)).thenReturn(dto2);

        List<ScheduleDTO> result = scheduleServiceImpl.changeRoom(1L, 2L);

        assertEquals(2, result.size());
        verify(scheduleRepository, times(2)).update(any(Schedule.class));
        verify(cacheService, times(2)).evictCachesForSchedule(eq(1L), anyLong(), eq(1L));
    }

    @Test
    void changeRoomReturnsSameWhenRoomUnchanged() {
        Semester semester = createSemester(1L);
        Lesson lesson = createLesson(1L, semester, createGroup(1L), createTeacher(1L), false);
        Room room = createRoom(1L, "Room1");
        Schedule schedule = createSchedule(1L, lesson, createPeriod(1L), room, DayOfWeek.MONDAY, EvenOdd.ODD);
        ScheduleDTO expectedDTO = new ScheduleDTO();
        expectedDTO.setId(1L);

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));
        when(scheduleMapper.scheduleToScheduleDTO(schedule)).thenReturn(expectedDTO);

        List<ScheduleDTO> result = scheduleServiceImpl.changeRoom(1L, 1L);

        assertEquals(1, result.size());
        verify(scheduleRepository, never()).update(any());
        verify(cacheService, never()).evictCachesForSchedule(anyLong(), anyLong(), anyLong());
    }

    @Test
    void deleteScheduleByIdForNonGrouped() {
        Semester semester = createSemester(1L);
        Lesson lesson = createLesson(1L, semester, createGroup(1L), createTeacher(1L), false);
        Schedule schedule = createSchedule(1L, lesson, createPeriod(1L), createRoom(1L, "Room1"), DayOfWeek.MONDAY, EvenOdd.ODD);

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));
        when(scheduleRepository.delete(schedule)).thenReturn(schedule);

        List<Long> result = scheduleServiceImpl.deleteScheduleById(1L);

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0));
        verify(scheduleRepository).delete(schedule);
        verify(cacheService).evictCachesForScheduleWithLessons(1L, 1L, 1L);
    }

    @Test
    void deleteScheduleByIdForGrouped() {
        Semester semester = createSemester(1L);
        Group group1 = createGroup(1L);
        Group group2 = createGroup(2L);
        Teacher teacher = createTeacher(1L);
        Lesson lesson1 = createLesson(1L, semester, group1, teacher, true);
        Lesson lesson2 = createLesson(2L, semester, group2, teacher, true);
        Period period = createPeriod(1L);
        Room room = createRoom(1L, "Room1");

        Schedule schedule1 = createSchedule(1L, lesson1, period, room, DayOfWeek.MONDAY, EvenOdd.ODD);
        Schedule schedule2 = createSchedule(2L, lesson2, period, room, DayOfWeek.MONDAY, EvenOdd.ODD);

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule1));
        when(lessonService.getAllGroupedLessonsByLesson(lesson1)).thenReturn(List.of(lesson1, lesson2));
        when(scheduleRepository.getScheduleByObject(any(Schedule.class)))
                .thenReturn(schedule1)
                .thenReturn(schedule2);
        when(scheduleRepository.delete(any(Schedule.class))).thenAnswer(inv -> inv.getArgument(0));

        List<Long> result = scheduleServiceImpl.deleteScheduleById(1L);

        assertEquals(2, result.size());
        assertTrue(result.containsAll(List.of(1L, 2L)));
        verify(scheduleRepository, times(2)).delete(any(Schedule.class));
        verify(cacheService, times(2)).evictCachesForScheduleWithLessons(eq(1L), anyLong(), eq(1L));
    }

    @Test
    void sendScheduleToTeachers() throws MessagingException {
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setId(10L);
        teacherDTO.setEmail("test@gmail.com");
        teacherDTO.setSurname("Test");
        teacherDTO.setName("Teacher");
        teacherDTO.setPatronymic("T");

        Long[] ids = new Long[]{10L, 20L};

        when(teacherService.getById(anyLong())).thenReturn(teacherDTO);
        SemesterWithGroupsDTO semesterDTO = new SemesterWithGroupsDTO();
        semesterDTO.setDescription("I semester 25/26");
        when(semesterService.getById(anyLong())).thenReturn(semesterDTO);

        when(scheduleRepository.getDaysWhenTeacherHasClassesBySemester(anyLong(), anyLong()))
                .thenReturn(new ArrayList<>(List.of(DayOfWeek.MONDAY)));
        doNothing().when(mailService).send(anyString(), anyString(), anyString(), anyString(), any());

        scheduleServiceImpl.sendScheduleToTeachers(4L, ids, Locale.ENGLISH);

        verify(mailService, times(ids.length)).send(anyString(), anyString(), anyString(), anyString(), any());
    }

    @Test
    void schedulesForGroupedLessons() {
        Semester semester = createSemester(1L);
        Lesson lesson1 = createLesson(1L, semester, createGroup(1L), createTeacher(1L), true);
        Lesson lesson2 = createLesson(2L, semester, createGroup(2L), createTeacher(1L), true);
        Schedule schedule = createSchedule(1L, lesson1, createPeriod(1L), createRoom(1L, "Room1"), DayOfWeek.MONDAY, EvenOdd.ODD);

        when(lessonService.getAllGroupedLessonsByLesson(lesson1)).thenReturn(List.of(lesson1, lesson2));

        List<Schedule> schedules = scheduleServiceImpl.schedulesForGroupedLessons(schedule);

        assertEquals(2, schedules.size());
    }

    @Test
    void getAllOrderedByRoomsDaysPeriods() {
        Room room1 = createRoom(1L, "Room1");
        Room room2 = createRoom(2L, "Room2");

        Schedule schedule1 = new Schedule();
        schedule1.setId(1L);
        schedule1.setEvenOdd(EvenOdd.ODD);
        schedule1.setDayOfWeek(DayOfWeek.MONDAY);
        schedule1.setRoom(room1);

        Schedule schedule2 = new Schedule();
        schedule2.setId(2L);
        schedule2.setEvenOdd(EvenOdd.ODD);
        schedule2.setDayOfWeek(DayOfWeek.MONDAY);
        schedule2.setRoom(room2);

        when(scheduleRepository.getAllOrdered(1L)).thenReturn(List.of(schedule1, schedule2));

        Map<Room, List<Schedule>> expected = new LinkedHashMap<>();
        expected.put(room1, List.of(schedule1));
        expected.put(room2, List.of(schedule2));

        Map<Room, List<Schedule>> actual = scheduleServiceImpl.getAllOrdered(1L);

        assertEquals(expected, actual);
        verify(scheduleRepository).getAllOrdered(1L);
    }
}
