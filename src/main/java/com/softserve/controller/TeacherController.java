package com.softserve.controller;

import com.softserve.entity.Teacher;
import com.softserve.service.TeacherService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Api(tags = "Car API")
public class TeacherController {

    final private TeacherService teacherServiceImpl;

    @Autowired
    public TeacherController(TeacherService teacherServiceImpl) {
        this.teacherServiceImpl = teacherServiceImpl;
    }


    @GetMapping("/teacher")
    @ApiOperation(value = "Get the list of all cars")
    public ResponseEntity<List<Teacher>> list() {
        List<Teacher> cars = teacherServiceImpl.getAll();
        return ResponseEntity.ok().body(cars);
    }
}
