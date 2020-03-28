package com.softserve.dto;

import com.softserve.entity.TeacherWishes;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Data
@NoArgsConstructor
public class TeacherMapperWishDTO {
    private long id;
    private String name;
    private String surname;
    private String patronymic;
    private String position;
    private List<TeacherWishes> teacherWishesList;
}