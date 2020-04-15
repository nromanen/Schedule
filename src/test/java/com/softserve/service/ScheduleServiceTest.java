package com.softserve.service;

import com.softserve.dto.*;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.LessonType;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.ScheduleConflictException;
import com.softserve.repository.ScheduleRepository;
import com.softserve.service.impl.ScheduleServiceImpl;
import com.softserve.service.mapper.*;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(MockitoJUnitRunner.class)
public class ScheduleServiceTest {

    @Mock
    private GroupMapperImpl groupMapper;

    @Mock
    private PeriodMapperImpl periodMapper;

    @Mock
    private LessonsInScheduleMapperImpl lessonsInScheduleMapper;

    @Mock
    private RoomForScheduleMapperImpl roomForScheduleMapper;

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private LessonService lessonService;

    @Mock
    private RoomService roomService;

    @Mock
    private GroupService groupService;

    @InjectMocks
    private ScheduleServiceImpl scheduleService;

    @Test
    public void getById() {
        Schedule expectedSchedule = new Schedule();
        expectedSchedule.setId(1L);
        expectedSchedule.setDayOfWeek(DayOfWeek.MONDAY.toString());
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
    public void notFound() {
        Schedule schedule = new Schedule();
        schedule.setId(1L);

        scheduleService.getById(2L);
        verify(scheduleRepository, times(1)).findById(2L);
    }

    @Test
    public void save() {
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
        expectedSchedule.setDayOfWeek(DayOfWeek.MONDAY.toString());
        expectedSchedule.setEvenOdd(EvenOdd.ODD);
        expectedSchedule.setLesson(lesson);
        expectedSchedule.setPeriod(period);
        expectedSchedule.setRoom(room);
        expectedSchedule.setSemester(semester);

        doReturn(lesson).when(lessonService).getById(1L);
        Long groupId = lessonService.getById(1L).getGroup().getId();
        doReturn(0L).when(scheduleRepository).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);
        doReturn(expectedSchedule).when(scheduleRepository).save(expectedSchedule);

        Schedule actualSchedule = scheduleService.save(expectedSchedule);
        assertNotNull(actualSchedule);
        assertEquals(expectedSchedule, actualSchedule);
        verify(lessonService, times(2)).getById(1L);
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);
        verify(scheduleRepository, times(1)).save(expectedSchedule);
    }

    @Test(expected = ScheduleConflictException.class)
    public void saveWithConflict() {
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
        expectedSchedule.setDayOfWeek(DayOfWeek.MONDAY.toString());
        expectedSchedule.setEvenOdd(EvenOdd.ODD);
        expectedSchedule.setLesson(lesson);
        expectedSchedule.setPeriod(period);
        expectedSchedule.setRoom(room);
        expectedSchedule.setSemester(semester);

        doReturn(lesson).when(lessonService).getById(1L);
        Long groupId = lessonService.getById(1L).getGroup().getId();
        doReturn(1L).when(scheduleRepository).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);

        scheduleService.save(expectedSchedule);
        verify(lessonService, times(2)).getById(1L);
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);
    }

    @Test
    public void update() {
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
        oldSchedule.setDayOfWeek(DayOfWeek.MONDAY.toString());
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
        expectedSchedule.setDayOfWeek(DayOfWeek.TUESDAY.toString());
        expectedSchedule.setEvenOdd(EvenOdd.EVEN);
        expectedSchedule.setLesson(lesson);
        expectedSchedule.setPeriod(period);
        expectedSchedule.setRoom(room);
        expectedSchedule.setSemester(semester);

        doReturn(lesson).when(lessonService).getById(2L);
        Long groupId = lessonService.getById(2L).getGroup().getId();
        doReturn(0L).when(scheduleRepository).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);
        doReturn(expectedSchedule).when(scheduleRepository).update(expectedSchedule);

        oldSchedule = scheduleService.update(expectedSchedule);
        assertNotNull(oldSchedule);
        assertEquals(expectedSchedule, oldSchedule);
        verify(lessonService, times(2)).getById(2L);
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);
        verify(scheduleRepository, times(1)).update(expectedSchedule);
    }

    @Test(expected = ScheduleConflictException.class)
    public void updateWithConflict() {
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
        oldSchedule.setDayOfWeek(DayOfWeek.MONDAY.toString());
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
        expectedSchedule.setDayOfWeek(DayOfWeek.TUESDAY.toString());
        expectedSchedule.setEvenOdd(EvenOdd.EVEN);
        expectedSchedule.setLesson(lesson);
        expectedSchedule.setPeriod(period);
        expectedSchedule.setRoom(room);
        expectedSchedule.setSemester(semester);

        doReturn(lesson).when(lessonService).getById(2L);
        Long groupId = lessonService.getById(2L).getGroup().getId();
        doReturn(1L).when(scheduleRepository).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);

        oldSchedule = scheduleService.update(expectedSchedule);
        assertNotNull(oldSchedule);
        assertEquals(expectedSchedule, oldSchedule);
        verify(lessonService, times(2)).getById(2L);
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(
                expectedSchedule.getSemester().getId(),
                DayOfWeek.valueOf(expectedSchedule.getDayOfWeek()),
                expectedSchedule.getEvenOdd(),
                expectedSchedule.getPeriod().getId(), groupId);
    }

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
        doReturn(0L).when(scheduleRepository).conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId);
        doReturn(allRooms).when(roomService).getAllRoomsForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId);

        CreateScheduleInfoDTO actualDTO = scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId, lessonId);
        assertEquals(expectedDTO.isClassSuitsToTeacher(), actualDTO.isClassSuitsToTeacher());
        assertEquals(expectedDTO.isTeacherAvailable(), actualDTO.isTeacherAvailable());
        assertEquals(expectedDTO.getRooms().size(), actualDTO.getRooms().size());
        assertEquals(expectedDTO.getRooms().get(0), actualDTO.getRooms().get(0));
        assertEquals(expectedDTO.getRooms().get(1), actualDTO.getRooms().get(1));
        verify(lessonService, times(4)).getById(anyLong());
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

        scheduleService.getInfoForCreatingSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
        verify(lessonService, times(1)).getById(anyLong());
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
    }

//    @Test
//    public void testFullSchedule() {
//        Semester semester = new Semester();
//        semester.setId(1L);
//        semester.setDescription("1 semester");
//        semester.setStartDay(LocalDate.of(2020, 4, 10));
//        semester.setEndDay(LocalDate.of(2020, 5, 10));
//        Group group = new Group();
//        group.setId(1L);
//        group.setTitle("111");
//        List<String> dayOfWeekList = new ArrayList<>();
//        dayOfWeekList.add(DayOfWeek.MONDAY.toString());
//        Period firstClasses = new Period();
//        firstClasses.setId(1L);
//        firstClasses.setName("1 para");
//        firstClasses.setStartTime(Timestamp.valueOf("2020-10-15 01:00:00"));
//        firstClasses.setEndTime(Timestamp.valueOf("2020-10-15 02:00:00"));
//        Period secondClasses = new Period();
//        secondClasses.setId(2L);
//        secondClasses.setName("2 para");
//        secondClasses.setStartTime(Timestamp.valueOf("2020-10-15 03:00:00"));
//        secondClasses.setEndTime(Timestamp.valueOf("2020-10-15 04:00:00"));
//        List<Period> periodList = new ArrayList<>();
//        periodList.add(firstClasses);
//        periodList.add(secondClasses);
//        Teacher teacher = new Teacher();
//        teacher.setId(1L);
//        teacher.setUserId(1);
//        teacher.setName("Ivan");
//        teacher.setSurname("Ivanov");
//        teacher.setPatronymic("Ivanovych");
//        teacher.setPosition("Docent");
//        Subject subject = new Subject();
//        subject.setId(1L);
//        subject.setName("Biology");
//        Lesson lesson = new Lesson();
//        lesson.setId(1L);
//        lesson.setGroup(group);
//        lesson.setTeacher(teacher);
//        lesson.setSubject(subject);
//        lesson.setHours(1);
//        lesson.setLessonType(LessonType.LABORATORY);
//        lesson.setSubjectForSite("Human anatomy");
//        lesson.setTeacherForSite("Ivanov I.I.");
//        RoomType laboratoryType = new RoomType();
//        laboratoryType.setId(1L);
//        laboratoryType.setDescription("Laboratory");
//        RoomType practicalType = new RoomType();
//        practicalType.setId(2L);
//        practicalType.setDescription("practical");
//        Room laboratory = new Room();
//        laboratory.setId(1L);
//        laboratory.setType(laboratoryType);
//        laboratory.setName("Laboratory Room");
//        Room practical = new Room();
//        practical.setId(2L);
//        practical.setName("Practical Room");
//        practical.setType(practicalType);
//
//        RoomForScheduleDTO laboratoryDTO = new RoomForScheduleDTO();
//        laboratoryDTO.setId(laboratory.getId());
//        laboratoryDTO.setName(laboratory.getName());
//        LessonsInScheduleDTO firstLesson = new LessonsInScheduleDTO();
//        firstLesson.setLessonType("LABORATORY");
//        firstLesson.setRoom(laboratoryDTO);
//        firstLesson.setSubjectForSite("Human anatomy");
//        firstLesson.setTeacherForSite("Ivanov I.I.");
//        RoomForScheduleDTO practicalDTO = new RoomForScheduleDTO();
//        practicalDTO.setId(practical.getId());
//        practicalDTO.setName(practical.getName());
//        LessonsInScheduleDTO secondLesson = new LessonsInScheduleDTO();
//        secondLesson.setLessonType("LABORATORY");
//        secondLesson.setRoom(practicalDTO);
//        secondLesson.setSubjectForSite("Human anatomy");
//        secondLesson.setTeacherForSite("Ivanov I.I.");
//        LessonInScheduleByWeekDTO lessonInScheduleByWeekDTO = new LessonInScheduleByWeekDTO();
//        lessonInScheduleByWeekDTO.setEven(firstLesson);
//        lessonInScheduleByWeekDTO.setOdd(secondLesson);
//        PeriodDTO firstPeriodDTO = new PeriodDTO();
//        firstPeriodDTO.setName(firstClasses.getName());
//        firstPeriodDTO.setId(firstClasses.getId());
//        firstPeriodDTO.setStartTime(firstClasses.getStartTime());
//        firstPeriodDTO.setEndTime(firstClasses.getEndTime());
//        PeriodDTO secondPeriodDTO = new PeriodDTO();
//        secondPeriodDTO.setName(secondClasses.getName());
//        secondPeriodDTO.setId(secondClasses.getId());
//        secondPeriodDTO.setStartTime(secondClasses.getStartTime());
//        secondPeriodDTO.setEndTime(secondClasses.getEndTime());
//        ClassesInScheduleDTO classes = new ClassesInScheduleDTO();
//        classes.setPeriod(secondPeriodDTO);
//        classes.setWeeks(lessonInScheduleByWeekDTO);
//        ClassesInScheduleDTO classes1 = new ClassesInScheduleDTO();
//        classes1.setPeriod(firstPeriodDTO);
//        classes1.setWeeks(lessonInScheduleByWeekDTO);
//        List<ClassesInScheduleDTO> inScheduleDTOS = new ArrayList<>();
//        inScheduleDTOS.add(classes1);
//        inScheduleDTOS.add(classes );
//        DaysOfWeekWithClassesDTO days = new DaysOfWeekWithClassesDTO();
//        days.setDay(DayOfWeek.MONDAY);
//        days.setClasses(inScheduleDTOS);
//        GroupDTO groupDTO = new GroupDTO();
//        groupDTO.setTitle(group.getTitle());
//        groupDTO.setId(group.getId());
//        List<DaysOfWeekWithClassesDTO> daysOfWeekWithClassesDTOList = new ArrayList<>();
//        daysOfWeekWithClassesDTOList.add(days);
//        ScheduleForGroupDTO scheduleForGroupDTO = new ScheduleForGroupDTO();
//        scheduleForGroupDTO.setGroup(groupDTO);
//        scheduleForGroupDTO.setDays(daysOfWeekWithClassesDTOList);
//        List<ScheduleForGroupDTO> scheduleForGroupDTOList = new ArrayList<>();
//        scheduleForGroupDTOList.add(scheduleForGroupDTO);
//
//        when(scheduleRepository.countSchedulesForGroupInSemester(semester.getId(), group.getId())).thenReturn(1L);
//        when(groupService.getById(1L)).thenReturn(group);
//        when(scheduleRepository.getDaysWhenGroupHasClassesBySemester(semester.getId(), group.getId())).thenReturn(dayOfWeekList);
//        when(scheduleRepository.periodsForGroupByDayBySemester(semester.getId(), group.getId(), DayOfWeek.MONDAY)).thenReturn(periodList);
//        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), group.getId(), firstClasses.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(Optional.of(lesson));
//        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), group.getId(), firstClasses.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(Optional.of(lesson));
//        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), group.getId(), secondClasses.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(Optional.of(lesson));
//        when(scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semester.getId(), group.getId(), secondClasses.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(Optional.of(lesson));
//        when(scheduleRepository.getRoomForLesson(semester.getId(), lesson.getId(), firstClasses.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(laboratory);
//        when(scheduleRepository.getRoomForLesson(semester.getId(), lesson.getId(), firstClasses.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(practical);
//        when(scheduleRepository.getRoomForLesson(semester.getId(), lesson.getId(), secondClasses.getId(), DayOfWeek.MONDAY, EvenOdd.EVEN)).thenReturn(laboratory);
//        when(scheduleRepository.getRoomForLesson(semester.getId(), lesson.getId(), secondClasses.getId(), DayOfWeek.MONDAY, EvenOdd.ODD)).thenReturn(practical);
//        when(groupMapper.groupToGroupDTO(group)).thenReturn(groupDTO);
//        when(periodMapper.convertToDto(firstClasses)).thenReturn(firstPeriodDTO);
//        when(periodMapper.convertToDto(secondClasses)).thenReturn(secondPeriodDTO);
//        when(lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(lesson)).thenReturn(firstLesson);
//        when(lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(lesson)).thenReturn(secondLesson);
//        when(roomForScheduleMapper.roomToRoomForScheduleDTO(laboratory)).thenReturn(laboratoryDTO);
//        when(roomForScheduleMapper.roomToRoomForScheduleDTO(practical)).thenReturn(practicalDTO);
//
//        List<ScheduleForGroupDTO> forGroupDTOList = scheduleService.getFullSchedule(semester.getId(), group.getId());
//        assertNotNull(forGroupDTOList);
//        assertEquals(scheduleForGroupDTOList, forGroupDTOList);
//    }
}
