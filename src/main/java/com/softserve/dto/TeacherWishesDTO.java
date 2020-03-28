package com.softserve.dto;

import com.fasterxml.jackson.databind.JsonNode;

public class TeacherWishesDTO {
    private Long id;
    private long teacher_id;
    private long semester_id;
    private JsonNode wishList;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getTeacher_id() {
        return teacher_id;
    }

    public void setTeacher_id(long teacher_id) {
        this.teacher_id = teacher_id;
    }

    public long getSemester_id() {
        return semester_id;
    }

    public void setSemester_id(long semester_id) {
        this.semester_id = semester_id;
    }

    public JsonNode getWishList() {
        return wishList;
    }

    public void setWishList(JsonNode wishList) {
        this.wishList = wishList;
    }
}
