package com.softserve.repository.impl;

import com.softserve.entity.Period;
import com.softserve.repository.PeriodRepository;
import org.springframework.stereotype.Repository;

@Repository
public class PeriodRepositoryImpl extends BasicRepositoryImpl<Period, Long> implements PeriodRepository {
}
