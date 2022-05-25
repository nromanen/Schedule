package com.softserve.service;

import com.softserve.entity.User;
import com.softserve.entity.enums.Role;
import com.softserve.exception.IncorrectPasswordException;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.List;
import java.util.Optional;

public interface UserService extends BasicService<User, Long> {

    /**
     * The method used for getting User by email from database
     *
     * @param email String email used to find User by it
     * @return User entity
     */
    User findByEmail(String email);

    /**
     * The method used for getting User by token from database
     *
     * @param token String token used to find User by it
     * @return User entity
     */
    User findByToken(String token);

    /**
     * The method used for registration User
     *
     * @param user Entity User used for registration User in system
     * @return User entity
     * @throws IncorrectPasswordException when password is incorrect or not strong enough
     */
    User registration(User user);

    /**
     * The method used for reset User password
     *
     * @param email used for getting user by email
     */
    void resetPassword(String email);

    /**
     * The method used for create User after sign in with Oauth2 Social
     *
     * @param oAuth2User OAuth2User - credentials for save User in db
     * @return User entity
     */
    User createSocialUser(OAuth2User oAuth2User);

    /**
     * The method used for getting Optional<User> by email from database
     *
     * @param email String email used to find User by it
     * @return Optional<User> entity
     */
    Optional<User> findSocialUser(String email);

    /**
     * The method used for getting list of users from database, that have role USER in system
     *
     * @return list of entities User
     */
    List<User> getAllUsersWithRoleUser();

    /**
     * The method used for change password for current user
     *
     * @param user        User entity
     * @param oldPassword String password, that use user for sign in up to now
     * @param newPassword String password, that will use user for sign in in future
     * @return Optional<User> entity
     */
    String changePasswordForCurrentUser(User user, String oldPassword, String newPassword);

    /**
     * The method used for automatic registration User
     *
     * @param email email used for registration User in system
     * @param role  role used for registration User in system
     * @return User entity
     * @throws IncorrectPasswordException when password is incorrect or not strong enough
     */
    User automaticRegistration(String email, Role role);

}

