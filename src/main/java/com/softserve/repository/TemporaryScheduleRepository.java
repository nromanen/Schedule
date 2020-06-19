package com.softserve.repository;

import com.softserve.entity.*;
import java.time.LocalDate;
import java.util.List;

public interface TemporaryScheduleRepository extends BasicRepository<TemporarySchedule, Long> {
    Long isExistVacationByDate(LocalDate date);
    Long isExistTemporarySchedule(TemporarySchedule object);
    List<TemporarySchedule> getAllByTeacher(Long teacherId, Long semesterId);
}
