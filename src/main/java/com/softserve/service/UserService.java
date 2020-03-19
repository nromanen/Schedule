package com.softserve.service;

import com.softserve.entity.User;

public interface UserService extends BasicService <User, Long> {
    User findByUsername(String username);
}
