package com.softserve.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class TeacherWishesDTO {
    private Long id;
    private String teacher_id;
    private String semester_id;
    private JsonNode wishList;
}
