package com.softserve.dto;

import com.softserve.entity.Wishes;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TeacherWishesDTO {
    private Long id;
    private Wishes[] teacherWishesList;
}
