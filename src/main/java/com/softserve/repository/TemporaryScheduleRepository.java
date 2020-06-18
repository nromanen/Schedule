package com.softserve.repository;

import com.softserve.entity.*;
import java.time.LocalDate;

public interface TemporaryScheduleRepository extends BasicRepository<TemporarySchedule, Long> {
    Long isExistVacationByDate(LocalDate date);
    Long isExistTemporarySchedule(TemporarySchedule object);
}
