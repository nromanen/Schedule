package com.softserve.service;

import com.softserve.entity.User;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.UserRepository;
import com.softserve.service.impl.UserServiceImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    public void testGetById() {
        User user = new User();
        user.setEmail("test@email.com");
        user.setPassword("password");

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        User result = userService.getById(1L);
        assertNotNull(result);
        assertEquals(user.getId(), result.getId());
        verify(userRepository, times(1)).findById(anyLong());
    }

    @Test(expected = EntityNotFoundException.class)
    public void notFoundId() {
        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        userService.getById(2L);
        verify(userService, times(1)).getById(2L);
    }

    @Test
    public void testSave() {
        User user = new User();
        user.setEmail("mail@email.com");
        user.setPassword("password");

        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.save(user);
        assertNotNull(result);
        assertEquals(user.getEmail(), result.getEmail());
        verify(userRepository, times(1)).save(user);
        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void saveExistsEmail() {
        User user = new User();
        user.setEmail("test@email.com");
        user.setPassword("password");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        userService.save(user);
        verify(userRepository, times(1)).save(user);
        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }

    //    another exception
    @Test(expected = NullPointerException.class)
    public void saveWhenPasswordIsNull() {
        User user = new User();
        user.setEmail("test@email.com");
        user.setPassword(null);

        when(userRepository.save(any(User.class))).thenReturn(user);

        userService.save(user);
        verify(userRepository, times(1)).save(user);
        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }

//    @Test(expected = SQLDataException.class)
//    public void save_when_email_longer_than_40_symbols() {
//        User user = new User();
//        user.setEmail("123456789123456789123456789123456789@email.com");
//        user.setPassword("password");
//
//        when(userRepository.save(any(User.class))).thenReturn(user);
//
//        userService.save(user);
//        verify(userRepository, times(1)).save(user);
//        verify(userRepository, times(1)).findByEmail(user.getEmail());
//    }

    @Test
    public void testUpdate() {
        User oldUser = new User();
        oldUser.setEmail("oldEmail@mail.com");
        oldUser.setPassword("oldPassword");
        User updateUser = new User();
        updateUser.setEmail("update@mail.com");
        updateUser.setPassword("updatePassword");


        when(userRepository.findById(anyLong())).thenReturn(Optional.of(oldUser));
        when(userRepository.update(any(User.class))).thenReturn(updateUser);

        oldUser = userService.update(updateUser);
        assertNotNull(oldUser);
        assertEquals(updateUser, oldUser);
        verify(userRepository, times(1)).update(oldUser);
        verify(userRepository, times(1)).findById(anyLong());
        verify(userRepository, times(1)).findByEmail(oldUser.getEmail());
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void updateWhenEmailIsExists() {
        User oldUser = new User();
        oldUser.setEmail("email@mail.com");
        oldUser.setPassword("oldPassword");
        oldUser.setId(1L);
        User updateUser = new User();
        updateUser.setEmail("email@mail.com");
        updateUser.setPassword("updatePassword");

        when(userRepository.findByEmail(updateUser.getEmail())).thenReturn(Optional.of(oldUser));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(updateUser));
        when(userRepository.update(any(User.class))).thenReturn(updateUser);

        userService.update(updateUser);

        verify(userRepository, times(1)).update(oldUser);
        verify(userRepository, times(1)).findById(anyLong());
        verify(userRepository, times(1)).findByEmail(oldUser.getEmail());
    }

    @Test
    public void testFindByEmail() {
        User user = new User();
        user.setEmail("test@email.com");
        user.setPassword("password");

        when(userRepository.findByEmail("test@email.com")).thenReturn(Optional.of(user));

        User result = userService.findByEmail(user.getEmail());
        assertNotNull(result);
        assertEquals(user, result);
        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }

    @Test(expected = EntityNotFoundException.class)
    public void emailNotFounded() {
        User user = new User();
        user.setEmail("test@email.com");

        when(userRepository.findByEmail("test@email.com")).thenReturn(Optional.of(user));

        userService.findByEmail("some@email.com");
        verify(userRepository, times(1)).findByEmail("test@email.com");
    }
}
