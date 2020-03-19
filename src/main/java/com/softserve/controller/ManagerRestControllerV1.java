package com.softserve.controller;

import com.softserve.entity.User;
import com.softserve.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/v1/manager/")
@Api(tags = "Manager controller")
public class ManagerRestControllerV1 {

    private final UserService userService;

    @Autowired
    public ManagerRestControllerV1(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "user/{name}")
    @ApiOperation(value = "Get something")
    public ResponseEntity get(@PathVariable(name = "name") String name) {
        User user = userService.findByUsername(name);
        System.out.println(user);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
