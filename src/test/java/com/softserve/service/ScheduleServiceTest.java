package com.softserve.service;

import com.softserve.dto.*;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.LessonType;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.ScheduleConflictException;
import com.softserve.mapper.*;
import com.softserve.repository.ScheduleRepository;
import com.softserve.service.impl.ScheduleServiceImpl;
import com.softserve.service.impl.SemesterServiceImpl;
import com.softserve.service.impl.TeacherServiceImpl;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(MockitoJUnitRunner.class)
public class ScheduleServiceTest {

    @Mock
    private GroupMapperImpl groupMapper;

    @Mock
    private LessonForTeacherScheduleMapperImpl lessonForTeacherScheduleMapper;

    @Mock
    private SemesterMapperImpl semesterMapper;

    @Mock
    private PeriodMapperImpl periodMapper;

    @Mock
    private TeacherMapperImpl teacherMapper;

    @Mock
    private LessonsInScheduleMapperImpl lessonsInScheduleMapper;

    @Mock
    private RoomForScheduleMapperImpl roomForScheduleMapper;

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private SemesterServiceImpl semesterService;

    @Mock
    private LessonService lessonService;

    @Mock
    private RoomService roomService;

    @Mock
    private GroupService groupService;

    @Mock
    private TeacherServiceImpl teacherService;

    @Mock
    private TeacherWishesService teacherWishesService;

    @InjectMocks
    private ScheduleServiceImpl scheduleService;

    @Test
    public void getById() {
        Schedule expectedSchedule = new Schedule();
        expectedSchedule.setId(1L);
        expectedSchedule.setDayOfWeek(DayOfWeek.MONDAY);
        expectedSchedule.setEvenOdd(EvenOdd.ODD);
        expectedSchedule.setLesson(new Lesson());
        expectedSchedule.setPeriod(new Period());
        expectedSchedule.setRoom(new Room());
        expectedSchedule.setSemester(new Semester());

        doReturn(Optional.of(expectedSchedule)).when(scheduleRepository).findById(1L);

        Schedule actualSchedule = scheduleRepository.findById(1L).get();
        assertNotNull(actualSchedule);
        assertEquals(expectedSchedule, actualSchedule);
        verify(scheduleRepository, times(1)).findById(1L);
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionIfScheduleNotFoundedById() {
        Schedule schedule = new Schedule();
        schedule.setId(1L);

        scheduleService.getById(2L);
        verify(scheduleRepository, times(1)).findById(2L);
    }

    @Test
    public void saveScheduleIfGroupHasNoAnyConflicts() {
        Group group = new Group();
        group.setId(1L);
        Lesson lesson = new Lesson();
        lesson.setGroup(group);
        lesson.setId(1L);
        Semester semester = new Semester();
        semester.setId(1L);
        Period period = new Period();
        period.setId(1L);
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        Room room = new Room();
        room.setId(1L);
        room.setType(roomType);
        Schedule expectedSchedule = new Schedule();
        expectedSchedule.setId(1L);
        expectedSchedule.setDayOfWeek(DayOfWeek.MONDAY);
        expectedSchedule.setEvenOdd(EvenOdd.ODD);
        expectedSchedule.setLesson(lesson);
        expectedSchedule.setPeriod(period);
        expectedSchedule.setRoom(room);
        expectedSchedule.setSemester(semester);

        doReturn(lesson).when(lessonService).getById(1L);
        Long groupId = lessonService.getById(1L).getGroup().getId();
        doReturn(0L).when(scheduleRepository).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                expectedSchedule.getDayOfWeek(),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);
        doReturn(expectedSchedule).when(scheduleRepository).save(expectedSchedule);

        Schedule actualSchedule = scheduleService.save(expectedSchedule);
        assertNotNull(actualSchedule);
        assertEquals(expectedSchedule, actualSchedule);
        verify(lessonService, times(2)).getById(1L);
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                expectedSchedule.getDayOfWeek(),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);
        verify(scheduleRepository, times(1)).save(expectedSchedule);
    }

    @Test(expected = ScheduleConflictException.class)
    public void throwScheduleConflictExceptionIfSaveScheduleForGroupWithConflicts() {
        Group group = new Group();
        group.setId(1L);
        Lesson lesson = new Lesson();
        lesson.setGroup(group);
        lesson.setId(1L);
        Semester semester = new Semester();
        semester.setId(1L);
        Period period = new Period();
        period.setId(1L);
        Room room = new Room();
        room.setId(1L);
        Schedule expectedSchedule = new Schedule();
        expectedSchedule.setId(1L);
        expectedSchedule.setDayOfWeek(DayOfWeek.MONDAY);
        expectedSchedule.setEvenOdd(EvenOdd.ODD);
        expectedSchedule.setLesson(lesson);
        expectedSchedule.setPeriod(period);
        expectedSchedule.setRoom(room);
        expectedSchedule.setSemester(semester);

        doReturn(lesson).when(lessonService).getById(1L);
        Long groupId = lessonService.getById(1L).getGroup().getId();
        doReturn(1L).when(scheduleRepository).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                expectedSchedule.getDayOfWeek(),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);

        scheduleService.save(expectedSchedule);
        verify(lessonService, times(2)).getById(1L);
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                expectedSchedule.getDayOfWeek(),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);
    }

    @Test
    public void updateScheduleIfGroupHasNoConflicts() {
        Group oldGroup = new Group();
        oldGroup.setId(1L);
        Lesson oldLesson = new Lesson();
        oldLesson.setGroup(oldGroup);
        oldLesson.setId(1L);
        Semester oldSemester = new Semester();
        oldSemester.setId(1L);
        Period oldPeriod = new Period();
        oldPeriod.setId(1L);
        RoomType oldRoomType = new RoomType();
        oldRoomType.setId(1L);
        Room oldRoom = new Room();
        oldRoom.setId(1L);
        oldRoom.setType(oldRoomType);
        Schedule oldSchedule = new Schedule();
        oldSchedule.setId(1L);
        oldSchedule.setDayOfWeek(DayOfWeek.MONDAY);
        oldSchedule.setEvenOdd(EvenOdd.ODD);
        oldSchedule.setLesson(oldLesson);
        oldSchedule.setPeriod(oldPeriod);
        oldSchedule.setRoom(oldRoom);
        oldSchedule.setSemester(oldSemester);

        Group group = new Group();
        group.setId(2L);
        Lesson lesson = new Lesson();
        lesson.setGroup(group);
        lesson.setId(2L);
        Semester semester = new Semester();
        semester.setId(2L);
        Period period = new Period();
        period.setId(2L);
        RoomType roomType = new RoomType();
        roomType.setId(2L);
        Room room = new Room();
        room.setId(2L);
        room.setType(roomType);
        Schedule expectedSchedule = new Schedule();
        expectedSchedule.setId(1L);
        expectedSchedule.setDayOfWeek(DayOfWeek.TUESDAY);
        expectedSchedule.setEvenOdd(EvenOdd.EVEN);
        expectedSchedule.setLesson(lesson);
        expectedSchedule.setPeriod(period);
        expectedSchedule.setRoom(room);
        expectedSchedule.setSemester(semester);

        doReturn(lesson).when(lessonService).getById(2L);
        Long groupId = lessonService.getById(2L).getGroup().getId();
        doReturn(0L).when(scheduleRepository).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                expectedSchedule.getDayOfWeek(),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);
        doReturn(expectedSchedule).when(scheduleRepository).update(expectedSchedule);

        oldSchedule = scheduleService.update(expectedSchedule);
        assertNotNull(oldSchedule);
        assertEquals(expectedSchedule, oldSchedule);
        verify(lessonService, times(2)).getById(2L);
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                expectedSchedule.getDayOfWeek(),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);
        verify(scheduleRepository, times(1)).update(expectedSchedule);
    }

    @Test(expected = ScheduleConflictException.class)
    public void throwScheduleConflictExceptionIfUpdateScheduleForGroupWithConflicts() {
        Group oldGroup = new Group();
        oldGroup.setId(1L);
        Lesson oldLesson = new Lesson();
        oldLesson.setGroup(oldGroup);
        oldLesson.setId(1L);
        Semester oldSemester = new Semester();
        oldSemester.setId(1L);
        Period oldPeriod = new Period();
        oldPeriod.setId(1L);
        RoomType oldRoomType = new RoomType();
        oldRoomType.setId(1L);
        Room oldRoom = new Room();
        oldRoom.setId(1L);
        oldRoom.setType(oldRoomType);
        Schedule oldSchedule = new Schedule();
        oldSchedule.setId(1L);
        oldSchedule.setDayOfWeek(DayOfWeek.MONDAY);
        oldSchedule.setEvenOdd(EvenOdd.ODD);
        oldSchedule.setLesson(oldLesson);
        oldSchedule.setPeriod(oldPeriod);
        oldSchedule.setRoom(oldRoom);
        oldSchedule.setSemester(oldSemester);

        Group group = new Group();
        group.setId(2L);
        Lesson lesson = new Lesson();
        lesson.setGroup(group);
        lesson.setId(2L);
        Semester semester = new Semester();
        semester.setId(2L);
        Period period = new Period();
        period.setId(2L);
        RoomType roomType = new RoomType();
        roomType.setId(2L);
        Room room = new Room();
        room.setId(2L);
        room.setType(roomType);
        Schedule expectedSchedule = new Schedule();
        expectedSchedule.setId(1L);
        expectedSchedule.setDayOfWeek(DayOfWeek.TUESDAY);
        expectedSchedule.setEvenOdd(EvenOdd.EVEN);
        expectedSchedule.setLesson(lesson);
        expectedSchedule.setPeriod(period);
        expectedSchedule.setRoom(room);
        expectedSchedule.setSemester(semester);

        doReturn(lesson).when(lessonService).getById(2L);
        Long groupId = lessonService.getById(2L).getGroup().getId();
        doReturn(1L).when(scheduleRepository).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                expectedSchedule.getDayOfWeek(),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);

        oldSchedule = scheduleService.update(expectedSchedule);
        assertNotNull(oldSchedule);
        assertEquals(expectedSchedule, oldSchedule);
        verify(lessonService, times(2)).getById(2L);
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                expectedSchedule.getDayOfWeek(),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);
    }

    @Test
    public void returnFalseIfGroupHasNoConflicts() {
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
    public void returnTrueIfGroupHasConflicts() {
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
    public void returnTrueIfTeacherIsAvailable() {
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
    public void returnFalseIfTeacherIsNotAvailable() {
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
    public void getInfoForCreatingScheduleIfNothingAlreadyExist() {
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
        RoomTypeDTO laboratory = new RoomTypeDTO();
        laboratory.setId(1L);
        laboratory.setDescription("Laboratory");
        RoomTypeDTO practical = new RoomTypeDTO();
        practical.setId(2L);
        practical.setDescription("Practical");
        List<RoomForScheduleInfoDTO> allRooms = new ArrayList<RoomForScheduleInfoDTO>() {{
            add(new RoomForScheduleInfoDTO() {{
                setId(1L);
                setName("free name");
                setType(laboratory);
                setAvailable(true);
            }});
            add(new RoomForScheduleInfoDTO() {{
                setId(2L);
                setName("occupied name");
                setType(practical);
                setAvailable(false);
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
        doReturn(true).when(teacherWishesService).isClassSuits(teacherId, dayOfWeek, evenOdd, classId);
        doReturn(0L).when(scheduleRepository).conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId);
        doReturn(allRooms).when(roomService).getAllRoomsForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId);

        CreateScheduleInfoDTO actualDTO = scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId, lessonId);
        assertEquals(expectedDTO.isClassSuitsToTeacher(), actualDTO.isClassSuitsToTeacher());
        assertEquals(expectedDTO.isTeacherAvailable(), actualDTO.isTeacherAvailable());
        assertEquals(expectedDTO.getRooms().size(), actualDTO.getRooms().size());
        assertEquals(expectedDTO.getRooms().get(0), actualDTO.getRooms().get(0));
        assertEquals(expectedDTO.getRooms().get(1), actualDTO.getRooms().get(1));
        verify(lessonService, times(5)).getById(anyLong());
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
        verify(scheduleRepository, times(1)).conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId);
    }

    @Test(expected = ScheduleConflictException.class)
    public void throwScheduleConflictExceptionIfGroupHasConflicts() {
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

        scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
        verify(lessonService, times(1)).getById(anyLong());
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
    }

    @Test
    public void getScheduleForGroup() {
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setCurrentSemester(true);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        semester.setYear(2020);
        semester.setDaysOfWeek(dayOfWeeks);
        Group group = new Group();
        group.setId(1L);
        group.setTitle("111");
        List<DayOfWeek> dayOfWeekList = new ArrayList<>();
        dayOfWeekList.add(DayOfWeek.MONDAY);
        Period firstClasses = new Period();
        firstClasses.setId(1L);
        firstClasses.setName("1 para");
        firstClasses.setStartTime(LocalTime.parse("02:00:00"));
        firstClasses.setEndTime(LocalTime.parse("03:00:00"));
        Period secondClasses = new Period();
        secondClasses.setId(2L);
        secondClasses.setName("2 para");
        secondClasses.setStartTime(LocalTime.parse("04:00:00"));
        secondClasses.setEndTime(LocalTime.parse("05:00:00"));
        Set<Period> periodSet = new HashSet<>();
        periodSet.add(firstClasses);
        periodSet.add(secondClasses);
        semester.setPeriods(periodSet);
        List<Period> periodList = new ArrayList<>();
        periodList.add(firstClasses);
        periodList.add(secondClasses);
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setUserId(1);
        teacher.setName("Ivan");
        teacher.setSurname("Ivanov");
        teacher.setPatronymic("Ivanovych");
        teacher.setPosition("Docent");
        Subject biologySubject = new Subject();
        biologySubject.setId(1L);
        biologySubject.setName("Biology");
        Subject astronomySubject = new Subject();
        astronomySubject.setId(2L);
        astronomySubject.setName("Astronomy");
        Lesson biology = new Lesson();
        biology.setId(1L);
        biology.setGroup(group);
        biology.setTeacher(teacher);
        biology.setSubject(biologySubject);
        biology.setHours(1);
        biology.setLessonType(LessonType.LABORATORY);
        biology.setSubjectForSite("FIRST SUBJECT");
        biology.setTeacherForSite("Ivanov I.I.");
        Lesson astronomy = new Lesson();
        astronomy.setId(2L);
        astronomy.setHours(2);
        astronomy.setTeacherForSite("Petrov P.P.");
        astronomy.setSubjectForSite("SECOND SUBJECT");
        astronomy.setGroup(group);
        astronomy.setLessonType(LessonType.PRACTICAL);
        astronomy.setSubject(astronomySubject);
        astronomy.setTeacher(teacher);
        RoomType laboratoryType = new RoomType();
        laboratoryType.setId(1L);
        laboratoryType.setDescription("Laboratory");
        RoomType practicalType = new RoomType();
        practicalType.setId(2L);
        practicalType.setDescription("practical");
        Room laboratory = new Room();
        laboratory.setId(1L);
        laboratory.setType(laboratoryType);
        laboratory.setName("Laboratory Room");
        Room practical = new Room();
        practical.setId(2L);
        practical.setName("Practical Room");
        practical.setType(practicalType);

        RoomForScheduleDTO laboratoryDTO = new RoomForScheduleDTO();
        laboratoryDTO.setId(laboratory.getId());
        laboratoryDTO.setName(laboratory.getName());
        LessonsInScheduleDTO firstLesson = new LessonsInScheduleDTO();
        firstLesson.setLessonType("LABORATORY");
        firstLesson.setRoom(laboratoryDTO);
        firstLesson.setSubjectForSite("FIRST SUBJECT");
        firstLesson.setTeacherForSite("Ivanov I.I.");
        RoomForScheduleDTO practicalDTO = new RoomForScheduleDTO();
        practicalDTO.setId(practical.getId());
        practicalDTO.setName(practical.getName());
        LessonsInScheduleDTO secondLesson = new LessonsInScheduleDTO();
        secondLesson.setLessonType("PRACTICAL");
        secondLesson.setRoom(practicalDTO);
        secondLesson.setSubjectForSite("SECOND SUBJECT");
        secondLesson.setTeacherForSite("Petrov P.P.");
        LessonInScheduleByWeekDTO lessonInScheduleByWeekDTO = new LessonInScheduleByWeekDTO();
        lessonInScheduleByWeekDTO.setEven(firstLesson);
        lessonInScheduleByWeekDTO.setOdd(secondLesson);
        PeriodDTO firstPeriodDTO = new PeriodDTO();
        firstPeriodDTO.setName(firstClasses.getName());
        firstPeriodDTO.setId(firstClasses.getId());
        firstPeriodDTO.setStartTime(firstClasses.getStartTime());
        firstPeriodDTO.setEndTime(firstClasses.getEndTime());
        PeriodDTO secondPeriodDTO = new PeriodDTO();
        secondPeriodDTO.setName(secondClasses.getName());
        secondPeriodDTO.setId(secondClasses.getId());
        secondPeriodDTO.setStartTime(secondClasses.getStartTime());
        secondPeriodDTO.setEndTime(secondClasses.getEndTime());
        ClassesInScheduleForGroupDTO classes = new ClassesInScheduleForGroupDTO();
        classes.setPeriod(secondPeriodDTO);
        classes.setWeeks(lessonInScheduleByWeekDTO);
        ClassesInScheduleForGroupDTO classes1 = new ClassesInScheduleForGroupDTO();
        classes1.setPeriod(firstPeriodDTO);
        classes1.setWeeks(lessonInScheduleByWeekDTO);
        List<ClassesInScheduleForGroupDTO> inScheduleDTOS = new ArrayList<>();
        inScheduleDTOS.add(classes1);
        inScheduleDTOS.add(classes);
        DaysOfWeekWithClassesForGroupDTO days = new DaysOfWeekWithClassesForGroupDTO();
        days.setDay(DayOfWeek.MONDAY);
        days.setClasses(inScheduleDTOS);
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setTitle(group.getTitle());
        groupDTO.setId(group.getId());
        List<DaysOfWeekWithClassesForGroupDTO> daysOfWeekWithClassesDTOList = new ArrayList<>();
        daysOfWeekWithClassesDTOList.add(days);
        ScheduleForGroupDTO scheduleForGroupDTO = new ScheduleForGroupDTO();
        scheduleForGroupDTO.setGroup(groupDTO);
        scheduleForGroupDTO.setDays(daysOfWeekWithClassesDTOList);
        List<ScheduleForGroupDTO> scheduleForGroupDTOList = new ArrayList<>();
        scheduleForGroupDTOList.add(scheduleForGroupDTO);

        when(scheduleRepository.countSchedulesForGroupInSemester(semester.getId(), group.getId())).thenReturn(1L);
        when(groupService.getById(1L)).thenReturn(group);
        when(scheduleRepository.getDaysWhenGroupHasClassesBySemester(semester.getId(), group.getId())).thenReturn(dayOfWeekList);
        when(scheduleRepository.periodsForGroupByDayBySemester(semester.getId(), group.getId(), DayOfWeek.MONDAY)).thenReturn(periodList);
        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), group.getId(), firstClasses.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(Optional.of(biology));
        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), group.getId(), firstClasses.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(Optional.of(astronomy));
        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), group.getId(), secondClasses.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(Optional.of(biology));
        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), group.getId(), secondClasses.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(Optional.of(astronomy));
        when(scheduleRepository.getRoomForLesson(semester.getId(), firstClasses.getId(), biology.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(laboratory);
        when(scheduleRepository.getRoomForLesson(semester.getId(), firstClasses.getId(), astronomy.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(practical);
        when(scheduleRepository.getRoomForLesson(semester.getId(), secondClasses.getId(), biology.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(laboratory);
        when(scheduleRepository.getRoomForLesson(semester.getId(), secondClasses.getId(), astronomy.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(practical);
        when(groupMapper.groupToGroupDTO(group)).thenReturn(groupDTO);
        when(periodMapper.convertToDto(firstClasses)).thenReturn(firstPeriodDTO);
        when(periodMapper.convertToDto(secondClasses)).thenReturn(secondPeriodDTO);
        when(lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(biology)).thenReturn(firstLesson);
        when(lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(astronomy)).thenReturn(secondLesson);
        when(roomForScheduleMapper.roomToRoomForScheduleDTO(laboratory)).thenReturn(laboratoryDTO);
        when(roomForScheduleMapper.roomToRoomForScheduleDTO(practical)).thenReturn(practicalDTO);

        List<ScheduleForGroupDTO> forGroupDTOList = scheduleService.getFullScheduleForGroup(semester.getId(), group.getId());
        assertNotNull(forGroupDTOList);
        assertEquals(scheduleForGroupDTOList, forGroupDTOList);
    }

    @Test
    public void getFullScheduleForAllGroups() {
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setCurrentSemester(true);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        semester.setYear(2020);
        semester.setDaysOfWeek(dayOfWeeks);
        Group group = new Group();
        group.setTitle("111");
        Group groupInList = new Group();
        groupInList.setId(1L);
        groupInList.setTitle("222");
        List<Group> groupList = new ArrayList<>();
        groupList.add(groupInList);
        List<DayOfWeek> dayOfWeekList = new ArrayList<>();
        dayOfWeekList.add(DayOfWeek.MONDAY);
        Period firstClasses = new Period();
        firstClasses.setId(1L);
        firstClasses.setName("1 para");
        firstClasses.setStartTime(LocalTime.parse("02:00:00"));
        firstClasses.setEndTime(LocalTime.parse("03:00:00"));
        Period secondClasses = new Period();
        secondClasses.setId(2L);
        secondClasses.setName("2 para");
        secondClasses.setStartTime(LocalTime.parse("04:00:00"));
        secondClasses.setEndTime(LocalTime.parse("05:00:00"));
        Set<Period> periodSet = new HashSet<>();
        periodSet.add(firstClasses);
        periodSet.add(secondClasses);
        semester.setPeriods(periodSet);
        List<Period> periodList = new ArrayList<>();
        periodList.add(firstClasses);
        periodList.add(secondClasses);
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setUserId(1);
        teacher.setName("Ivan");
        teacher.setSurname("Ivanov");
        teacher.setPatronymic("Ivanovych");
        teacher.setPosition("Docent");
        Subject biologySubject = new Subject();
        biologySubject.setId(1L);
        biologySubject.setName("Biology");
        Subject astronomySubject = new Subject();
        astronomySubject.setId(2L);
        astronomySubject.setName("Astronomy");
        Lesson biology = new Lesson();
        biology.setId(1L);
        biology.setGroup(groupInList);
        biology.setTeacher(teacher);
        biology.setSubject(biologySubject);
        biology.setHours(1);
        biology.setLessonType(LessonType.LABORATORY);
        biology.setSubjectForSite("FIRST SUBJECT");
        biology.setTeacherForSite("Ivanov I.I.");
        Lesson astronomy = new Lesson();
        astronomy.setId(2L);
        astronomy.setHours(2);
        astronomy.setTeacherForSite("Petrov P.P.");
        astronomy.setSubjectForSite("SECOND SUBJECT");
        astronomy.setGroup(groupInList);
        astronomy.setLessonType(LessonType.PRACTICAL);
        astronomy.setSubject(astronomySubject);
        astronomy.setTeacher(teacher);
        RoomType laboratoryType = new RoomType();
        laboratoryType.setId(1L);
        laboratoryType.setDescription("Laboratory");
        RoomType practicalType = new RoomType();
        practicalType.setId(2L);
        practicalType.setDescription("practical");
        Room laboratory = new Room();
        laboratory.setId(1L);
        laboratory.setType(laboratoryType);
        laboratory.setName("Laboratory Room");
        Room practical = new Room();
        practical.setId(2L);
        practical.setName("Practical Room");
        practical.setType(practicalType);

        RoomForScheduleDTO laboratoryDTO = new RoomForScheduleDTO();
        laboratoryDTO.setId(laboratory.getId());
        laboratoryDTO.setName(laboratory.getName());
        LessonsInScheduleDTO firstLesson = new LessonsInScheduleDTO();
        firstLesson.setLessonType("LABORATORY");
        firstLesson.setRoom(laboratoryDTO);
        firstLesson.setSubjectForSite("FIRST SUBJECT");
        firstLesson.setTeacherForSite("Ivanov I.I.");
        RoomForScheduleDTO practicalDTO = new RoomForScheduleDTO();
        practicalDTO.setId(practical.getId());
        practicalDTO.setName(practical.getName());
        LessonsInScheduleDTO secondLesson = new LessonsInScheduleDTO();
        secondLesson.setLessonType("PRACTICAL");
        secondLesson.setRoom(practicalDTO);
        secondLesson.setSubjectForSite("SECOND SUBJECT");
        secondLesson.setTeacherForSite("Petrov P.P.");
        LessonInScheduleByWeekDTO lessonInScheduleByWeekDTO = new LessonInScheduleByWeekDTO();
        lessonInScheduleByWeekDTO.setEven(firstLesson);
        lessonInScheduleByWeekDTO.setOdd(secondLesson);
        PeriodDTO firstPeriodDTO = new PeriodDTO();
        firstPeriodDTO.setName(firstClasses.getName());
        firstPeriodDTO.setId(firstClasses.getId());
        firstPeriodDTO.setStartTime(firstClasses.getStartTime());
        firstPeriodDTO.setEndTime(firstClasses.getEndTime());
        PeriodDTO secondPeriodDTO = new PeriodDTO();
        secondPeriodDTO.setName(secondClasses.getName());
        secondPeriodDTO.setId(secondClasses.getId());
        secondPeriodDTO.setStartTime(secondClasses.getStartTime());
        secondPeriodDTO.setEndTime(secondClasses.getEndTime());
        ClassesInScheduleForGroupDTO classes = new ClassesInScheduleForGroupDTO();
        classes.setPeriod(secondPeriodDTO);
        classes.setWeeks(lessonInScheduleByWeekDTO);
        ClassesInScheduleForGroupDTO classes1 = new ClassesInScheduleForGroupDTO();
        classes1.setPeriod(firstPeriodDTO);
        classes1.setWeeks(lessonInScheduleByWeekDTO);
        List<ClassesInScheduleForGroupDTO> inScheduleDTOS = new ArrayList<>();
        inScheduleDTOS.add(classes1);
        inScheduleDTOS.add(classes);
        DaysOfWeekWithClassesForGroupDTO days = new DaysOfWeekWithClassesForGroupDTO();
        days.setDay(DayOfWeek.MONDAY);
        days.setClasses(inScheduleDTOS);
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setTitle(groupInList.getTitle());
        groupDTO.setId(groupInList.getId());
        List<DaysOfWeekWithClassesForGroupDTO> daysOfWeekWithClassesDTOList = new ArrayList<>();
        daysOfWeekWithClassesDTOList.add(days);
        ScheduleForGroupDTO scheduleForGroupDTO = new ScheduleForGroupDTO();
        scheduleForGroupDTO.setGroup(groupDTO);
        scheduleForGroupDTO.setDays(daysOfWeekWithClassesDTOList);
        List<ScheduleForGroupDTO> scheduleForGroupDTOList = new ArrayList<>();
        scheduleForGroupDTOList.add(scheduleForGroupDTO);

        when(scheduleRepository.uniqueGroupsInScheduleBySemester(semester.getId())).thenReturn(groupList);
        when(scheduleRepository.getDaysWhenGroupHasClassesBySemester(semester.getId(), groupInList.getId())).thenReturn(dayOfWeekList);
        when(scheduleRepository.periodsForGroupByDayBySemester(semester.getId(), groupInList.getId(), DayOfWeek.MONDAY)).thenReturn(periodList);
        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), groupInList.getId(), firstClasses.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(Optional.of(biology));
        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), groupInList.getId(), firstClasses.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(Optional.of(astronomy));
        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), groupInList.getId(), secondClasses.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(Optional.of(biology));
        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), groupInList.getId(), secondClasses.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(Optional.of(astronomy));
        when(scheduleRepository.getRoomForLesson(semester.getId(), firstClasses.getId(), biology.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(laboratory);
        when(scheduleRepository.getRoomForLesson(semester.getId(), firstClasses.getId(), astronomy.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(practical);
        when(scheduleRepository.getRoomForLesson(semester.getId(), secondClasses.getId(), biology.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(laboratory);
        when(scheduleRepository.getRoomForLesson(semester.getId(), secondClasses.getId(), astronomy.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(practical);
        when(groupMapper.groupToGroupDTO(groupInList)).thenReturn(groupDTO);
        when(periodMapper.convertToDto(firstClasses)).thenReturn(firstPeriodDTO);
        when(periodMapper.convertToDto(secondClasses)).thenReturn(secondPeriodDTO);
        when(lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(biology)).thenReturn(firstLesson);
        when(lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(astronomy)).thenReturn(secondLesson);
        when(roomForScheduleMapper.roomToRoomForScheduleDTO(laboratory)).thenReturn(laboratoryDTO);
        when(roomForScheduleMapper.roomToRoomForScheduleDTO(practical)).thenReturn(practicalDTO);

        List<ScheduleForGroupDTO> forGroupDTOList = scheduleService.getFullScheduleForGroup(semester.getId(), group.getId());
        assertNotNull(forGroupDTOList);
        assertEquals(scheduleForGroupDTOList, forGroupDTOList);
    }

    @Test
    public void getFullScheduleForSemester() {
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setCurrentSemester(true);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        semester.setYear(2020);
        semester.setDaysOfWeek(dayOfWeeks);
        Group group = new Group();
        group.setId(1L);
        group.setTitle("111");
        List<Group> groupList = new ArrayList<>();
        groupList.add(group);
        List<DayOfWeek> dayOfWeekList = new ArrayList<>();
        dayOfWeekList.add(DayOfWeek.MONDAY);
        Period firstClasses = new Period();
        firstClasses.setId(1L);
        firstClasses.setName("1 para");
        firstClasses.setStartTime(LocalTime.parse("02:00:00"));
        firstClasses.setEndTime(LocalTime.parse("03:00:00"));
        Period secondClasses = new Period();
        secondClasses.setId(2L);
        secondClasses.setName("2 para");
        secondClasses.setStartTime(LocalTime.parse("04:00:00"));
        secondClasses.setEndTime(LocalTime.parse("05:00:00"));
        List<Period> periodList = new ArrayList<>();
        periodList.add(firstClasses);
        periodList.add(secondClasses);
        Set<Period> periodSet = new HashSet<>();
        periodSet.add(firstClasses);
        periodSet.add(secondClasses);
        semester.setPeriods(periodSet);
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setUserId(1);
        teacher.setName("Ivan");
        teacher.setSurname("Ivanov");
        teacher.setPatronymic("Ivanovych");
        teacher.setPosition("Docent");
        Subject biologySubject = new Subject();
        biologySubject.setId(1L);
        biologySubject.setName("Biology");
        Subject astronomySubject = new Subject();
        astronomySubject.setId(2L);
        astronomySubject.setName("Astronomy");
        Lesson biology = new Lesson();
        biology.setId(1L);
        biology.setGroup(group);
        biology.setTeacher(teacher);
        biology.setSubject(biologySubject);
        biology.setHours(1);
        biology.setLessonType(LessonType.LABORATORY);
        biology.setSubjectForSite("FIRST SUBJECT");
        biology.setTeacherForSite("Ivanov I.I.");
        Lesson astronomy = new Lesson();
        astronomy.setId(2L);
        astronomy.setHours(2);
        astronomy.setTeacherForSite("Petrov P.P.");
        astronomy.setSubjectForSite("SECOND SUBJECT");
        astronomy.setGroup(group);
        astronomy.setLessonType(LessonType.PRACTICAL);
        astronomy.setSubject(astronomySubject);
        astronomy.setTeacher(teacher);
        RoomType laboratoryType = new RoomType();
        laboratoryType.setId(1L);
        laboratoryType.setDescription("Laboratory");
        RoomType practicalType = new RoomType();
        practicalType.setId(2L);
        practicalType.setDescription("practical");
        Room laboratory = new Room();
        laboratory.setId(1L);
        laboratory.setType(laboratoryType);
        laboratory.setName("Laboratory Room");
        Room practical = new Room();
        practical.setId(2L);
        practical.setName("Practical Room");
        practical.setType(practicalType);

        RoomForScheduleDTO laboratoryDTO = new RoomForScheduleDTO();
        laboratoryDTO.setId(laboratory.getId());
        laboratoryDTO.setName(laboratory.getName());
        LessonsInScheduleDTO firstLesson = new LessonsInScheduleDTO();
        firstLesson.setLessonType("LABORATORY");
        firstLesson.setRoom(laboratoryDTO);
        firstLesson.setSubjectForSite("FIRST SUBJECT");
        firstLesson.setTeacherForSite("Ivanov I.I.");
        RoomForScheduleDTO practicalDTO = new RoomForScheduleDTO();
        practicalDTO.setId(practical.getId());
        practicalDTO.setName(practical.getName());
        LessonsInScheduleDTO secondLesson = new LessonsInScheduleDTO();
        secondLesson.setLessonType("PRACTICAL");
        secondLesson.setRoom(practicalDTO);
        secondLesson.setSubjectForSite("SECOND SUBJECT");
        secondLesson.setTeacherForSite("Petrov P.P.");
        LessonInScheduleByWeekDTO lessonInScheduleByWeekDTO = new LessonInScheduleByWeekDTO();
        lessonInScheduleByWeekDTO.setEven(firstLesson);
        lessonInScheduleByWeekDTO.setOdd(secondLesson);
        PeriodDTO firstPeriodDTO = new PeriodDTO();
        firstPeriodDTO.setName(firstClasses.getName());
        firstPeriodDTO.setId(firstClasses.getId());
        firstPeriodDTO.setStartTime(firstClasses.getStartTime());
        firstPeriodDTO.setEndTime(firstClasses.getEndTime());
        PeriodDTO secondPeriodDTO = new PeriodDTO();
        secondPeriodDTO.setName(secondClasses.getName());
        secondPeriodDTO.setId(secondClasses.getId());
        secondPeriodDTO.setStartTime(secondClasses.getStartTime());
        secondPeriodDTO.setEndTime(secondClasses.getEndTime());
        ClassesInScheduleForGroupDTO classes = new ClassesInScheduleForGroupDTO();
        classes.setPeriod(secondPeriodDTO);
        classes.setWeeks(lessonInScheduleByWeekDTO);
        ClassesInScheduleForGroupDTO classes1 = new ClassesInScheduleForGroupDTO();
        classes1.setPeriod(firstPeriodDTO);
        classes1.setWeeks(lessonInScheduleByWeekDTO);
        List<ClassesInScheduleForGroupDTO> inScheduleDTOS = new ArrayList<>();
        inScheduleDTOS.add(classes);
        inScheduleDTOS.add(classes1);
        DaysOfWeekWithClassesForGroupDTO days = new DaysOfWeekWithClassesForGroupDTO();
        days.setDay(DayOfWeek.MONDAY);
        days.setClasses(inScheduleDTOS);
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setTitle(group.getTitle());
        groupDTO.setId(group.getId());
        List<DaysOfWeekWithClassesForGroupDTO> daysOfWeekWithClassesDTOList = new ArrayList<>();
        daysOfWeekWithClassesDTOList.add(days);
        ScheduleForGroupDTO scheduleForGroupDTO = new ScheduleForGroupDTO();
        scheduleForGroupDTO.setGroup(groupDTO);
        scheduleForGroupDTO.setDays(daysOfWeekWithClassesDTOList);
        List<ScheduleForGroupDTO> scheduleForGroupDTOList = new ArrayList<>();
        scheduleForGroupDTOList.add(scheduleForGroupDTO);

        LinkedHashSet<PeriodDTO> periodDTOSet = new LinkedHashSet<>();
        periodDTOSet.add(secondPeriodDTO);
        periodDTOSet.add(firstPeriodDTO);
        SemesterDTO semesterDTO = new SemesterDTO();
        semesterDTO.setId(semester.getId());
        semesterDTO.setDescription(semester.getDescription());
        semesterDTO.setStartDay(semester.getStartDay());
        semesterDTO.setEndDay(semester.getEndDay());
        semesterDTO.setYear(2020);
        semesterDTO.setCurrentSemester(true);
        semesterDTO.setPeriods(periodDTOSet);
        semesterDTO.setDaysOfWeek(dayOfWeeks);
        ScheduleFullDTO scheduleFullDTO = new ScheduleFullDTO();
        scheduleFullDTO.setSchedule(scheduleForGroupDTOList);
        scheduleFullDTO.setSemester(semesterDTO);

        when(semesterService.getById(semester.getId())).thenReturn(semester);
        when(scheduleRepository.uniqueGroupsInScheduleBySemester(semester.getId())).thenReturn(groupList);
        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), group.getId(), firstClasses.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(Optional.of(biology));
        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), group.getId(), firstClasses.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(Optional.of(astronomy));
        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), group.getId(), secondClasses.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(Optional.of(biology));
        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), group.getId(), secondClasses.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(Optional.of(astronomy));
        when(scheduleRepository.getRoomForLesson(semester.getId(), firstClasses.getId(), biology.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(laboratory);
        when(scheduleRepository.getRoomForLesson(semester.getId(), firstClasses.getId(), astronomy.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(practical);
        when(scheduleRepository.getRoomForLesson(semester.getId(), secondClasses.getId(), biology.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(laboratory);
        when(scheduleRepository.getRoomForLesson(semester.getId(), secondClasses.getId(), astronomy.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(practical);
        when(groupMapper.groupToGroupDTO(group)).thenReturn(groupDTO);
        when(periodMapper.convertToDto(firstClasses)).thenReturn(firstPeriodDTO);
        when(periodMapper.convertToDto(secondClasses)).thenReturn(secondPeriodDTO);
        when(lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(biology)).thenReturn(firstLesson);
        when(lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(astronomy)).thenReturn(secondLesson);
        when(roomForScheduleMapper.roomToRoomForScheduleDTO(laboratory)).thenReturn(laboratoryDTO);
        when(roomForScheduleMapper.roomToRoomForScheduleDTO(practical)).thenReturn(practicalDTO);

        ScheduleFullDTO result = scheduleService.getFullScheduleForSemester(semester.getId());
        assertNotNull(result);
        assertEquals(scheduleFullDTO, result);
    }

    @Test
    public void getScheduleForTeacher() {
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setCurrentSemester(true);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        semester.setYear(2020);
        semester.setDaysOfWeek(dayOfWeeks);
        Group group = new Group();
        group.setId(1L);
        group.setTitle("111");
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(group.getId());
        groupDTO.setTitle(group.getTitle());
        List<DayOfWeek> dayOfWeekList = new ArrayList<>();
        dayOfWeekList.add(DayOfWeek.MONDAY);
        Period firstClasses = new Period();
        firstClasses.setId(1L);
        firstClasses.setName("1 para");
        firstClasses.setStartTime(LocalTime.parse("02:00:00"));
        firstClasses.setEndTime(LocalTime.parse("03:00:00"));
        Period secondClasses = new Period();
        secondClasses.setId(2L);
        secondClasses.setName("2 para");
        secondClasses.setStartTime(LocalTime.parse("04:00:00"));
        secondClasses.setEndTime(LocalTime.parse("05:00:00"));
        List<Period> evenPeriodList = new ArrayList<>();
        evenPeriodList.add(firstClasses);
        List<Period> oddPeriodList = new ArrayList<>();
        oddPeriodList.add(secondClasses);
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setUserId(1);
        teacher.setName("Ivan");
        teacher.setSurname("Ivanov");
        teacher.setPatronymic("Ivanovych");
        teacher.setPosition("Docent");
        Subject biologySubject = new Subject();
        biologySubject.setId(1L);
        biologySubject.setName("Biology");
        Subject astronomySubject = new Subject();
        astronomySubject.setId(2L);
        astronomySubject.setName("Astronomy");
        Lesson biology = new Lesson();
        biology.setId(1L);
        biology.setGroup(group);
        biology.setTeacher(teacher);
        biology.setSubject(biologySubject);
        biology.setHours(1);
        biology.setLessonType(LessonType.LABORATORY);
        biology.setSubjectForSite("FIRST SUBJECT");
        biology.setTeacherForSite("Ivanov I.I.");
        List<Lesson> evenLessons = new ArrayList<>();
        evenLessons.add(biology);
        Lesson astronomy = new Lesson();
        astronomy.setId(2L);
        astronomy.setHours(2);
        astronomy.setTeacherForSite("Petrov P.P.");
        astronomy.setSubjectForSite("SECOND SUBJECT");
        astronomy.setGroup(group);
        astronomy.setLessonType(LessonType.PRACTICAL);
        astronomy.setSubject(astronomySubject);
        astronomy.setTeacher(teacher);
        List<Lesson> oddLessons = new ArrayList<>();
        oddLessons.add(astronomy);
        RoomType laboratoryType = new RoomType();
        laboratoryType.setId(1L);
        laboratoryType.setDescription("Laboratory");
        RoomType practicalType = new RoomType();
        practicalType.setId(2L);
        practicalType.setDescription("practical");
        Room laboratory = new Room();
        laboratory.setId(1L);
        laboratory.setType(laboratoryType);
        laboratory.setName("Laboratory Room");
        Room practical = new Room();
        practical.setId(2L);
        practical.setName("Practical Room");
        practical.setType(practicalType);
        RoomForScheduleDTO laboratoryDTO = new RoomForScheduleDTO();
        laboratoryDTO.setId(laboratory.getId());
        laboratoryDTO.setName(laboratory.getName());
        PeriodDTO firstPeriodDTO = new PeriodDTO();
        firstPeriodDTO.setName(firstClasses.getName());
        firstPeriodDTO.setId(firstClasses.getId());
        firstPeriodDTO.setStartTime(firstClasses.getStartTime());
        firstPeriodDTO.setEndTime(firstClasses.getEndTime());
        PeriodDTO secondPeriodDTO = new PeriodDTO();
        secondPeriodDTO.setName(secondClasses.getName());
        secondPeriodDTO.setId(secondClasses.getId());
        secondPeriodDTO.setStartTime(secondClasses.getStartTime());
        secondPeriodDTO.setEndTime(secondClasses.getEndTime());
        LessonForTeacherScheduleDTO evenLessonForTeacher = new LessonForTeacherScheduleDTO();
        evenLessonForTeacher.setGroup(groupDTO);
        evenLessonForTeacher.setId(biology.getId());
        evenLessonForTeacher.setLessonType(biology.getLessonType());
        evenLessonForTeacher.setSubjectForSite(biology.getSubjectForSite());
        evenLessonForTeacher.setTeacherForSite(biology.getTeacherForSite());
        evenLessonForTeacher.setRoom("Laboratory Room");
        List<LessonForTeacherScheduleDTO> evenLessonList = new ArrayList<>();
        evenLessonList.add(evenLessonForTeacher);
        LessonForTeacherScheduleDTO oddLessonForTeacher = new LessonForTeacherScheduleDTO();
        oddLessonForTeacher.setId(astronomy.getId());
        oddLessonForTeacher.setGroup(groupDTO);
        oddLessonForTeacher.setLessonType(astronomy.getLessonType());
        oddLessonForTeacher.setTeacherForSite(astronomy.getTeacherForSite());
        oddLessonForTeacher.setSubjectForSite(astronomy.getSubjectForSite());
        oddLessonForTeacher.setRoom("Practical Room");
        List<LessonForTeacherScheduleDTO> oddLessonList = new ArrayList<>();
        oddLessonList.add(oddLessonForTeacher);
        ClassForTeacherScheduleDTO evenClass = new ClassForTeacherScheduleDTO();
        evenClass.setPeriod(firstPeriodDTO);
        evenClass.setLessons(evenLessonList);
        ClassForTeacherScheduleDTO oddClass = new ClassForTeacherScheduleDTO();
        oddClass.setPeriod(secondPeriodDTO);
        oddClass.setLessons(oddLessonList);
        List<ClassForTeacherScheduleDTO> evenClassForTeacherScheduleDTO = new ArrayList<>();
        evenClassForTeacherScheduleDTO.add(evenClass);
        List<ClassForTeacherScheduleDTO> oddClassForTeacherScheduleDTO = new ArrayList<>();
        oddClassForTeacherScheduleDTO.add(oddClass);
        ClassesInScheduleForTeacherDTO evenWeek = new ClassesInScheduleForTeacherDTO();
        evenWeek.setPeriods(evenClassForTeacherScheduleDTO);
        ClassesInScheduleForTeacherDTO oddWeek = new ClassesInScheduleForTeacherDTO();
        oddWeek.setPeriods(oddClassForTeacherScheduleDTO);
        DaysOfWeekWithClassesForTeacherDTO days = new DaysOfWeekWithClassesForTeacherDTO();
        days.setEvenWeek(evenWeek);
        days.setOddWeek(oddWeek);
        List<DaysOfWeekWithClassesForTeacherDTO> daysForTeachers = new ArrayList<>();
        daysForTeachers.add(days);
        days.setDay(DayOfWeek.MONDAY);
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setId(teacher.getId());
        teacherDTO.setName(teacher.getName());
        teacherDTO.setSurname(teacher.getSurname());
        teacherDTO.setPatronymic(teacher.getPatronymic());
        teacherDTO.setPosition(teacher.getPosition());
        ScheduleForTeacherDTO scheduleForTeacherDTO = new ScheduleForTeacherDTO();
        scheduleForTeacherDTO.setTeacher(teacherDTO);
        scheduleForTeacherDTO.setDays(daysForTeachers);

        when(teacherService.getById(teacher.getId())).thenReturn(teacher);
        when(teacherMapper.teacherToTeacherDTO(teacher)).thenReturn(teacherDTO);
        when(scheduleRepository.getDaysWhenTeacherHasClassesBySemester(semester.getId(), teacher.getId())).thenReturn(dayOfWeekList);
        when(scheduleRepository.periodsForTeacherBySemesterByDayByWeek(semester.getId(), teacher.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(evenPeriodList);
        when(scheduleRepository.periodsForTeacherBySemesterByDayByWeek(semester.getId(), teacher.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(oddPeriodList);
        when(periodMapper.convertToDto(firstClasses)).thenReturn(firstPeriodDTO);
        when(periodMapper.convertToDto(secondClasses)).thenReturn(secondPeriodDTO);
        when(scheduleRepository.lessonsForTeacherBySemesterByDayByPeriodByWeek(semester.getId(), teacher.getId(), firstClasses.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(evenLessons);
        when(scheduleRepository.lessonsForTeacherBySemesterByDayByPeriodByWeek(semester.getId(), teacher.getId(), secondClasses.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(oddLessons);
        when(lessonForTeacherScheduleMapper.lessonToLessonForTeacherScheduleDTO(biology)).thenReturn(evenLessonForTeacher);
        when(lessonForTeacherScheduleMapper.lessonToLessonForTeacherScheduleDTO(astronomy)).thenReturn(oddLessonForTeacher);
        when(scheduleRepository.getRoomForLesson(semester.getId(), firstClasses.getId(), biology.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(laboratory);
        when(scheduleRepository.getRoomForLesson(semester.getId(), secondClasses.getId(), astronomy.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(practical);

        ScheduleForTeacherDTO result = scheduleService.getScheduleForTeacher(semester.getId(), teacher.getId());
        assertNotNull(result);
        assertEquals(scheduleForTeacherDTO, result);
    }

    @Test
    public void getScheduleForRooms() {
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setCurrentSemester(true);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        semester.setYear(2020);
        semester.setDaysOfWeek(dayOfWeeks);
        Group group = new Group();
        group.setId(1L);
        group.setTitle("111");
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(group.getId());
        groupDTO.setTitle(group.getTitle());
        List<DayOfWeek> dayOfWeekList = new ArrayList<>();
        dayOfWeekList.add(DayOfWeek.MONDAY);
        Period firstClasses = new Period();
        firstClasses.setId(1L);
        firstClasses.setName("1 para");
        firstClasses.setStartTime(LocalTime.parse("02:00:00"));
        firstClasses.setEndTime(LocalTime.parse("03:00:00"));
        Period secondClasses = new Period();
        secondClasses.setId(2L);
        secondClasses.setName("2 para");
        secondClasses.setStartTime(LocalTime.parse("04:00:00"));
        secondClasses.setEndTime(LocalTime.parse("05:00:00"));
        List<Period> periodList = new ArrayList<>();
        periodList.add(firstClasses);
        periodList.add(secondClasses);
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setUserId(1);
        teacher.setName("Ivan");
        teacher.setSurname("Ivanov");
        teacher.setPatronymic("Ivanovych");
        teacher.setPosition("Docent");
        Subject biologySubject = new Subject();
        biologySubject.setId(1L);
        biologySubject.setName("Biology");
        Subject astronomySubject = new Subject();
        astronomySubject.setId(2L);
        astronomySubject.setName("Astronomy");
        Lesson biology = new Lesson();
        biology.setId(1L);
        biology.setGroup(group);
        biology.setTeacher(teacher);
        biology.setSubject(biologySubject);
        biology.setHours(1);
        biology.setLessonType(LessonType.LABORATORY);
        biology.setSubjectForSite("FIRST SUBJECT");
        biology.setTeacherForSite("Ivanov I.I.");
        List<Lesson> evenLessons = new ArrayList<>();
        evenLessons.add(biology);
        Lesson astronomy = new Lesson();
        astronomy.setId(2L);
        astronomy.setHours(2);
        astronomy.setTeacherForSite("Petrov P.P.");
        astronomy.setSubjectForSite("SECOND SUBJECT");
        astronomy.setGroup(group);
        astronomy.setLessonType(LessonType.PRACTICAL);
        astronomy.setSubject(astronomySubject);
        astronomy.setTeacher(teacher);
        List<Lesson> oddLessons = new ArrayList<>();
        oddLessons.add(astronomy);
        RoomType laboratoryType = new RoomType();
        laboratoryType.setId(1L);
        laboratoryType.setDescription("Laboratory");
        Room laboratory = new Room();
        laboratory.setId(1L);
        laboratory.setType(laboratoryType);
        laboratory.setName("Laboratory Room");
        List<Room> roomList = new ArrayList<>();
        roomList.add(laboratory);
        PeriodDTO firstPeriodDTO = new PeriodDTO();
        firstPeriodDTO.setName(firstClasses.getName());
        firstPeriodDTO.setId(firstClasses.getId());
        firstPeriodDTO.setStartTime(firstClasses.getStartTime());
        firstPeriodDTO.setEndTime(firstClasses.getEndTime());
        PeriodDTO secondPeriodDTO = new PeriodDTO();
        secondPeriodDTO.setName(secondClasses.getName());
        secondPeriodDTO.setId(secondClasses.getId());
        secondPeriodDTO.setStartTime(secondClasses.getStartTime());
        secondPeriodDTO.setEndTime(secondClasses.getEndTime());

        LessonsInRoomScheduleDTO evenLessonsInRoom = new LessonsInRoomScheduleDTO();
        evenLessonsInRoom.setClassId(firstClasses.getId());
        evenLessonsInRoom.setClassName(firstClasses.getName());
        evenLessonsInRoom.setGroupId(group.getId());
        evenLessonsInRoom.setGroupName(group.getTitle());
        evenLessonsInRoom.setLessonId(biology.getId());
        evenLessonsInRoom.setLessonType(biology.getLessonType().toString());
        evenLessonsInRoom.setSubjectName(biology.getSubject().getName());
        evenLessonsInRoom.setSurname(teacher.getSurname());
        List<LessonsInRoomScheduleDTO> evenLessonsList = new ArrayList<>();
        evenLessonsList.add(evenLessonsInRoom);
        LessonsInRoomScheduleDTO oddLessonsInRoom = new LessonsInRoomScheduleDTO();
        oddLessonsInRoom.setClassId(secondClasses.getId());
        oddLessonsInRoom.setClassName(secondClasses.getName());
        oddLessonsInRoom.setGroupId(group.getId());
        oddLessonsInRoom.setGroupName(group.getTitle());
        oddLessonsInRoom.setLessonId(astronomy.getId());
        oddLessonsInRoom.setLessonType(astronomy.getLessonType().toString());
        oddLessonsInRoom.setSubjectName(astronomy.getSubject().getName());
        oddLessonsInRoom.setSurname(teacher.getSurname());
        List<LessonsInRoomScheduleDTO> oddLessonsList = new ArrayList<>();
        oddLessonsList.add(oddLessonsInRoom);
        RoomClassesInScheduleDTO laboratoryRoomClasses = new RoomClassesInScheduleDTO();
        laboratoryRoomClasses.setEven(evenLessonsList);
        laboratoryRoomClasses.setOdd(oddLessonsList);
        List<RoomClassesInScheduleDTO> laboratoryRoomClassesList = new ArrayList<>();
        laboratoryRoomClassesList.add(laboratoryRoomClasses);
        DaysOfWeekWithClassesForRoomDTO laboratoryDay = new DaysOfWeekWithClassesForRoomDTO();
        laboratoryDay.setDay(DayOfWeek.MONDAY);
        laboratoryDay.setClasses(laboratoryRoomClassesList);
        List<DaysOfWeekWithClassesForRoomDTO> laboratoryDays = new ArrayList<>();
        laboratoryDays.add(laboratoryDay);
        ScheduleForRoomDTO laboratoryDTO = new ScheduleForRoomDTO();
        laboratoryDTO.setRoomId(laboratory.getId());
        laboratoryDTO.setRoomName(laboratory.getName());
        laboratoryDTO.setRoomType(laboratory.getType().getDescription());
        laboratoryDTO.setSchedules(laboratoryDays);
        List<ScheduleForRoomDTO> scheduleForRoomDTOS = new ArrayList<>();
        scheduleForRoomDTOS.add(laboratoryDTO);

 //       when(roomService.getRoomsWithSchedule(semester.getId())).thenReturn(roomList);
//        when(scheduleRepository.getDaysWhenRoomHasClassesBySemester(semester.getId(), laboratory.getId())).thenReturn(dayOfWeekList);
        when(scheduleRepository.getPeriodsForRoomBySemesterByDayOfWeek(semester.getId(), laboratory.getId(), DayOfWeek.MONDAY)).thenReturn(periodList);
        when(scheduleRepository.lessonForRoomByDayBySemesterByPeriodByWeek(semester.getId(), laboratory.getId(), firstClasses.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(evenLessons);
        when(scheduleRepository.lessonForRoomByDayBySemesterByPeriodByWeek(semester.getId(), laboratory.getId(), secondClasses.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(oddLessons);
        when(lessonsInScheduleMapper.lessonToLessonsInRoomScheduleDTO(biology)).thenReturn(evenLessonsInRoom);
        when(lessonsInScheduleMapper.lessonToLessonsInRoomScheduleDTO(astronomy)).thenReturn(oddLessonsInRoom);

        List<ScheduleForRoomDTO> result = scheduleService.getScheduleForRooms(semester.getId());
        assertNotNull(result);
        assertEquals(scheduleForRoomDTOS.get(0).getRoomId(), result.get(0).getRoomId());
        assertEquals(scheduleForRoomDTOS.get(0).getRoomName(), result.get(0).getRoomName());
        assertEquals(scheduleForRoomDTOS.get(0).getRoomType(), result.get(0).getRoomType());
        assertEquals(scheduleForRoomDTOS.get(0).getSchedules().get(0), result.get(0).getSchedules().get(0));
    }
}
