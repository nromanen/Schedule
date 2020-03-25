package com.softserve.controller;

import com.softserve.dto.UserCreateDTO;
import com.softserve.dto.UserDTO;
import com.softserve.entity.User;
import com.softserve.service.UserService;
import com.softserve.service.mapper.UserMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("users")
@Api(tags = "User")
public class UserController {

    @Autowired
    private final UserService userService;

    private final UserMapper userMapper;

    @GetMapping
    @ApiOperation(value = "Get the list of all users")

    public ResponseEntity<List<UserDTO>> getAll() {
        log.info("Enter into list method of {}", getClass().getName());
        return ResponseEntity.status(HttpStatus.OK).body(userMapper.toUserDTOs(userService.getAll()));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "Get user by id")
    public ResponseEntity<UserDTO> get(@PathVariable("id") Long id){
        log.info("Enter into get method of {} with id {} ", getClass().getName(), id);
        User user = userService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(userMapper.toUserDTO(user));
    }

    @PostMapping
    @ApiOperation(value = "Create new user")
    public ResponseEntity<UserCreateDTO> save(@RequestBody UserCreateDTO createUserDTO) {
        log.info("Enter into save method of {} with createUserDTO: {}",getClass().getName(), createUserDTO);
        User user = userService.save(userMapper.toUser(createUserDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toUserCreateDTO(user));
    }


    @PutMapping
    @ApiOperation(value = "Update existing user by id")
    public ResponseEntity<UserCreateDTO> update(@RequestBody UserCreateDTO userDTO) {
        log.info("Enter into update method of {} with userDTO: {}", getClass().getName(), userDTO);
        User updatedUser = userMapper.toUser(userDTO);
        userService.update(updatedUser);
        return ResponseEntity.status(HttpStatus.OK).body(userMapper.toUserCreateDTO(updatedUser));
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete user by id")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        log.info("Enter into delete method of {} with  group id: {}", getClass().getName(), id);
        User user = userService.getById(id);
        userService.delete(user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
