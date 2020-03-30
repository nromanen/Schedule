package com.softserve.repository.impl;

import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.repository.ScheduleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;

@Repository
@Slf4j
public class ScheduleRepositoryImpl  extends BasicRepositoryImpl<Schedule, Long> implements ScheduleRepository {

    @Override
    public Long conflictInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {

        if (evenOdd.equals(EvenOdd.WEEKLY)){
            return (Long) sessionFactory.getCurrentSession().createQuery("select count (s.id) " +
                    "from Schedule s where (s.semester.id = :semesterId " +
                    "and s.period.id = :classId " +
                    "and s.dayOfWeek = :dayOfWeek )" +
                    "and ( s.evenOdd = :evenOdd or s.evenOdd = 'EVEN' or s.evenOdd = 'ODD')")
                    .setParameter("semesterId", semesterId)
                    .setParameter("classId", classId)
                    .setParameter("dayOfWeek", dayOfWeek.toString())
                    .setParameter("evenOdd", evenOdd).list().get(0);
        }

        else {
            return (Long) sessionFactory.getCurrentSession().createQuery("select count (s.id) " +
                    "from Schedule s where (s.semester.id = :semesterId " +
                    "and s.period.id = :classId " +
                    "and s.dayOfWeek = :dayOfWeek )" +
                    "and ( s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY')")
                    .setParameter("semesterId", semesterId)
                    .setParameter("classId", classId)
                    .setParameter("dayOfWeek", dayOfWeek.toString())
                    .setParameter("evenOdd", evenOdd).list().get(0);
        }
    }

}
