package com.softserve.service;

import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.WishStatuses;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.TeacherRepository;
import com.softserve.service.impl.TeacherServiceImpl;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.*;

import static com.softserve.entity.enums.Role.ROLE_TEACHER;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(MockitoJUnitRunner.class)
public class TeacherServiceTest {
    @Mock
    TeacherRepository teacherRepository;

    @Mock
    UserService userService;

    @Mock
    MailService mailService;

    @Mock
    PeriodService periodService;

    @Mock
    TeacherWishesService teacherWishesService;

    @InjectMocks
    TeacherServiceImpl teacherService;

    @Test
    public void getTeacherById() {
        Teacher teacher = new Teacher();
        teacher.setPosition("docent");
        teacher.setPatronymic("Ivanovych");
        teacher.setSurname("Ivanov");
        teacher.setName("Ivan");
        teacher.setId(1L);
        teacher.setUserId(1);

        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        Teacher result = teacherService.getById(1L);
        assertNotNull(result);
        assertEquals(teacher.getId(), result.getId());
        verify(teacherRepository, times(1)).findById(anyLong());
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionIfTeacherNotFounded() {
        Teacher teacher = new Teacher();
        teacher.setPosition("docent");
        teacher.setPatronymic("Ivanovych");
        teacher.setSurname("Ivanov");
        teacher.setName("Ivan");
        teacher.setId(1L);
        teacher.setUserId(1);

        teacherService.getById(2L);
        verify(teacherRepository, times(1)).findById(2L);
    }

    @Test
    public void joinTeacherWithUserIfUserIdFromTeacherIsNullAndUserRoleFromUserIsNotTeacher() {
        User user = new User();
        user.setId(1L);
        user.setPassword("somePassword");
        user.setEmail("some@mail.com");
        Teacher teacher = new Teacher();
        teacher.setPosition("docent");
        teacher.setPatronymic("Ivanovych");
        teacher.setSurname("Ivanov");
        teacher.setName("Ivan");
        teacher.setId(1L);

        when(userService.getById(1L)).thenReturn(user);
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));
        when(userService.update(user)).thenReturn(user);
        when(teacherRepository.update(teacher)).thenReturn(teacher);

        Teacher result = teacherService.joinTeacherWithUser(teacher.getId(), user.getId());
        assertNotNull(result);
        assertEquals(Long.valueOf(result.getUserId()), user.getId());
        assertEquals(ROLE_TEACHER, user.getRole());
        verify(userService, timeout(1)).getById(anyLong());
        verify(userService, times(1)).update(any(User.class));
        verify(teacherRepository, times(1)).findById(anyLong());
        verify(teacherRepository, times(1)).update(teacher);
        verify(mailService, times(1)).send(
                ArgumentMatchers.eq(user.getEmail()),
                ArgumentMatchers.contains("Teacher"),
                ArgumentMatchers.contains(user.getEmail())
        );
    }

    @Test(expected = EntityAlreadyExistsException.class)
    public void throwEntityAlreadyExistsExceptionIfUserIdFromTeacherAlreadyExists() {
        User user = new User();
        user.setId(1L);
        user.setPassword("somePassword");
        user.setEmail("some@mail.com");
        Teacher teacher = new Teacher();
        teacher.setPosition("docent");
        teacher.setPatronymic("Ivanovych");
        teacher.setSurname("Ivanov");
        teacher.setName("Ivan");
        teacher.setId(1L);
        teacher.setUserId(1);

        when(userService.getById(1L)).thenReturn(user);
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        teacherService.joinTeacherWithUser(teacher.getId(), user.getId());
    }

    @Test(expected = EntityAlreadyExistsException.class)
    public void throwEntityAlreadyExistsExceptionIfUserRoleFromUserIsTeacher() {
        User user = new User();
        user.setId(1L);
        user.setPassword("somePassword");
        user.setEmail("some@mail.com");
        user.setRole(ROLE_TEACHER);
        Teacher teacher = new Teacher();
        teacher.setPosition("docent");
        teacher.setPatronymic("Ivanovych");
        teacher.setSurname("Ivanov");
        teacher.setName("Ivan");
        teacher.setId(1L);

        when(userService.getById(1L)).thenReturn(user);
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        teacherService.joinTeacherWithUser(teacher.getId(), user.getId());
    }

    @Test
    public void saveTeacherWithWishes() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setUserId(2);
        teacher.setName("Ivan");
        teacher.setSurname("Ivanov");
        teacher.setPatronymic("Ivanovych");
        teacher.setPosition("docent");
        Period period = new Period();
        period.setName("1 para");
        period.setId(1L);
        period.setStartTime(LocalTime.parse("10:00:00"));
        period.setEndTime(LocalTime.parse("11:00:00"));
        List<Period> periodList = new ArrayList<>();
        periodList.add(period);

        when(periodService.getAll()).thenReturn(periodList);
        when(teacherWishesService.save(any(TeacherWishes.class))).thenReturn(null);
        when(teacherRepository.save(teacher)).thenReturn(teacher);

        Teacher result = teacherService.save(teacher);
        assertNotNull(result);
        assertEquals(teacher, result);
        verify(periodService, times(1)).getAll();
        verify(teacherRepository, times(1)).save(teacher);
        verify(teacherWishesService, times(1)).save(any(TeacherWishes.class));
    }

    @Test
    public void getTeacherByUserId() {
        Teacher teacher = new Teacher();
        teacher.setPosition("docent");
        teacher.setPatronymic("Ivanovych");
        teacher.setSurname("Ivanov");
        teacher.setName("Ivan");
        teacher.setId(1L);
        teacher.setUserId(1);

        when(teacherRepository.findByUserId(1)).thenReturn(Optional.of(teacher));

        Teacher result = teacherService.findByUserId(1);
        assertNotNull(result);
        assertEquals(teacher, result);
        verify(teacherRepository, times(1)).findByUserId(1);
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundException() {
        Teacher teacher = new Teacher();
        teacher.setPosition("docent");
        teacher.setPatronymic("Ivanovych");
        teacher.setSurname("Ivanov");
        teacher.setName("Ivan");
        teacher.setId(1L);
        teacher.setUserId(1);

        teacherService.findByUserId(2);
        verify(teacherRepository, times(1)).findByUserId(2);
    }
}
