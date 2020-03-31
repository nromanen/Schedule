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

    /**
     * Method searches if there are any saved records in schedule for particular group
     * @param semesterId the semester id that the search is performed for
     * @param dayOfWeek the day of the week that the search is performed for
     * @param evenOdd lesson should occur by EVEN/ODD/WEEKLY
     * @param classId id for period that the search is performed for
     * @param groupId group id for which the search is performed for
     * @return 0 if there are no records(conflicts), else number of records
     */
    @Override
    public Long conflictForGroupInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long groupId) {
        log.info("Enter into isConflictForGroupInSchedule with semesterId = {}, dayOfWeek = {}, evenOdd = {}, classId = {}, groupId = {}", semesterId, dayOfWeek, evenOdd, classId, groupId);
        //if schedule pretends to occur weekly need to check that there are no amy already saved schedules for that Group
        if (evenOdd == EvenOdd.WEEKLY){
            log.debug("Search when lesson repeats weekly");
               return (Long) sessionFactory.getCurrentSession().createQuery("select count (s.id) " +
                    "from Schedule s where s.semester.id = :semesterId " +
                    "and s.dayOfWeek = :dayOfWeek " +
                    "and s.period.id = :classId " +
                    "and s.lesson.group.id = :groupId" )
                 //   + "and (s.evenOdd = 'WEEKLY' or s.evenOdd = 'EVEN' or s.evenOdd = 'ODD')")
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek.toString())
                    .setParameter("classId", classId)
                    .setParameter("groupId", groupId)
                   // .setParameter("evenOdd", evenOdd)
                    .list().get(0);
        }

        //else schedule pretends to occur by even/odd need to check that here are no amy already saved schedules for that Group at the same half or weekly
        else {
            log.debug("Search when lesson repeats by even/odd");
            return (Long) sessionFactory.getCurrentSession().createQuery("select count (s.id) " +
                    "from Schedule s where (s.semester.id = :semesterId " +
                    "and s.dayOfWeek = :dayOfWeek " +
                    "and s.period.id = :classId " +
                    "and s.lesson.group.id = :groupId)" +
                    "and ( s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY')")
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek.toString())
                    .setParameter("classId", classId)
                    .setParameter("groupId", groupId)
                    .setParameter("evenOdd", evenOdd).list().get(0);
        }
    }

}
