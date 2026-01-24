package com.softserve.controller;

import com.softserve.dto.EmailMessageDTO;
import com.softserve.dto.UserCreateDTO;
import com.softserve.dto.UserDTO;
import com.softserve.dto.UserDataDTO;
import com.softserve.entity.CurrentUser;
import com.softserve.entity.User;
import com.softserve.entity.enums.Role;
import com.softserve.mapper.UserMapper;
import com.softserve.security.jwt.JwtUser;
import com.softserve.service.MailService;
import com.softserve.service.TeacherService;
import com.softserve.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("users")
@Tag(name = "User API")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final TeacherService teacherService;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    @GetMapping
    @Operation(summary = "Get the list of all users")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<UserDTO>> getAll() {
        log.info("Getting all users");
        return ResponseEntity.ok(userMapper.toUserDTOs(userService.getAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<UserDTO> getById(@PathVariable Long id) {
        log.info("Getting user by id: {}", id);
        User user = userService.getById(id);
        return ResponseEntity.ok(userMapper.toUserDTO(user));
    }

    @PostMapping
    @Operation(summary = "Create new user")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<UserCreateDTO> create(@RequestBody UserCreateDTO createUserDTO) {
        log.info("Creating user: {}", createUserDTO);
        User user = userService.save(userMapper.toUser(createUserDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toUserCreateDTO(user));
    }

    @PutMapping
    @Operation(summary = "Update existing user by id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<UserCreateDTO> update(@RequestBody UserCreateDTO userDTO) {
        log.info("Updating user: {}", userDTO);
        User updatedUser = userMapper.toUser(userDTO);
        User existingUser = userService.getById(updatedUser.getId());

        updatedUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        updatedUser.setRole(existingUser.getRole());
        updatedUser.setToken(existingUser.getToken());

        userService.update(updatedUser);
        return ResponseEntity.ok(userMapper.toUserCreateDTO(updatedUser));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user by id")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("Deleting user by id: {}", id);
        User user = userService.getById(id);

        if (user.getRole() == Role.ROLE_TEACHER) {
            teacherService.removeUserFromTeacher(user.getId());
        }

        userService.delete(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/with-role-user")
    @Operation(summary = "Get the list of all users that have role User")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<UserDTO>> getAllUsersWithRoleUser() {
        log.info("Getting all users with role USER");
        return ResponseEntity.ok(userMapper.toUserDTOs(userService.getAllUsersWithRoleUser()));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current user data")
    public ResponseEntity<UserDataDTO> getCurrentUserProfile(@CurrentUser JwtUser jwtUser) {
        log.info("Getting profile for user: {}", jwtUser.getUsername());
        User user = userService.getById(jwtUser.getId());

        if (user.getRole() == Role.ROLE_TEACHER) {
            UserDataDTO userData = teacherService.getUserDataByUserId(user.getId());
            return ResponseEntity.ok(userData);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/send-email")
    @Operation(summary = "Send email")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Void> sendEmail(@CurrentUser JwtUser jwtUser,
                                          @ModelAttribute EmailMessageDTO emailMessageDTO) {
        log.info("Sending email from user: {}", jwtUser.getUsername());
        mailService.send(jwtUser.getUsername(), emailMessageDTO);
        return ResponseEntity.ok().build();
    }
}
