package com.softserve.service;

import com.softserve.entity.Period;

import java.util.List;

public interface PeriodService extends BasicService<Period, Long> {
    List<Period> save(List<Period> periods);

    List<Period> getFirstFourPeriods();
}
