package com.softserve.repository;

import com.softserve.entity.User;

import java.util.Optional;

public interface UserRepository extends BasicRepository <User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByToken(String token);
}
