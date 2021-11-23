package com.softserve.mapper;

import com.softserve.dto.DaysOfWeekWithClassesForRoomDTO;
import com.softserve.dto.LessonsInRoomScheduleDTO;
import com.softserve.dto.RoomDTO;
import com.softserve.dto.ScheduleForRoomDTO;
import com.softserve.entity.Lesson;
import com.softserve.entity.Schedule;
import com.softserve.entity.Semester;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.service.UnitTestCategory;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(MockitoJUnitRunner.class)
public class ScheduleForRoomMapperTest {

    @Mock
    private LessonsListInRoomScheduleMapper lessonMapper;

    @Mock
    private RoomMapper roomMapper;

    @InjectMocks
    private ScheduleForRoomMapperImpl scheduleForRoomMapper;

    @Test
    public void toDaysOfWeekWithClassesForRoomDTOTest() {
        Schedule schedule1 = new Schedule();
        schedule1.setDayOfWeek(DayOfWeek.MONDAY);
        schedule1.setEvenOdd(EvenOdd.ODD);
        Schedule schedule2 = new Schedule();
        schedule2.setDayOfWeek(DayOfWeek.MONDAY);
        schedule2.setEvenOdd(EvenOdd.EVEN);
        LessonsInRoomScheduleDTO lessonsInRoomScheduleDTO1 = new LessonsInRoomScheduleDTO();
        lessonsInRoomScheduleDTO1.setClassId(1L);
        LessonsInRoomScheduleDTO lessonsInRoomScheduleDTO2 = new LessonsInRoomScheduleDTO();
        lessonsInRoomScheduleDTO2.setClassId(1L);
        when(lessonMapper.toLessonsInRoomScheduleDTO(List.of(schedule1))).thenReturn(List.of(lessonsInRoomScheduleDTO1));
        when(lessonMapper.toLessonsInRoomScheduleDTO(List.of(schedule2))).thenReturn(List.of(lessonsInRoomScheduleDTO2));
        DaysOfWeekWithClassesForRoomDTO expected = new DaysOfWeekWithClassesForRoomDTO();
        expected.setDay(DayOfWeek.MONDAY);
        expected.setOdd(List.of(lessonsInRoomScheduleDTO1));
        expected.setEven(List.of(lessonsInRoomScheduleDTO2));
        DaysOfWeekWithClassesForRoomDTO actual = scheduleForRoomMapper
                .toDaysOfWeekWithClassesForRoomDTO(List.of(schedule1, schedule2), DayOfWeek.MONDAY);
        assertEquals(expected,actual);
        verify(lessonMapper, times(1)).toLessonsInRoomScheduleDTO(List.of(schedule1));
        verify(lessonMapper, times(1)).toLessonsInRoomScheduleDTO(List.of(schedule2));
    }

    @Test
    public void scheduleToScheduleForRoomDTO() {
        Semester semester = new Semester();
        semester.setDaysOfWeek(Set.of(DayOfWeek.MONDAY));
        Lesson lesson = new Lesson();
        lesson.setSemester(semester);
        Schedule schedule1 = new Schedule();
        schedule1.setLesson(lesson);
        schedule1.setDayOfWeek(DayOfWeek.MONDAY);
        schedule1.setEvenOdd(EvenOdd.EVEN);
        List<Schedule> schedules = List.of(schedule1);
        when(roomMapper.convertToDto(schedules.get(0).getRoom())).thenReturn(new RoomDTO());
        DaysOfWeekWithClassesForRoomDTO daysOfWeekWithClassesForRoomDTO = new DaysOfWeekWithClassesForRoomDTO();
        daysOfWeekWithClassesForRoomDTO.setDay(DayOfWeek.MONDAY);
        daysOfWeekWithClassesForRoomDTO.setEven(new ArrayList<>());
        daysOfWeekWithClassesForRoomDTO.setOdd(new ArrayList<>());
        ScheduleForRoomDTO expected = new ScheduleForRoomDTO();
        expected.setRoom(new RoomDTO());
        expected.setSchedules(List.of(daysOfWeekWithClassesForRoomDTO));
        ScheduleForRoomDTO actual = scheduleForRoomMapper.scheduleToScheduleForRoomDTO(schedules);
        assertEquals(expected, actual);
        verify(roomMapper, times(1)).convertToDto(schedule1.getRoom());
    }

}
