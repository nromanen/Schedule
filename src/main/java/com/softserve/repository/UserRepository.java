package com.softserve.repository;

import com.softserve.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends BasicRepository<User, Long> {

    /**
     * The method used for getting User by email from database
     *
     * @param email String email used to find User by it
     * @return User
     */
    Optional<User> findByEmail(String email);

    /**
     * The method used for getting User by token from database
     *
     * @param token String token used to find User by it
     * @return User
     */
    Optional<User> findByToken(String token);

    /**
     * The method used for getting list of users from database, that have role USER in system
     *
     * @return list of entities Teacher
     */
    List<User> getAllUsersWithRoleUser();
}
