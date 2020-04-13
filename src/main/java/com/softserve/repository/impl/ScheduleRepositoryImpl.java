package com.softserve.repository.impl;

import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.repository.ScheduleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class ScheduleRepositoryImpl  extends BasicRepositoryImpl<Schedule, Long> implements ScheduleRepository {

    private static final String START_SELECT_COUNT = "select count (s.id) " +
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
        log.info("In isConflictForGroupInSchedule(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], groupId = [{}])", semesterId, dayOfWeek, evenOdd, classId, groupId);
        //if schedule pretends to occur weekly need to check that there are no any already saved schedules for that Group
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
        log.info("In conflictForTeacherInSchedule(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], teacherId = [{}])", semesterId, dayOfWeek, evenOdd, classId, teacherId);
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

    @Override
    public List<Group> uniqueGroupsInScheduleBySemester(Long semesterId) {
        return sessionFactory.getCurrentSession().createQuery("select distinct g1 from Group g1" +
                " where g1.id in" +
                " (select g.id from Schedule s join s.lesson.group g where s.semester.id = :semesterId)")
                .setParameter("semesterId", semesterId).getResultList();
    }

    @Override
    public List<Period> periodsForGroupByDayBySemester(Long semesterId, Long groupId, DayOfWeek day) {
        return sessionFactory.getCurrentSession().createQuery("select distinct p1 from Period p1" +
                " where p1.id in" +
                " (select p.id from Schedule s join s.period p where s.semester.id = :semesterId and s.lesson.group.id = :groupId and s.dayOfWeek = :dayOfWeek) order by p1.startTime")
                .setParameter("semesterId", semesterId)
                .setParameter("groupId", groupId)
                .setParameter("dayOfWeek", day.toString())
                .getResultList();
    }

    @Override
    public Optional<Lesson> lessonForGroupByDayBySemesterByPeriodByWeek(Long semesterId, Long groupId, Long periodId, DayOfWeek day, EvenOdd evenOdd) {

        return (Optional<Lesson>) sessionFactory.getCurrentSession().createQuery("select l1 from Lesson l1" +
                " where l1.id in" +
                " (select l.id from Schedule s join s.lesson l where (s.semester.id = :semesterId and s.dayOfWeek = :dayOfWeek and s.period.id = :periodId and s.lesson.group.id = :groupId) and (s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY'))")
                .setParameter("semesterId", semesterId)
                .setParameter("groupId", groupId)
                .setParameter("periodId", periodId)
                .setParameter("dayOfWeek", day.toString())
                .setParameter("evenOdd", evenOdd)
                .uniqueResultOptional();
    }

    @Override
    public Room getRoomForLesson(Long semesterId, Long periodId, Long lessonId, DayOfWeek day, EvenOdd evenOdd) {
        return (Room) sessionFactory.getCurrentSession().createQuery("select r1 from Room r1" +
                " where r1.id in" +
                " (select r.id from Schedule s join s.room r where (s.semester.id = :semesterId and s.dayOfWeek = :dayOfWeek and s.period.id = :periodId and s.lesson.id = :lessonId) and (s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY'))")
                .setParameter("semesterId", semesterId)
                .setParameter("lessonId", lessonId)
                .setParameter("periodId", periodId)
                .setParameter("dayOfWeek", day.toString())
                .setParameter("evenOdd", evenOdd)
                .getSingleResult();
    }

    @Override
    public List<String> getDaysWhenGroupHasClassesBySemester(Long semesterId, Long groupId) {
        return sessionFactory.getCurrentSession().createQuery("select distinct s.dayOfWeek from  Schedule s where s.semester.id = :semesterId and s.lesson.group.id = :groupId")
                .setParameter("semesterId", semesterId)
                .setParameter("groupId", groupId)
                .getResultList();
    }

    @Override
    public Long countSchedulesForGroupInSemester(Long semesterId, Long groupId){
        return (Long) sessionFactory.getCurrentSession().createQuery("select count (s.id) from  Schedule s where s.semester.id = :semesterId and s.lesson.group.id = :groupId")
                .setParameter("semesterId", semesterId)
                .setParameter("groupId", groupId)
                .getSingleResult();
    }
}
