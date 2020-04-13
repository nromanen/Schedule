package com.softserve.repository;

import com.softserve.entity.TeacherWishes;
import com.softserve.entity.Wishes;

public interface TeacherWishesRepository extends BasicRepository<TeacherWishes, Long> {
    void validateTeacherWish(Wishes[] teacherWishesList);
    Wishes[] getWishByTeacherId(Long teacherId);
    Long isExistsWishWithTeacherId(Long teacherId);
    void isTeacherSchemaValid(Wishes[] teacherWish);
}