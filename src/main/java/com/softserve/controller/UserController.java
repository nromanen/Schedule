package com.softserve.controller;

import com.softserve.dto.CreateUserDTO;
import com.softserve.dto.UserDTO;
import com.softserve.entity.User;
import com.softserve.service.UserService;
import com.softserve.service.mapper.impl.CreateUserMapper;
import com.softserve.service.mapper.impl.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("user")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final CreateUserMapper createUserMapper;

    @Autowired
    public UserController(UserService userService, UserMapper userMapper, CreateUserMapper createUserMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.createUserMapper = createUserMapper;
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    public ResponseEntity<CreateUserDTO> save(@RequestBody CreateUserDTO createUserDTO) {
         {
            User user = createUserMapper.convertToEntity(createUserDTO);
            User userCreated = userService.save(user);

             return ResponseEntity.ok(createUserMapper.convertToDto(userCreated));}
    }
}
