package com.softserve.repository.impl;

import com.softserve.entity.Period;
import com.softserve.entity.Room;
import com.softserve.repository.PeriodRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@Slf4j
@SuppressWarnings("unchecked")
public class PeriodRepositoryImpl extends BasicRepositoryImpl<Period, Long> implements PeriodRepository {

    /**
     * The method used for getting list of entities from database
     *
     * @return list of entities ordered by start time
     */
    @Override
    public List<Period> getAll() {
        log.info("Enter into getAll of BasicRepository");
        return sessionFactory.getCurrentSession().
                createQuery("select p from " + basicClass.getName() + " p" +
                        " order by p.startTime").getResultList();
    }
}
