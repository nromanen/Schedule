package com.softserve.dto;

import com.fasterxml.jackson.databind.JsonNode;

public class AddTeacherWishesDTO {
    private Long teacher_id;
    private JsonNode wishList;

    public Long getTeacher_id() {
        return teacher_id;
    }

    public void setTeacher_id(Long teacher_id) {
        this.teacher_id = teacher_id;
    }

    public JsonNode getWishList() {
        return wishList;
    }

    public void setWishList(JsonNode wishList) {
        this.wishList = wishList;
    }
}
