package com.softserve.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping(value = "/test")
@Api(tags = "Test Security API")
public class TestSecurityController {

    @GetMapping
    @ApiOperation(value = "Test method")
    public ResponseEntity test() {
        return ResponseEntity.status(HttpStatus.OK).body("Successful security testing");
    }
}
