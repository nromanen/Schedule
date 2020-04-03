package com.softserve.controller;

import com.softserve.dto.TeacherWishesDTO;
import com.softserve.entity.TeacherWishes;
import com.softserve.service.TeacherWishesService;
import com.softserve.service.mapper.TeacherWishesMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Api(tags = "Teacher Wishes API")
@RequestMapping("/teacher_wishes")
@Slf4j
public class TeacherWishesController {
    private final TeacherWishesService teacherWishesService;
    private final TeacherWishesMapper teacherWishesMapper;

    @Autowired
    public TeacherWishesController(TeacherWishesService teacherWishesService, TeacherWishesMapper teacherWishesMapper) {
        this.teacherWishesService = teacherWishesService;
        this.teacherWishesMapper = teacherWishesMapper;
    }


    @PutMapping()
    @ApiOperation(value = "Update existing wish by id")
    public ResponseEntity<TeacherWishesDTO> update(@RequestBody TeacherWishesDTO teacherWishesDTO) {
        log.info("Enter into update method with TeacherWishesDTO: {}", teacherWishesDTO);
        teacherWishesService.getById(teacherWishesDTO.getId());
        TeacherWishes teacherWishes = teacherWishesService.update(teacherWishesMapper.teacherWishesDTOToTeacherWishes(teacherWishesDTO));
        return ResponseEntity.status(HttpStatus.OK).body(teacherWishesMapper.teacherWishesToTeacherWishesDTO(teacherWishes));
    }

}
