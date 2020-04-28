package com.softserve.service;

import com.softserve.entity.User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Optional;

public interface UserService extends BasicService <User, Long> {
    User findByEmail(String email);
    User findByToken(String token);
    User registration(User user);
    void resetPassword(String email);
    User createSocialUser(OAuth2User oAuth2User);
    Optional<User> findSocialUser(String email);
}
