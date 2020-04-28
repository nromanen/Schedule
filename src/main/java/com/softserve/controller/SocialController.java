package com.softserve.controller;

import com.softserve.dto.MessageDTO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/social")
@Api(tags = "Social API")
@Slf4j
public class SocialController {

    @GetMapping("/loginSuccess")
    @ApiOperation(value = "Get token after successful sign in via social network")
    public ResponseEntity<MessageDTO> getLoginInfo(@RequestParam("token") String token) {
        log.info("Enter into getLoginInfo method");
        return ResponseEntity.ok().body(new MessageDTO(token));
    }
}