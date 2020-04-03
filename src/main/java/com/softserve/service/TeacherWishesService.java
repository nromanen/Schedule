package com.softserve.service;

import com.softserve.entity.TeacherWishes;
import com.softserve.entity.enums.EvenOdd;
import java.time.DayOfWeek;

public interface TeacherWishesService extends BasicService<TeacherWishes, Long> {
    boolean isClassSuits(Long teacherId, Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);
}
