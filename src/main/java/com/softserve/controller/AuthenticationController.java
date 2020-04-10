package com.softserve.controller;

import com.softserve.dto.*;
import com.softserve.entity.User;
import com.softserve.security.jwt.JwtTokenProvider;
import com.softserve.service.UserService;
import com.softserve.service.mapper.UserMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
@Api(tags = "Authentication API")
@Slf4j
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final UserMapper userMapper;

    @Autowired
    public AuthenticationController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, UserService userService, UserMapper userMapper) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping("/sign_in")
    @ApiOperation(value = "Get credentials  for login")
    public ResponseEntity<AuthenticationResponseDTO> signIn(@RequestBody AuthenticationRequestDTO requestDto) {
        log.info("Enter into signIn method with user email {}", requestDto.getUsername());
        String username = requestDto.getUsername();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, requestDto.getPassword()));
        User user = userService.findByEmail(username);
        String token = jwtTokenProvider.createToken(username, user.getRole().toString());
        AuthenticationResponseDTO authenticationResponseDTO = new AuthenticationResponseDTO(username, token);

        return ResponseEntity.ok(authenticationResponseDTO);
    }

    @PostMapping("/sign_up")
    @ApiOperation(value = "Get credentials for registration")
    public ResponseEntity<MessageDTO> signUp(@RequestBody RegistrationRequestDTO registrationDTO, HttpServletRequest request) {
        log.info("Enter into signUp method with user email {}", registrationDTO.getEmail());
        User user = userMapper.toCreateUser(registrationDTO);
        String url = String.valueOf(request.getRequestURL());
        User createUser = userService.registration(user, url);
        String message = "You have successfully registered. Please, check Your email '" + createUser.getEmail() + "' to activate profile.";
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setMessage(message);

        return ResponseEntity.status(HttpStatus.CREATED).body(messageDTO);
    }

    @PutMapping("/activation_account")
    @ApiOperation(value = "Update token after activation successfully account")
    public ResponseEntity<MessageDTO> activationAccount(@RequestParam("token") String token) {
        log.info("Enter into activationAccount method");
        User user = userService.findByToken(token);
        user.setToken("");
        userService.update(user);
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setMessage("You successfully activate Your account.");

        return ResponseEntity.status(HttpStatus.OK).body(messageDTO);
    }

    @PutMapping("/reset_password")
    @ApiOperation(value = "Reset password by email")
    public ResponseEntity<MessageDTO> resetPassword(@RequestParam("email") String email) {
        log.info("Enter into resetPassword method  with email:{}", email);
        userService.resetPassword(email);
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setMessage("Check Your email, please. A new password has been sent to Your email.");

        return ResponseEntity.ok().body(messageDTO);
    }

    @PostMapping("/sign_out")
    @ApiOperation(value = "Making the logout")
    public void signOut(HttpServletRequest rq, HttpServletResponse rs) {
        log.info("Enter into signOut method");
        SecurityContextLogoutHandler securityContextLogoutHandler = new SecurityContextLogoutHandler();
        securityContextLogoutHandler.logout(rq, rs, null);
    }
}
