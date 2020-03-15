package com.softserve.service.impl;

import com.softserve.entity.Period;
import com.softserve.repository.PeriodRepository;
import com.softserve.service.PeriodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
        return periodRepository.save(object);
    }

    @Override
    public Period update(Period object) {
        return periodRepository.update(object);
    }

    @Override
    public Period delete(Period object) {
        return periodRepository.delete(object);
    }
}
