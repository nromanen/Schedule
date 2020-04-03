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

    private final static String START_SELECT_COUNT = "select count (s.id) " +
            "from Schedule s where s.semester.id = :semesterId " +
            "and s.dayOfWeek = :dayOfWeek " +
            "and s.period.id = :classId ";

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
               return (Long) sessionFactory.getCurrentSession().createQuery(
                        START_SELECT_COUNT +
                    "and s.lesson.group.id = :groupId" )
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek.toString())
                    .setParameter("classId", classId)
                    .setParameter("groupId", groupId)
                    .getSingleResult();
        }

        //else schedule pretends to occur by even/odd need to check that here are no amy already saved schedules for that Group at the same half or weekly
        else {
            log.debug("Search when lesson repeats by even/odd");
            return (Long) sessionFactory.getCurrentSession().createQuery(
                    START_SELECT_COUNT +
                    "and s.lesson.group.id = :groupId " +
                    "and ( s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY')")
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek.toString())
                    .setParameter("classId", classId)
                    .setParameter("groupId", groupId)
                    .setParameter("evenOdd", evenOdd)
                    .getSingleResult();
        }
    }


    @Override
    public Long conflictForTeacherInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long teacherId) {
        log.info("Enter into conflictForTeacherInSchedule with semesterId = {}, dayOfWeek = {}, evenOdd = {}, classId = {}, teacherId = {}", semesterId, dayOfWeek, evenOdd, classId, teacherId);
        if (evenOdd == EvenOdd.WEEKLY) {
            return (Long) sessionFactory.getCurrentSession().createQuery("" +
                    START_SELECT_COUNT +
                    "and s.lesson.teacher.id = :teacherId " )
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek.toString())
                    .setParameter("classId", classId)
                    .setParameter("teacherId", teacherId)
                    .getSingleResult();

        }
        else {
            return (Long) sessionFactory.getCurrentSession().createQuery(
                    START_SELECT_COUNT +
                            "and s.lesson.teacher.id = :teacherId " +
                            "and ( s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY')")
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek.toString())
                    .setParameter("classId", classId)
                    .setParameter("teacherId", teacherId)
                    .setParameter("evenOdd", evenOdd)
                    .getSingleResult();
        }

    }

}
