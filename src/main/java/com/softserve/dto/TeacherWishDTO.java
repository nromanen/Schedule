package com.softserve.dto;

import com.softserve.entity.TeacherWishes;
import lombok.Data;

import java.util.List;

@Data
public class TeacherWishDTO {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private String position;
    private List<TeacherWishes> teacherWishesList;
}
