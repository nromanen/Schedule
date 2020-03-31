package com.softserve.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.softserve.entity.TeacherWishes;

public interface TeacherWishesRepository extends BasicRepository<TeacherWishes, Long> {
    void validateTeacherWish(JsonNode teacherWish);
}