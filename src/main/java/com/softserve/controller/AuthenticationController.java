package com.softserve.controller;

import com.softserve.dto.*;
import com.softserve.entity.User;
import com.softserve.mapper.UserMapper;
import com.softserve.security.jwt.JwtTokenProvider;
import com.softserve.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import static com.softserve.service.impl.UserServiceImpl.PASSWORD_FOR_SOCIAL_USER;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication API")
@Slf4j
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final UserMapper userMapper;

    @Value("${app.backend.url}")
    private String url;

    @Autowired
    public AuthenticationController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
                                    UserService userService, UserMapper userMapper) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping("/sign-in")
    @Operation(summary = "Get credentials for login")
    public ResponseEntity<Object> signIn(@RequestBody AuthenticationRequestDTO requestDto) {
        log.info("Enter into signIn method with user email {}", requestDto.getEmail());
        User user = userService.findSocialUser(requestDto.getEmail()).orElseThrow(() ->
                new BadCredentialsException("Invalid password or email")
        );
        if (user.getPassword().equals(PASSWORD_FOR_SOCIAL_USER)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageDTO("You registered via social network. Please, sign in via social network."));
        }
        String username = requestDto.getEmail();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, requestDto.getPassword()));
        String token = jwtTokenProvider.createToken(username, user.getRole().toString());

        return ResponseEntity.ok(new AuthenticationResponseDTO(username, token));
    }

    @PostMapping("/sign-up")
    @Operation(summary = "Get credentials for registration")
    public ResponseEntity<MessageDTO> signUp(@RequestBody RegistrationRequestDTO registrationDTO) {
        log.info("Enter into signUp method with user email {}", registrationDTO.getEmail());
        User user = userMapper.toCreateUser(registrationDTO);
        User createUser = userService.registration(user);
        String message = "You have successfully registered. Please, check Your email '" + createUser.getEmail() + "' to activate profile.";
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageDTO(message));
    }

    @PutMapping("/activation-account")
    @Operation(summary = "Activate account by token")
    public ResponseEntity<MessageDTO> activationAccount(@RequestParam("token") String token) {
        log.info("Enter into activationAccount method");
        User user = userService.findByToken(token);
        user.setToken(null);
        user.setActivated(true);
        userService.update(user);

        return ResponseEntity.ok(new MessageDTO("You successfully activated your account."));
    }

    @PutMapping("/reset-password")
    @Operation(summary = "Send reset password link to email")
    public ResponseEntity<MessageDTO> resetPassword(@RequestParam("email") String email) {
        log.info("Enter into resetPassword method with email:{}", email);
        userService.resetPassword(email);

        return ResponseEntity.ok(new MessageDTO("Check your email, please. A password reset link has been sent."));
    }

    @PutMapping("/set-password")
    @Operation(summary = "Set password and activate account")
    public ResponseEntity<MessageDTO> setPassword(@RequestBody SetPasswordRequest request) {
        log.info("Enter into setPassword method");
        userService.setPasswordByToken(request.token(), request.password());
        return ResponseEntity.ok(new MessageDTO("Password set successfully. You can now sign in."));
    }

    @PostMapping("/sign-out")
    @Operation(summary = "Making the logout")
    public void signOut(HttpServletRequest rq, HttpServletResponse rs) {
        log.info("Enter into signOut method");
        SecurityContextLogoutHandler securityContextLogoutHandler = new SecurityContextLogoutHandler();
        securityContextLogoutHandler.logout(rq, rs, null);
    }

    @GetMapping("/social/login-success")
    @Operation(summary = "Get token after successful sign in via social network")
    public ResponseEntity<MessageDTO> getLoginInfo(@RequestParam("token") String token) {
        log.info("Enter into getLoginInfo method");
        return ResponseEntity.ok(new MessageDTO(token));
    }

    @GetMapping("/google")
    public ResponseEntity<String> getGoogleSignIn(HttpServletResponse response) throws IOException {
        response.sendRedirect(url + "oauth_login/google");
        return ResponseEntity.ok("Ok");
    }
}
