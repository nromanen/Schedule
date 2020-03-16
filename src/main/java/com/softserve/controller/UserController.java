package com.softserve.controller;

import com.softserve.dto.UserCreateDTO;
import com.softserve.dto.UserDTO;
import com.softserve.entity.User;
import com.softserve.service.UserService;
import com.softserve.service.mapper.UserCreateMapper;
import com.softserve.service.mapper.UserMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RequiredArgsConstructor
@RestController
@RequestMapping("user")
@Api(tags = "User")
public class UserController {

    @Autowired
    private final UserService userService;

    private final UserMapper userMapper;
    private final UserCreateMapper userCreateMapper;


    @GetMapping
    @ApiOperation(value = "Get the list of all users")
    public ResponseEntity<List<UserDTO>> getAll() {
        return ResponseEntity.ok(userMapper.toUserDTOs(userService.getAll()));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "Get user by id")
    public ResponseEntity<UserDTO> get(@PathVariable("id") Long id) {
        Optional<User> userOptional = userService.getById(id);
        //to do exception
        return userOptional.map(user -> ResponseEntity.ok(userMapper.toUserDTO(user))).orElse(null);

    }

    @PostMapping
    @ApiOperation(value = "Create new user")
    public ResponseEntity<UserCreateDTO> save(@RequestBody UserCreateDTO createUserDTO) {
        userService.save(userCreateMapper.toUser(createUserDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(createUserDTO);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Update existing user by id")
    public ResponseEntity<UserCreateDTO> update(@PathVariable Long id, @RequestBody UserCreateDTO updateUserDTO) {
        User user = userCreateMapper.toUser(updateUserDTO);
        user.setId(id);
        userService.update(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(updateUserDTO);
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete user by id")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        Optional<User> userOptional = userService.getById(id);
        userOptional.ifPresent(userService::delete);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}