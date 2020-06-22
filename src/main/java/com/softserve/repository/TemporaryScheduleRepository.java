package com.softserve.repository;

import com.softserve.entity.*;
import java.time.LocalDate;
import java.util.List;

public interface TemporaryScheduleRepository extends BasicRepository<TemporarySchedule, Long> {
    Long isExistTemporaryScheduleByVacationByDate(LocalDate date, Long semesterId, boolean vacation);
    Long isExistTemporarySchedule(TemporarySchedule object);
    Long isExistTemporaryScheduleWithIgnoreId(TemporarySchedule object);
    List<TemporarySchedule> getAllByTeacher(Long teacherId, Long semesterId);
}
