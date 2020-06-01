package com.softserve.dto;

import com.softserve.entity.Wishes;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class WishesWithTeacherDTO {
    private Long id;
    private TeacherIdDTO teacher;
    private Wishes[] teacherWishesList;
}
