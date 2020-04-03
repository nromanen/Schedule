package com.softserve.dto;

import com.fasterxml.jackson.databind.JsonNode;

public class TeacherWishesDTO {
    private Long id;
    private JsonNode wishList;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public JsonNode getWishList() {
        return wishList;
    }

    public void setWishList(JsonNode wishList) {
        this.wishList = wishList;
    }
}
