package com.softserve.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(value = "/test")
@Api(tags = "Test Security API")
public class TestSecurityController {

    @GetMapping
    @ApiOperation(value = "Test method")
    public ResponseEntity logout(HttpServletRequest rq, HttpServletResponse rs) {
        return ResponseEntity.ok("Successful security testing");
    }
}
