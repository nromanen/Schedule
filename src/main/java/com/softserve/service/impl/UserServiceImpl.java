package com.softserve.service.impl;

import com.softserve.entity.User;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.exception.IncorrectPasswordException;
import com.softserve.repository.UserRepository;
import com.softserve.service.MailService;
import com.softserve.service.UserService;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.text.CharacterPredicates;
import org.apache.commons.text.RandomStringGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import static org.apache.commons.lang3.StringUtils.*;


@Slf4j
@Transactional
@Service
public class UserServiceImpl implements UserService {

    private static final char[] NUMBERS = ("0123456789").toCharArray();
    private static final char[] SPECIAL_CHARACTERS = ("!@#$%^&*").toCharArray();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, MailService mailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    /**
     * The method used for getting user by id
     *
     * @param id Identity user id
     * @return User entity
     * @throws EntityNotFoundException if user doesn't exist
     */
    @Override
    public User getById(Long id) {
        log.info("Enter into getById method with id {}", id);
        return userRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(User.class, "id", id.toString())
        );
    }

    /**
     * Method gets information about all users from Repository
     *
     * @return List of all users
     */
    @Override
    public List<User> getAll() {
        log.info("Enter into getAll method");
        return userRepository.getAll();
    }

    /**
     * The method used for saving user in database
     *
     * @param object new user
     * @return User entity
     * @throws FieldAlreadyExistsException when some of provided fields already exist in database
     */
    @Override
    public User save(User object) {
        log.info("Enter into save method with entity:{}", object);
        object.setPassword(passwordEncoder.encode(object.getPassword()));
        if (emailExists(object.getEmail())) {
            throw new FieldAlreadyExistsException(User.class, "email", object.getEmail());
        }
        return userRepository.save(object);
    }

    /**
     * The method used for updating user in database
     *
     * @param object updated user
     * @return User entity
     * @throws FieldAlreadyExistsException when some of provided fields already exist in database
     */
    @Override
    public User update(User object) {
        log.info("Enter into update method with entity:{}", object);
        getById(object.getId());
        if (userRepository.findByEmail(object.getEmail()).isPresent() &&
                userRepository.findByEmail(object.getEmail()).get().getId() != object.getId()) {
            throw new FieldAlreadyExistsException(User.class, "email", object.getEmail());
        }
        return userRepository.update(object);
    }

    /**
     * Method deletes an existing user from repository
     *
     * @param object user entity to be deleted
     * @return deleted user
     */
    @Override
    public User delete(User object) {
        log.info("Enter into delete method with entity:{}", object);
        return userRepository.delete(object);
    }

    /**
     * The method used for getting User by email from database
     *
     * @param email String email used to find User by it
     * @return User entity
     */
    @Override
    public User findByEmail(String email) {
        log.info("Enter into findByEmail method with email:{}", email);
        return userRepository.findByEmail(email).orElseThrow(
                () -> new EntityNotFoundException(User.class, "email", email)
        );
    }

    /**
     * The method used for getting User by token from database
     *
     * @param token String token used to find User by it
     * @return User entity
     */
    @Override
    public User findByToken(String token) {
        log.info("Enter into findByToken method with token:{}", token);
        return userRepository.findByToken(token).orElseThrow(
                () -> new EntityNotFoundException(User.class, "token", token)
        );
    }

    /**
     * The method used for registration User
     *
     * @param user Entity User used for registration User in system
     * @param url from which url get request with User
     * @return User entity
     * @throws IncorrectPasswordException when password is incorrect or not strong enough
     */
    @Override
    public User registration(User user, String url) {
        log.info("Enter into registration method  with email:{}", user.getEmail());
        User registrationUser = null;
        String password = user.getPassword();
        if (isNotBlank(password) && isMixedCase(password) && containsAny(password, NUMBERS)
                && containsAny(password, SPECIAL_CHARACTERS) && length(password) >= 8 && length(password) <= 30) {

            String token = UUID.randomUUID().toString();
            user.setToken(token);
            registrationUser = save(user);

            String registrationMessage = "Hello, " + user.getEmail() + ".\n" +
                    "You received this email because you requested to registration on our site.\n" +
                    "For successfully sign up and activate your profile, you have to follow the next link: ";
            String link = url.replace("sign_up", "");
            String linkForUser = link + "activation_account?token=" + token;
            String message = registrationMessage + " \r\n" + linkForUser;
            String subject = "Activation account";
            mailService.send(user.getEmail(), subject, message);
        } else {
            throw new IncorrectPasswordException("Password must contains at least: 8 characters(at least: 1 upper case, 1 lower case, " +
                    "1 number and 1 special character('!@#$%^&*')) and no more 30 characters.");
        }

        return registrationUser;
    }

    /**
     * The method used for reset User password
     *
     * @param email used for for getting user by email
     */
    @Override
    public void resetPassword(String email) {
        log.info("Enter into resetPassword method  with email:{}", email);
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            RandomStringGenerator pwdGenerator = new RandomStringGenerator.Builder()
                    .withinRange(33,123)
                    .filteredBy(CharacterPredicates.ASCII_ALPHA_NUMERALS)
                    .build();
            String password = pwdGenerator.generate(15);
            user.setPassword(passwordEncoder.encode(password));
            update(user);

            String message = "Hello, " + user.getEmail() + ".\n" +
                    "You received this email because you requested to reset your password.\n" +
                    "Below your can see your new password. After sign in site you should change this password on your new password: ";
            String bodyMessage = message + " \r\n" + "Password: " + password;
            String subject = "Change password";
            mailService.send(user.getEmail(), subject, bodyMessage);
        }
    }

    // method for checking email in database
    private boolean emailExists(String email) {
        log.info("Enter into emailExists method with email:{}", email);
        return userRepository.findByEmail(email).isPresent();
    }
}
