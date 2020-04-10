package com.softserve.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TeacherWishesDTO {
    private Long id;
    private JsonNode wishList;
}
