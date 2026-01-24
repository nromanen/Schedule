package com.softserve.mapper;

import com.softserve.dto.*;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.LessonType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@Tag("unit")
@ExtendWith(MockitoExtension.class)
class ConverterToSchedulesInRoomTest {

    @Mock
    private GroupMapper groupMapper;

    @InjectMocks
    private ConverterToSchedulesInRoom converter;

    private Room room;
    private RoomDTO roomDTO;
    private RoomTypeDTO roomTypeDTO;
    private Period period;
    private PeriodDTO periodDTO;
    private SemesterDTO semesterDTO;
    private Schedule schedule;
    private Lesson lesson;
    private Teacher teacher;
    private Group group;
    private RoomType roomType;

    @BeforeEach
    void setUp() {
        roomType = new RoomType();
        roomType.setId(1L);
        roomType.setDescription("Lecture Hall");

        roomTypeDTO = new RoomTypeDTO();
        roomTypeDTO.setId(1L);
        roomTypeDTO.setDescription("Lecture Hall");

        room = new Room();
        room.setId(1L);
        room.setName("Room 101");
        room.setType(roomType);

        roomDTO = new RoomDTO();
        roomDTO.setId(1L);
        roomDTO.setName("Room 101");
        roomDTO.setType(roomTypeDTO);

        period = new Period();
        period.setId(1L);
        period.setName("1");

        periodDTO = new PeriodDTO();
        periodDTO.setId(1L);
        periodDTO.setName("1");

        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setSurname("Перцов");

        group = new Group();
        group.setId(94L);
        group.setTitle("311-Б");

        lesson = new Lesson();
        lesson.setId(1L);
        lesson.setSubjectForSite("Фреймворки JavaScript");
        lesson.setLessonType(LessonType.LECTURE);
        lesson.setTeacher(teacher);
        lesson.setGroup(group);

        schedule = new Schedule();
        schedule.setId(1L);
        schedule.setRoom(room);
        schedule.setPeriod(period);
        schedule.setLesson(lesson);
        schedule.setDayOfWeek(DayOfWeek.MONDAY);
        schedule.setEvenOdd(EvenOdd.EVEN);

        semesterDTO = new SemesterDTO();
        semesterDTO.setId(1L);
        semesterDTO.setDaysOfWeek(new TreeSet<>(Set.of(DayOfWeek.MONDAY)));
        semesterDTO.setPeriods(new LinkedHashSet<>(List.of(periodDTO)));
    }

    @Test
    void getBySemester_shouldReturnLessons_whenPeriodDTOMatchesPeriodEntityById() {
        // Given
        List<RoomDTO> rooms = List.of(roomDTO);
        Map<Room, List<Schedule>> roomSchedules = new HashMap<>();
        roomSchedules.put(room, List.of(schedule));

        GroupDTOInRoomSchedule groupDTOInRoomSchedule = new GroupDTOInRoomSchedule();
        groupDTOInRoomSchedule.setGroupId(94L);
        groupDTOInRoomSchedule.setGroupName("311-Б");

        when(groupMapper.toGroupDTOInRoomSchedule(anyList()))
                .thenReturn(List.of(groupDTOInRoomSchedule));

        // When
        List<ScheduleForRoomDTO> result = converter.getBySemester(rooms, semesterDTO, roomSchedules);

        // Then
        assertThat(result).hasSize(1);

        ScheduleForRoomDTO roomResult = result.get(0);
        assertThat(roomResult.getRoomId()).isEqualTo(1L);
        assertThat(roomResult.getRoomName()).isEqualTo("Room 101");
        assertThat(roomResult.getSchedules()).hasSize(1);

        DaysOfWeekWithClassesForRoomDTO daySchedule = roomResult.getSchedules().get(0);
        assertThat(daySchedule.getDay()).isEqualTo(DayOfWeek.MONDAY);
        assertThat(daySchedule.getClasses()).hasSize(1);

        RoomClassesInScheduleDTO classesDTO = daySchedule.getClasses().get(0);
        assertThat(classesDTO.getEven()).hasSize(1);

        LessonsInRoomScheduleDTO lessonInSchedule = classesDTO.getEven().get(0);
        assertThat(lessonInSchedule.getClassId()).isEqualTo(1L);
        assertThat(lessonInSchedule.getClassName()).isEqualTo("1");

        // Головна перевірка: lessons не повинні бути порожніми!
        assertThat(lessonInSchedule.getLessons())
                .as("Lessons should not be empty when Period entity matches PeriodDTO by id")
                .isNotEmpty()
                .hasSize(1);

        LessonsListInRoomScheduleDTO lessonDetails = lessonInSchedule.getLessons().get(0);
        assertThat(lessonDetails.getSubjectName()).isEqualTo("Фреймворки JavaScript");
        assertThat(lessonDetails.getLessonType()).isEqualTo(LessonType.LECTURE);
        assertThat(lessonDetails.getSurname()).isEqualTo("Перцов");
    }

    @Test
    void getBySemester_shouldReturnEmptyLessons_whenNoSchedulesForRoom() {
        // Given
        List<RoomDTO> rooms = List.of(roomDTO);
        Map<Room, List<Schedule>> roomSchedules = new HashMap<>(); // Порожня мапа

        // When
        List<ScheduleForRoomDTO> result = converter.getBySemester(rooms, semesterDTO, roomSchedules);

        // Then
        assertThat(result).hasSize(1);

        ScheduleForRoomDTO roomResult = result.get(0);
        assertThat(roomResult.getRoomId()).isEqualTo(1L);

        LessonsInRoomScheduleDTO lessonInSchedule = roomResult.getSchedules().get(0).getClasses().get(0).getEven().get(0);
        assertThat(lessonInSchedule.getLessons()).isEmpty();
    }

    @Test
    void getBySemester_shouldMatchByIdNotByObjectReference() {
        // Given: Period entity і PeriodDTO з однаковим id, але різні об'єкти
        Period differentPeriodInstance = new Period();
        differentPeriodInstance.setId(1L); // Той самий id
        differentPeriodInstance.setName("1");

        Schedule scheduleWithDifferentPeriodInstance = new Schedule();
        scheduleWithDifferentPeriodInstance.setId(1L);
        scheduleWithDifferentPeriodInstance.setRoom(room);
        scheduleWithDifferentPeriodInstance.setPeriod(differentPeriodInstance); // Інший об'єкт Period
        scheduleWithDifferentPeriodInstance.setLesson(lesson);
        scheduleWithDifferentPeriodInstance.setDayOfWeek(DayOfWeek.MONDAY);
        scheduleWithDifferentPeriodInstance.setEvenOdd(EvenOdd.EVEN);

        List<RoomDTO> rooms = List.of(roomDTO);
        Map<Room, List<Schedule>> roomSchedules = new HashMap<>();
        roomSchedules.put(room, List.of(scheduleWithDifferentPeriodInstance));

        GroupDTOInRoomSchedule groupDTOInRoomSchedule = new GroupDTOInRoomSchedule();
        groupDTOInRoomSchedule.setGroupId(94L);
        groupDTOInRoomSchedule.setGroupName("311-Б");

        when(groupMapper.toGroupDTOInRoomSchedule(anyList()))
                .thenReturn(List.of(groupDTOInRoomSchedule));

        // When
        List<ScheduleForRoomDTO> result = converter.getBySemester(rooms, semesterDTO, roomSchedules);

        // Then: Lessons повинні знайтись по id, навіть якщо об'єкти різні
        LessonsInRoomScheduleDTO lessonInSchedule = result.get(0)
                .getSchedules().get(0)
                .getClasses().get(0)
                .getEven().get(0);

        assertThat(lessonInSchedule.getLessons())
                .as("Should match Period by id, not by object reference")
                .isNotEmpty();
    }

    @Test
    void getBySemester_shouldHandleMultiplePeriods() {
        // Given
        Period period2 = new Period();
        period2.setId(2L);
        period2.setName("2");

        PeriodDTO periodDTO2 = new PeriodDTO();
        periodDTO2.setId(2L);
        periodDTO2.setName("2");

        semesterDTO.setPeriods(new LinkedHashSet<>(List.of(periodDTO, periodDTO2)));

        Schedule schedule2 = new Schedule();
        schedule2.setId(2L);
        schedule2.setRoom(room);
        schedule2.setPeriod(period2);
        schedule2.setLesson(lesson);
        schedule2.setDayOfWeek(DayOfWeek.MONDAY);
        schedule2.setEvenOdd(EvenOdd.EVEN);

        List<RoomDTO> rooms = List.of(roomDTO);
        Map<Room, List<Schedule>> roomSchedules = new HashMap<>();
        roomSchedules.put(room, List.of(schedule, schedule2));

        GroupDTOInRoomSchedule groupDTOInRoomSchedule = new GroupDTOInRoomSchedule();
        groupDTOInRoomSchedule.setGroupId(94L);
        groupDTOInRoomSchedule.setGroupName("311-Б");

        when(groupMapper.toGroupDTOInRoomSchedule(anyList()))
                .thenReturn(List.of(groupDTOInRoomSchedule));

        // When
        List<ScheduleForRoomDTO> result = converter.getBySemester(rooms, semesterDTO, roomSchedules);

        // Then
        List<LessonsInRoomScheduleDTO> evenLessons = result.get(0)
                .getSchedules().get(0)
                .getClasses().get(0)
                .getEven();

        assertThat(evenLessons).hasSize(2);
        assertThat(evenLessons.get(0).getLessons()).isNotEmpty();
        assertThat(evenLessons.get(1).getLessons()).isNotEmpty();
    }

    @Test
    void getBySemester_shouldHandleOddAndEvenSchedules() {
        // Given
        Schedule oddSchedule = new Schedule();
        oddSchedule.setId(2L);
        oddSchedule.setRoom(room);
        oddSchedule.setPeriod(period);
        oddSchedule.setLesson(lesson);
        oddSchedule.setDayOfWeek(DayOfWeek.MONDAY);
        oddSchedule.setEvenOdd(EvenOdd.ODD);

        List<RoomDTO> rooms = List.of(roomDTO);
        Map<Room, List<Schedule>> roomSchedules = new HashMap<>();
        roomSchedules.put(room, List.of(schedule, oddSchedule));

        GroupDTOInRoomSchedule groupDTOInRoomSchedule = new GroupDTOInRoomSchedule();
        groupDTOInRoomSchedule.setGroupId(94L);
        groupDTOInRoomSchedule.setGroupName("311-Б");

        when(groupMapper.toGroupDTOInRoomSchedule(anyList()))
                .thenReturn(List.of(groupDTOInRoomSchedule));

        // When
        List<ScheduleForRoomDTO> result = converter.getBySemester(rooms, semesterDTO, roomSchedules);

        // Then
        RoomClassesInScheduleDTO classesDTO = result.get(0)
                .getSchedules().get(0)
                .getClasses().get(0);

        assertThat(classesDTO.getEven().get(0).getLessons())
                .as("Even lessons should not be empty")
                .isNotEmpty();
        assertThat(classesDTO.getOdd().get(0).getLessons())
                .as("Odd lessons should not be empty")
                .isNotEmpty();
    }
}
