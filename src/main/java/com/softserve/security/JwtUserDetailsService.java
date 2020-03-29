package com.softserve.security;

import com.softserve.entity.User;
import com.softserve.security.jwt.JwtUserFactory;
import com.softserve.service.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    private final UserService userService;

    public JwtUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findByEmail(username);

        if (user == null) {
            //TODO refactor to EntityNotFoundException
            throw new UsernameNotFoundException("User with username:" + username + " not found");
        }

        return JwtUserFactory.create(user);
    }
}
