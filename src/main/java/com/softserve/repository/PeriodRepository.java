package com.softserve.repository;

import com.softserve.entity.Period;

import java.util.List;
import java.util.Optional;

public interface PeriodRepository extends BasicRepository<Period, Long> {
    Optional<Period> findByName(String name);

    List<Period> getFistFourPeriods();
}
