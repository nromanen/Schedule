package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.entity.Lesson;
import com.softserve.entity.Teacher;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.repository.ScheduleRepository;
import com.softserve.service.impl.ScheduleServiceImpl;
import com.softserve.service.mapper.RoomMapper;
import com.softserve.service.mapper.ScheduleMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.postgresql.util.LruCache;

import java.time.DayOfWeek;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.initMocks;

@RunWith(Parameterized.class)
public class ScheduleServiceTest {
    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private LessonService lessonService;

    @Mock
    private RoomService roomService;

    @Mock
    private RoomMapper roomMapper;
    private ScheduleServiceImpl scheduleService = new ScheduleServiceImpl(scheduleRepository, lessonService, roomService, roomMapper);

    @Before
    public void setUp() {
        initMocks(this);

    }

    @Test
    public void isConflictForGroupInScheduleFalse() {
        Long semesterId = 1L;
        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
        EvenOdd evenOdd = EvenOdd.EVEN;
        Long classId = 1L;
        Group group = new Group();
        group.setId(1L);
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setGroup(group);

        when(lessonService.getById(anyLong())).thenReturn(lesson);
        Long groupId = lessonService.getById(lesson.getId()).getGroup().getId();
        doReturn(0L).when(scheduleRepository).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);

        boolean result = scheduleRepository.conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId) != 0;
        verify(lessonService, times(1)).getById(anyLong());
        verify(scheduleRepository, times(1)).conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId);
        assertFalse(result);
    }

    @Test
    public void isTeacherAvailableForScheduleTrue() {
        Long semesterId = 1L;
        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
        EvenOdd evenOdd = EvenOdd.EVEN;
        Long classId = 1L;
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTeacher(teacher);

        when(lessonService.getById(anyLong())).thenReturn(lesson);
        Long teacherId = lessonService.getById(1L).getTeacher().getId();
        doReturn(0L).when(scheduleRepository).conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId);

        boolean result = scheduleRepository.conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId) == 0;
        verify(lessonService, times(1)).getById(anyLong());
        verify(scheduleRepository, times(1)).conflictForTeacherInSchedule(anyLong(), any(DayOfWeek.class), any(EvenOdd.class), anyLong(), anyLong());
        assertTrue(result);
    }
}
