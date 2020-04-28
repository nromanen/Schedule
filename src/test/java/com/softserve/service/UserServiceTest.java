package com.softserve.service;

import com.softserve.entity.User;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.exception.IncorrectEmailException;
import com.softserve.exception.IncorrectPasswordException;
import com.softserve.repository.UserRepository;
import com.softserve.service.impl.MailServiceImpl;
import com.softserve.service.impl.UserServiceImpl;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private MailServiceImpl mailService;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    public void getUserById() {
        User user = new User();
        user.setEmail("test@email.com");
        user.setPassword("password");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.getById(1L);
        assertNotNull(result);
        assertEquals(user.getId(), result.getId());
        verify(userRepository, times(1)).findById(anyLong());
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionIfUserNotFounded() {
        User user = new User();
        user.setId(1L);

        userService.getById(2L);
        verify(userRepository, times(1)).findById(2L);
    }

    @Test
    public void saveUserIfEmailDoesNotExist() {
        User user = new User();
        user.setEmail("mail@email.com");
        user.setPassword("Qwerty1!");

        when(userRepository.save(any(User.class))).thenReturn(user);
        when(encoder.encode(any(CharSequence.class))).thenReturn("Qwerty1!");

        User result = userService.save(user);
        assertNotNull(result);
        assertEquals(user.getEmail(), result.getEmail());
        verify(userRepository, times(1)).save(user);
        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionIfEmailAlreadyExists() {
        User user = new User();
        user.setEmail("test@email.com");
        user.setPassword("password");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(encoder.encode(any(CharSequence.class))).thenReturn("Qwerty1!");

        userService.save(user);
        verify(userRepository, times(1)).save(user);
        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }

    @Test
    public void updateUserIfEmailDoesNotExist() {
        User oldUser = new User();
        oldUser.setEmail("oldEmail@mail.com");
        oldUser.setPassword("oldPassword");
        oldUser.setId(1L);
        User updateUser = new User();
        updateUser.setEmail("update@mail.com");
        updateUser.setPassword("updatePassword");
        updateUser.setId(1L);

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
    public void throwFieldAlreadyExistsExceptionIfUpdatedEmailAlreadyExists() {
        User oldUser = new User();
        oldUser.setEmail("email@mail.com");
        oldUser.setPassword("oldPassword");
        oldUser.setId(1L);
        User updateUser = new User();
        updateUser.setEmail("email@mail.com");
        updateUser.setPassword("updatePassword");
        updateUser.setId(2L);

        when(userRepository.findByEmail(updateUser.getEmail())).thenReturn(Optional.of(updateUser));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(updateUser));

        userService.update(oldUser);

        verify(userRepository, times(1)).update(oldUser);
        verify(userRepository, times(1)).findById(anyLong());
        verify(userRepository, times(2)).findByEmail(oldUser.getEmail());
    }

    @Test
    public void getUserByEmail() {
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
    public void throwEntityNotFoundExceptionIfEmailNotFounded() {
        User user = new User();
        user.setEmail("test@email.com");

        userService.findByEmail("some@email.com");
        verify(userRepository, times(1)).findByEmail("test@email.com");
    }

    @Test
    public void getUserByToken() {
        User user = new User();
        user.setEmail("some@mail.com");
        user.setPassword("mypassword");
        user.setId(1L);
        user.setToken("qwerty123!@#");

        when(userRepository.findByToken("qwerty123!@#")).thenReturn(Optional.of(user));

        User result = userService.findByToken("qwerty123!@#");
        assertNotNull(result);
        assertEquals(user.getId(), result.getId());
        verify(userRepository, times(1)).findByToken(anyString());
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionIfTokenNotFounded                                                                         () {
        User user = new User();
        user.setEmail("some@mail.com");
        user.setPassword("mypassword");
        user.setId(1L);
        user.setToken("qwerty123!@#");

        userService.findByToken("qflkwrgn");
    }

    @Test
    public void registrationUser() {
        String url = "/sign_up";
        User user = new User();
        user.setEmail("some@mail.com");
        user.setPassword("Qwerty123!@#");

        when(userRepository.save(user)).thenReturn(user);
        when(encoder.encode(any(CharSequence.class))).thenReturn("Qwerty123!@#");

        User registeredUser = userService.registration(user);
        assertNotNull(registeredUser);
        assertNotNull(registeredUser.getToken());
        assertEquals(user.getEmail(), registeredUser.getEmail());
        assertEquals(user.getPassword(), registeredUser.getPassword());
        verify(userRepository, times(1)).save(user);
        verify(mailService, times(1)).send(
                ArgumentMatchers.eq(registeredUser.getEmail()),
                ArgumentMatchers.contains("Activation account"),
                ArgumentMatchers.contains("activation-page?token=")
        );
    }

    @Test(expected = IncorrectPasswordException.class)
    public void throwIncorrectPasswordExceptionIfEnteredPasswordIsIncorrect() {
        String url = "/sign_up";
        User user = new User();
        user.setPassword("qwert");
        user.setEmail("some@mail.com");

        userService.registration(user);
    }

    @Test
    public void resetPasswordAndSendNewOnEmail() {
        User user = new User();
        user.setEmail("some@mail.com");
        user.setPassword("Qwerty1!");
        user.setId(1L);

        when(userRepository.findByEmail("some@mail.com")).thenReturn(Optional.of(user));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(encoder.encode(any(CharSequence.class))).thenReturn("Qwerty123!@#");
        when(userRepository.update(user)).thenReturn(user);

        userService.resetPassword("some@mail.com");
        assertEquals("Qwerty123!@#", user.getPassword());
        verify(userRepository, times(3)).findByEmail("some@mail.com");
        verify(userRepository, times(1)).findById(1L);
        verify(encoder, times(1)).encode(any(CharSequence.class));
        verify(userRepository, times(1)).update(user);
        verify(mailService, times(1)).send(
                ArgumentMatchers.eq("some@mail.com"),
                ArgumentMatchers.contains("Change password"),
                ArgumentMatchers.contains("You received this email because you requested to reset your password.")
        );
    }

    @Test(expected = IncorrectEmailException.class)
    public void throwIncorrectEmailExceptionIfEnteredEmailIsIncorrect() {
        User user = new User();
        user.setEmail("afvadf");
        user.setPassword("Qwerty1!");
        user.setId(1L);

        userService.resetPassword(user.getEmail());
    }
}
