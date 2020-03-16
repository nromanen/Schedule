package com.softserve.service.impl;

import com.softserve.entity.Period;
import com.softserve.repository.PeriodRepository;
import com.softserve.service.PeriodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
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
    public Optional<Period> getById(Long id) {
        return periodRepository.findById(id);
    }

    @Override
    public List<Period> getAll() {
        return periodRepository.getAll();
    }

    @Override
    public Period save(Period object) {
        if (object.getStartTime().after(object.getEndTime())) {
            return null;
        }
        if (isPeriodFree(getAll(), object)) {
            return periodRepository.save(object);
        }
        return null;
    }

    @Override
    public List<Period> save(List<Period> objects) {
        if (!objects.stream().allMatch(period -> period.getStartTime().before(period.getEndTime()))) {
            //throw custom exception
            return null;
        }
        if (isListOfPeriodsFree(getAll(), objects)) {
            return objects.stream().map(periodRepository::save).collect(Collectors.toList());
        }
        //throw custom exception
        return null;
    }

    @Override
    public Period update(Period object) {
        return periodRepository.update(object);
    }

    @Override
    public Period delete(Period object) {
        return periodRepository.delete(object);
    }


    private boolean isPeriodFree(List<Period> oldPeriods, Period newPeriod) {
        return oldPeriods.stream().noneMatch
                (oldPeriod ->
                        newPeriod.getStartTime().
                            before(oldPeriod.getEndTime())
                        &
                        newPeriod.getEndTime().
                                after(oldPeriod.getStartTime())
                );
    }

    private boolean isListOfPeriodsFree(List<Period> oldPeriods, List<Period> newPeriods) {
        for(Period newPeriod : newPeriods){
            if(!isPeriodFree(newPeriods, newPeriod) & !isPeriodFree(oldPeriods, newPeriod)){
                //throw custom exception
                return false;
            }
        }
        return true;
    }
}
