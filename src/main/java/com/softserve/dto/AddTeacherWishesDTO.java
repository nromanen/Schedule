package com.softserve.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.softserve.entity.Teacher;

public class AddTeacherWishesDTO {

    private Teacher teacher;
    private JsonNode wishList;

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public JsonNode getWishList() {
        return wishList;
    }

    public void setWishList(JsonNode wishList) {
        this.wishList = wishList;
    }
}
