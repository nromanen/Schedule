package com.softserve.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.softserve.entity.TeacherWishes;
import com.softserve.entity.Wishes;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;

public interface TeacherWishesRepository extends BasicRepository<TeacherWishes, Long> {
    void validateTeacherWish(JsonNode teacherWish);
    boolean isClassSuits(Long teacherId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);
    Long isExistsWishWithTeacherId(Long teacherId);
}