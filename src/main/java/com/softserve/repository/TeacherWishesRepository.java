package com.softserve.repository;

import com.softserve.entity.TeacherWishes;
import com.softserve.entity.Wishes;
import java.util.List;

public interface TeacherWishesRepository extends BasicRepository<TeacherWishes, Long> {
    List<Wishes> getWishByTeacherId(Long teacherId);
    int countWishesByTeacherId(Long teacherId);
}