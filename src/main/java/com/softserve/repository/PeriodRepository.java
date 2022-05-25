package com.softserve.repository;

import com.softserve.entity.Period;

import java.util.List;
import java.util.Optional;

public interface PeriodRepository extends BasicRepository<Period, Long> {

    /**
     * The method used for getting Period by name from database
     *
     * @param name String email used to find User by it
     * @return Period
     */
    Optional<Period> findByName(String name);

    List<Period> getFistFourPeriods();
}
