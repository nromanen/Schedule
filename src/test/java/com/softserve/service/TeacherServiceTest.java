package com.softserve.service;

import com.softserve.entity.Teacher;
import com.softserve.entity.User;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.TeacherRepository;
import com.softserve.service.impl.TeacherServiceImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static com.softserve.entity.enums.Role.ROLE_TEACHER;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class TeacherServiceTest {
    @Mock
    TeacherRepository teacherRepository;

    @Mock
    UserService userService;

    @Mock
    MailService mailService;

    @InjectMocks
    TeacherServiceImpl teacherService;

    @Test
    public void getById() {
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
    public void notFound() {
        Teacher teacher = new Teacher();
        teacher.setPosition("docent");
        teacher.setPatronymic("Ivanovych");
        teacher.setSurname("Ivanov");
        teacher.setName("Ivan");
        teacher.setId(1L);
        teacher.setUserId(1);

        teacherService.getById(2L);
    }

    @Test
    public void joinTeacherWithUser() {
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
    public void failJoinTeacherWithUserWhenUserIdNotNull() {
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
    public void failJoinTeacherWithUserWhenUserRoleIsTeacher() {
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
}
