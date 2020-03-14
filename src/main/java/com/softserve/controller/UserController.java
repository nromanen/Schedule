package com.softserve.controller;

import com.softserve.dto.UserDTO;
import com.softserve.entity.User;
import com.softserve.service.UserService;
import com.softserve.service.mapper.impl.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("user")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @Autowired
    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }


    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll() {
        List<User> users = userService.getAll();
        return ResponseEntity.ok()
                .body(users.stream().map(userMapper::convertToDto).collect(Collectors.toList()));
    }


    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> get(@PathVariable("id") long id) {
        if (userService.getById(id).isPresent()) {
            return ResponseEntity.ok().body(userMapper.convertToDto(userService.getById(id).get()));
        }
        return null;
    }
}
