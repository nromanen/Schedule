package com.softserve.repository.impl;

import com.softserve.entity.Period;
import com.softserve.repository.PeriodRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
@SuppressWarnings("unchecked")
public class PeriodRepositoryImpl extends BasicRepositoryImpl<Period, Long> implements PeriodRepository {

    /**
     * The method used for getting list of periods from database
     *
     * @return list of periods ordered by start time
     */
    @Override
    public List<Period> getAll() {
        log.info("Enter into getAll of PeriodRepositoryImpl");
        return sessionFactory.getCurrentSession().
                createQuery("select p from " + basicClass.getName() + " p" +
                        " order by p.startTime ASC").getResultList();
    }

    /**
     * The method used for updating existed entity from database
     *
     * @param entity entity is going to be updated
     * @return entity that was updated
     */
    @Override
    public Period update(Period entity) {
        sessionFactory.getCurrentSession().clear();
        return super.update(entity);
    }

    /**
     * The method used for getting Period by name from database
     *
     * @param name String email used to find User by it
     * @return Period
     */
    @Override
    public Optional<Period> findByName(String name) {
        log.info("Enter into findByName method with name: {}", name);
        TypedQuery<Period> query = sessionFactory.getCurrentSession().createNamedQuery("findName", Period.class).setMaxResults(1);
        query.setParameter("name", name);
        List<Period> periods = query.getResultList();
        if (periods.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(query.getResultList().get(0));
    }

    // Checking if period is used in Schedule table
    @Override
    protected boolean checkReference(Period period) {
        log.info("In checkReference(period = [{}])", period);
        Long count = (Long) sessionFactory.getCurrentSession().createQuery
                ("select count (s.id) " +
                        "from Schedule s where s.period.id = :periodId")
                .setParameter("periodId", period.getId())
                .getSingleResult();
        return count != 0;
    }

    @Override
    public List<Period> getFistFourPeriods() {
        log.info("In getFistFourPeriods()");
        return sessionFactory.getCurrentSession().createQuery("select p from Period p order by startTime")
                .setMaxResults(4)
                .getResultList();
    }
}
