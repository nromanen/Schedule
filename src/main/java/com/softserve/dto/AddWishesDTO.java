package com.softserve.dto;

import com.softserve.entity.Teacher;
import com.softserve.entity.Wishes;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddWishesDTO {
    private Teacher teacher;
    private Wishes[] teacherWishesList;
}
