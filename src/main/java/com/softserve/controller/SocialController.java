package com.softserve.controller;

import com.softserve.dto.MessageDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/social")
@Slf4j
public class SocialController {

    @GetMapping("/loginSuccess")
    public ResponseEntity<MessageDTO> getLoginInfo(@RequestParam("token") String token) {
        return ResponseEntity.ok().body(new MessageDTO(token));
    }
}