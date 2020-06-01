package com.softserve.controller;

import com.softserve.dto.AddWishesDTO;
import com.softserve.dto.MessageDTO;
import com.softserve.dto.TeacherWishesDTO;
import com.softserve.dto.WishesWithTeacherDTO;
import com.softserve.entity.CurrentUser;
import com.softserve.entity.Teacher;
import com.softserve.entity.TeacherWishes;
import com.softserve.entity.User;
import com.softserve.entity.enums.Role;
import com.softserve.security.jwt.JwtUser;
import com.softserve.service.TeacherService;
import com.softserve.service.TeacherWishesService;
import com.softserve.mapper.TeacherWishesMapper;
import com.softserve.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Api(tags = "Teacher Wishes API")
@RequestMapping("/teacher_wishes")
@Slf4j
public class TeacherWishesController {
    private final TeacherWishesService teacherWishesService;
    private final TeacherWishesMapper teacherWishesMapper;
    private final UserService userService;
    private final TeacherService teacherService;

    @Autowired
    public TeacherWishesController(TeacherWishesService teacherWishesService, TeacherWishesMapper teacherWishesMapper, UserService userService, TeacherService teacherService) {
        this.teacherWishesService = teacherWishesService;
        this.teacherWishesMapper = teacherWishesMapper;
        this.userService = userService;
        this.teacherService = teacherService;
    }

    @GetMapping
    @ApiOperation(value = "Get the list of all teachers wishes")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<WishesWithTeacherDTO>> getAll() {
        log.info("Enter into getAll method");
        return ResponseEntity.ok(teacherWishesMapper.teacherWishesDTOsToTeacherWishes(teacherWishesService.getAll()));
    }

    @GetMapping(value = "/my-wishes")
    @ApiOperation(value = "Get the list of all wishes current teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<WishesWithTeacherDTO>> getAllCurrentTeacherWishes(@CurrentUser JwtUser jwtUser) {
        log.info("Enter into getAllCurrentTeacherWishes method");
        Teacher teacher = teacherService.findByUserId(Integer.parseInt(jwtUser.getId().toString()));
        return ResponseEntity.ok(teacherWishesMapper.teacherWishesDTOsToTeacherWishes(
                teacherWishesService.getAllCurrentTeacherWishes(teacher.getId())));
    }

    @PostMapping
    @ApiOperation(value = "Create new wish")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER')")
    public ResponseEntity<TeacherWishesDTO> save(@CurrentUser JwtUser jwtUser, @RequestBody AddWishesDTO addWishesDTO) {
        log.info("Enter into save method with AddWishesDTO: {}", addWishesDTO);
        User user = userService.findByEmail(jwtUser.getUsername());
        if (user.getRole() == Role.ROLE_TEACHER) {
            addWishesDTO.setTeacher(teacherService.findByUserId(Integer.parseInt(user.getId().toString())));
        }
        TeacherWishes teacherWishes = teacherWishesService.save(teacherWishesMapper.addTeacherWishesDTOToTeacherWishes(addWishesDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(teacherWishesMapper.teacherWishesToTeacherWishesDTO(teacherWishes));
    }

    @PutMapping
    @ApiOperation(value = "Update existing wish by id")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER')")
    public ResponseEntity update(@CurrentUser JwtUser jwtUser, @RequestBody TeacherWishesDTO teacherWishesDTO) {
        log.info("Enter into update method with TeacherWishesDTO: {}", teacherWishesDTO);
        TeacherWishes wishes = teacherWishesService.getById(teacherWishesDTO.getId());
        User user = userService.findByEmail(jwtUser.getUsername());
        if (user.getRole() == Role.ROLE_TEACHER) {
            Teacher teacher = teacherService.findByUserId(Integer.parseInt(user.getId().toString()));
            if (wishes.getTeacher().getId() != teacher.getId()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageDTO("You cannot update wishes another teacher."));
            }
        }
        TeacherWishes teacherWishes = teacherWishesService.update(teacherWishesMapper.teacherWishesDTOToTeacherWishes(teacherWishesDTO));
        return ResponseEntity.status(HttpStatus.OK).body(teacherWishesMapper.teacherWishesToTeacherWishesDTO(teacherWishes));
    }
}
