package com.softserve.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TeacherDTO {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private String position;
   // private List<TeacherWishes> teacherWishesList;
}
