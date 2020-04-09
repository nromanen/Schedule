package com.softserve.service;

import com.softserve.entity.User;

public interface UserService extends BasicService <User, Long> {
    User findByEmail(String email);
    User findByToken(String token);
    User registration(User user, String url);
    void resetPassword(String email);
}
