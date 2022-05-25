package com.softserve.service;

import com.softserve.entity.User;
import com.softserve.entity.enums.Role;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.List;
import java.util.Optional;

public interface UserService extends BasicService<User, Long> {
    User findByEmail(String email);

    User findByToken(String token);

    User registration(User user);

    void resetPassword(String email);

    User createSocialUser(OAuth2User oAuth2User);

    Optional<User> findSocialUser(String email);

    List<User> getAllUsersWithRoleUser();

    String changePasswordForCurrentUser(User user, String oldPassword, String newPassword);

    User automaticRegistration(String email, Role role);

}

