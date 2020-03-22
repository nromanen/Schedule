package com.softserve.service.impl;

import com.softserve.entity.Period;
import com.softserve.exception.IncorrectTimeException;
import com.softserve.exception.PeriodsException;
import com.softserve.repository.PeriodRepository;
import com.softserve.service.PeriodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
public class PeriodServiceImpl implements PeriodService {

    private final PeriodRepository periodRepository;

    @Autowired
    public PeriodServiceImpl(PeriodRepository periodRepository) {
        this.periodRepository = periodRepository;
    }

    @Override
    public Period getById(Long id) {
        return periodRepository.findById(id).orElseThrow(
                () -> new PeriodsException("period doesn't exist")
        );
    }

    @Override
    public List<Period> getAll() {
        return periodRepository.getAll();
    }

    @Override
    public Period save(Period object) {
        if (isTimeInvalid(object)) {
            throw new IncorrectTimeException("incorrect time in period");
        }
        if (isPeriodFree(getAll(), object)) {
            return periodRepository.save(object);
        } else {
            throw new PeriodsException("your period has conflict with already existed periods");
        }
    }

    @Override
    public List<Period> save(List<Period> objects) throws IncorrectTimeException {
        if (objects.stream().anyMatch(this::isTimeInvalid)) {
            throw new IncorrectTimeException("Incorrect time in period");
        }
        if (isListOfPeriodsFree(getAll(), objects)) {
            return objects.stream().map(periodRepository::save).collect(Collectors.toList());
        } else {
            throw new PeriodsException("Some periods have conflict with already existed periods");
        }
    }

    @Override
    public Period update(Period object) {
        return periodRepository.update(object);
    }

    @Override
    public Period delete(Period object) {
        return periodRepository.delete(object);
    }


    private boolean isListOfPeriodsFree(List<Period> oldPeriods, List<Period> newPeriods) {
        for (Period newPeriod : newPeriods) {
            if (!isPeriodFree(newPeriods, newPeriod) || !isPeriodFree(oldPeriods, newPeriod)) {
                return false;
            }
        }
        return true;
    }

    private boolean isPeriodFree(List<Period> oldPeriods, Period newPeriod) {
        return oldPeriods.stream().noneMatch
                (oldPeriod ->
                        isPeriodsGlued(newPeriod, oldPeriod) || isPeriodsIntersect(newPeriod, oldPeriod)
                );
    }

    private boolean isPeriodsIntersect(Period newPeriod, Period oldPeriod) {
        return newPeriod.getStartTime().
                before(oldPeriod.getEndTime())
                && newPeriod.getEndTime().
                after(oldPeriod.getStartTime())
                && !newPeriod.equals(oldPeriod);
    }

    private boolean isPeriodsGlued(Period newPeriod, Period oldPeriod) {
        return newPeriod.getStartTime().equals(oldPeriod.getEndTime())
                || newPeriod.getEndTime().equals(oldPeriod.getStartTime());
    }

    private boolean isTimeInvalid(Period object) {
        return object.getStartTime().after(object.getEndTime()) ||
                object.getStartTime().equals(object.getEndTime());
    }
}


