package com.softserve.service;

import com.softserve.entity.Period;
import com.softserve.exception.IncorrectTimeException;
import com.softserve.exception.PeriodConflictException;

import java.util.List;

public interface PeriodService extends BasicService<Period, Long> {

    /**
     * Validates and saves a list of periods.
     *
     * @param periods the list of periods
     * @return the list of saved periods
     * @throws IncorrectTimeException  if the start time of the period was after its end or the start time was equal to the end time
     * @throws PeriodConflictException if some periods intersected with others periods
     */
    List<Period> save(List<Period> periods);

    /**
     * Returns the list of first four periods.
     *
     * @return the list of periods
     */
    List<Period> getFirstFourPeriods();
}
