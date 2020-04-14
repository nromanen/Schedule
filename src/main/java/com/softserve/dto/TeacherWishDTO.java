package com.softserve.dto;

import com.softserve.entity.TeacherWishes;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Setter
@Getter
public class TeacherWishDTO {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private String position;
    private ArrayList<TeacherWishes> teacherWishesList;
}
