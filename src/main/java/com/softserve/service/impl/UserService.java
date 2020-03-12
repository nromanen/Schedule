package com.softserve.service.impl;

import com.softserve.DAO.UserDAO;
import com.softserve.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class UserService {

    private final UserDAO userDAO;

    @Autowired
    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public User get(long id) {
        return userDAO.get(id);
    }

    public User findByUsername(String username) {
        return userDAO.findByUsername(username);
    }
}

