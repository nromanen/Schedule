package com.softserve.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.softserve.entity.Teacher;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddWishesDTO {
    private Teacher teacher;
    private JsonNode wishList;
}
