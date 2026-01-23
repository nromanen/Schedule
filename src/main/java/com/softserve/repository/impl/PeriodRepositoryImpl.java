package com.softserve.repository.impl;

import com.softserve.entity.Period;
import com.softserve.repository.PeriodRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class PeriodRepositoryImpl extends BasicRepositoryImpl<Period, Long> implements PeriodRepository {

    @Override
    public List<Period> getAll() {
        log.info("Enter into getAll of PeriodRepositoryImpl");
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT p FROM " + basicClass.getName() + " p ORDER BY p.startTime ASC", Period.class)
                .getResultList();
    }

    @Override
    public Period update(Period entity) {
        sessionFactory.getCurrentSession().clear();
        return super.update(entity);
    }

    @Override
    public Optional<Period> findByName(String name) {
        log.info("Enter into findByName method with name: {}", name);
        List<Period> periods = sessionFactory.getCurrentSession()
                .createNamedQuery("findName", Period.class)
                .setMaxResults(1)
                .setParameter("name", name)
                .getResultList();

        return periods.isEmpty() ? Optional.empty() : Optional.of(periods.get(0));
    }

    @Override
    protected boolean checkReference(Period period) {
        log.info("In checkReference(period = [{}])", period);
        Long count = sessionFactory.getCurrentSession()
                .createQuery("SELECT count(s.id) FROM Schedule s WHERE s.period.id = :periodId", Long.class)
                .setParameter("periodId", period.getId())
                .getSingleResult();
        return count != 0;
    }

    @Override
    public List<Period> getFistFourPeriods() {
        log.info("In getFistFourPeriods()");
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT p FROM Period p ORDER BY p.startTime ASC", Period.class)
                .setMaxResults(4)
                .getResultList();
    }
}
