package com.softserve.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.softserve.entity.TeacherWishes;
import com.softserve.entity.enums.EvenOdd;
import java.time.DayOfWeek;

public interface TeacherWishesService extends BasicService<TeacherWishes, Long> {
    boolean isClassSuits(Long teacherId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);
    boolean isTeacherSchemaValid(JsonNode teacherWish);
}
