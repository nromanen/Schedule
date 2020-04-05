package com.softserve.service.impl;

import com.softserve.entity.User;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.UserRepository;
import com.softserve.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
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

    // method for checking email in database
    private boolean emailExists(String email) {
        log.info("Enter into emailExists method with email:{}", email);
        return userRepository.findByEmail(email).isPresent();
    }
}
