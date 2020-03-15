package com.softserve.service.impl;

import com.softserve.entity.User;
import com.softserve.repository.UserRepository;
import com.softserve.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public List<User> getAll() {
        return userRepository.getAll();
    }

    @Override
    public User save(User object) {
        return userRepository.save(object);
    }

    @Override
    public User update(User object) {
        return userRepository.update(object);
    }

    @Override
    public User delete(User object) {
        return userRepository.delete(object);
    }
}
