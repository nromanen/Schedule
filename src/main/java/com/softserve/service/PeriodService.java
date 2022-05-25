package com.softserve.service;

import com.softserve.entity.Period;
import com.softserve.exception.IncorrectTimeException;
import com.softserve.exception.PeriodConflictException;

import java.util.List;

public interface PeriodService extends BasicService<Period, Long> {

    /**
     * The method used for saving list of periods with validation
     *
     * @param periods list of periods
     * @return list of periods that have been saved
     * @throws IncorrectTimeException  when period begins after his end or begin equal to end
     * @throws PeriodConflictException when some periods intersect with others or periods
     */
    List<Period> save(List<Period> periods);

    List<Period> getFirstFourPeriods();
}
