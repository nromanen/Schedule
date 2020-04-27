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
public class ScheduleRepositoryImpl extends BasicRepositoryImpl<Schedule, Long> implements ScheduleRepository {

    private static final String SELECT_COUNT = "select count (s.id) " +
            "from Schedule s where s.semester.id = :semesterId " +
            "and s.dayOfWeek = :dayOfWeek " +
            "and s.period.id = :classId ";

    /**
     * Method searches if there are any saved records in schedule for particular group
     *
     * @param semesterId the semester id that the search is performed for
     * @param dayOfWeek  the day of the week that the search is performed for
     * @param evenOdd    lesson should occur by EVEN/ODD/WEEKLY
     * @param classId    id for period that the search is performed for
     * @param groupId    group id for which the search is performed for
     * @return 0 if there are no records(conflicts), else number of records
     */
    @Override
    public Long conflictForGroupInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long groupId) {
        log.info("In isConflictForGroupInSchedule(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], groupId = [{}])", semesterId, dayOfWeek, evenOdd, classId, groupId);
        //if schedule pretends to occur weekly need to check that there are no any already saved schedules for that Group
        if (evenOdd == EvenOdd.WEEKLY) {
            log.debug("Search when lesson repeats weekly");
            return (Long) sessionFactory.getCurrentSession().createQuery(
                    SELECT_COUNT +
                            "and s.lesson.group.id = :groupId")
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek)
                    .setParameter("classId", classId)
                    .setParameter("groupId", groupId)
                    .getSingleResult();
        }

        //else schedule pretends to occur by even/odd need to check that here are no amy already saved schedules for that Group at the same half or weekly
        else {
            log.debug("Search when lesson repeats by even/odd");
            return (Long) sessionFactory.getCurrentSession().createQuery(
                    SELECT_COUNT +
                            "and s.lesson.group.id = :groupId " +
                            "and ( s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY')")
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek)
                    .setParameter("classId", classId)
                    .setParameter("groupId", groupId)
                    .setParameter("evenOdd", evenOdd)
                    .getSingleResult();
        }
    }

    /**
     * Method gets the count of records in Schedule table for teacher if teacher has Schedule at some semester at some day(by even odd week) for some period
     *
     * @param semesterId id of semester
     * @param dayOfWeek  day of the week
     * @param evenOdd    even/odd/weekly
     * @param classId    id of period
     * @param teacherId  id of the teacher
     * @return the count of records in Schedule table
     */
    @Override
    public Long conflictForTeacherInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long teacherId) {
        log.info("In conflictForTeacherInSchedule(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], teacherId = [{}])", semesterId, dayOfWeek, evenOdd, classId, teacherId);
        if (evenOdd == EvenOdd.WEEKLY) {
            return (Long) sessionFactory.getCurrentSession().createQuery("" +
                    SELECT_COUNT +
                    "and s.lesson.teacher.id = :teacherId ")
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek)
                    .setParameter("classId", classId)
                    .setParameter("teacherId", teacherId)
                    .getSingleResult();

        } else {
            return (Long) sessionFactory.getCurrentSession().createQuery(
                    SELECT_COUNT +
                            "and s.lesson.teacher.id = :teacherId " +
                            "and ( s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY')")
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek)
                    .setParameter("classId", classId)
                    .setParameter("teacherId", teacherId)
                    .setParameter("evenOdd", evenOdd)
                    .getSingleResult();
        }

    }

    /**
     * Method gets the list of unique groups in semester
     *
     * @param semesterId id of semester
     * @return list of unique groups in semester
     */
    @Override
    public List<Group> uniqueGroupsInScheduleBySemester(Long semesterId) {
        log.info("In uniqueGroupsInScheduleBySemester", semesterId);
        return sessionFactory.getCurrentSession().createQuery("select distinct g1 from Group g1" +
                " where g1.id in" +
                " (select g.id from Schedule s join s.lesson.group g where s.semester.id = :semesterId)")
                .setParameter("semesterId", semesterId).getResultList();
    }

    /**
     * Method gets the list of periods/classes for group in some semester at some day
     *
     * @param semesterId id of the semester
     * @param groupId    id of the group
     * @param day        day of the week
     * @return the list of periods/classes
     */
    @Override
    public List<Period> periodsForGroupByDayBySemester(Long semesterId, Long groupId, DayOfWeek day) {
        log.info("In periodsForGroupByDayBySemester(semesterId = [{}], groupId = [{}], day = [{}])", semesterId, groupId, day);
        return sessionFactory.getCurrentSession().createQuery("select distinct p1 from Period p1" +
                " where p1.id in" +
                " (select p.id from Schedule s join s.period p where s.semester.id = :semesterId and s.lesson.group.id = :groupId and s.dayOfWeek = :dayOfWeek) order by p1.startTime")
                .setParameter("semesterId", semesterId)
                .setParameter("groupId", groupId)
                .setParameter("dayOfWeek", day)
                .getResultList();
    }

    /**
     * Method gets Lesson for group in some semester at some day(even/odd) at some period/class
     *
     * @param semesterId id of the semester
     * @param groupId    id of the group
     * @param periodId   id of the period/class
     * @param day        day of the week
     * @param evenOdd    even/odd/weekly
     * @return Optional Lesson object
     */
    @Override
    public Optional<Lesson> lessonForGroupByDayBySemesterByPeriodByWeek(Long semesterId, Long groupId, Long periodId, DayOfWeek day, EvenOdd evenOdd) {
        log.info("In lessonForGroupByDayBySemesterByPeriodByWeek(semesterId = [{}], groupId = [{}], periodId = [{}], day = [{}], evenOdd = [{}])", semesterId, groupId, periodId, day, evenOdd);
        return sessionFactory.getCurrentSession().createQuery("select l1 from Lesson l1" +
                " where l1.id in" +
                " (select l.id from Schedule s join s.lesson l where (s.semester.id = :semesterId and s.dayOfWeek = :dayOfWeek and s.period.id = :periodId and s.lesson.group.id = :groupId) and (s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY'))")
                .setParameter("semesterId", semesterId)
                .setParameter("groupId", groupId)
                .setParameter("periodId", periodId)
                .setParameter("dayOfWeek", day)
                .setParameter("evenOdd", evenOdd)
                .uniqueResultOptional();
    }

    /**
     * Method gets Room for Lesson in some semester at some day(even/odd) at some period/class
     *
     * @param semesterId id of the semester
     * @param periodId   id of the period/class
     * @param lessonId   id of the lesson
     * @param day        day of the week
     * @param evenOdd    even/odd/weekly
     * @return Room object
     */
    @Override
    public Room getRoomForLesson(Long semesterId, Long periodId, Long lessonId, DayOfWeek day, EvenOdd evenOdd) {
        log.info("In getRoomForLesson(semesterId = [{}], periodId = [{}], lessonId = [{}], day = [{}], evenOdd = [{}])", semesterId, periodId, lessonId, day, evenOdd);
        return (Room) sessionFactory.getCurrentSession().createQuery("select r1 from Room r1" +
                " where r1.id in" +
                " (select r.id from Schedule s join s.room r where (s.semester.id = :semesterId and s.dayOfWeek = :dayOfWeek and s.period.id = :periodId and s.lesson.id = :lessonId) and (s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY'))")
                .setParameter("semesterId", semesterId)
                .setParameter("lessonId", lessonId)
                .setParameter("periodId", periodId)
                .setParameter("dayOfWeek", day)
                .setParameter("evenOdd", evenOdd)
                .getSingleResult();
    }

    /**
     * Method gets unique days when Group have classes in semester
     *
     * @param semesterId id of the semester
     * @param groupId    id of the group
     * @return List of days
     */
    @Override
    public List<DayOfWeek> getDaysWhenGroupHasClassesBySemester(Long semesterId, Long groupId) {
        log.info("In getDaysWhenGroupHasClassesBySemester(semesterId = [{}], groupId = [{}])", semesterId, groupId);
        return sessionFactory.getCurrentSession().createQuery("select distinct s.dayOfWeek from  Schedule s where s.semester.id = :semesterId and s.lesson.group.id = :groupId")
                .setParameter("semesterId", semesterId)
                .setParameter("groupId", groupId)
                .getResultList();
    }

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param semesterId id of the semester
     * @param groupId    id og the group
     * @return number of records in db
     */
    @Override
    public Long countSchedulesForGroupInSemester(Long semesterId, Long groupId) {
        log.info("In countSchedulesForGroupInSemester(semesterId = [{}], groupId = [{}])", semesterId, groupId);
        return (Long) sessionFactory.getCurrentSession().createQuery("select count (s.id) from  Schedule s where s.semester.id = :semesterId and s.lesson.group.id = :groupId")
                .setParameter("semesterId", semesterId)
                .setParameter("groupId", groupId)
                .getSingleResult();
    }

    @Override
    public List<DayOfWeek> getDaysWhenTeacherHasClassesBySemester(Long semesterId, Long teacherId) {
        log.info("In getDaysWhenTeacherHasClassesBySemester(semesterId = [{}], teacherId = [{}])", semesterId, teacherId);
        return sessionFactory.getCurrentSession().createQuery("select distinct s.dayOfWeek from  Schedule s where s.semester.id = :semesterId and s.lesson.teacher.id = :teacherId")
                .setParameter("semesterId", semesterId)
                .setParameter("teacherId", teacherId)
                .getResultList();
    }

    @Override
    public List<Period> periodsForTeacherBySemesterByDayByWeek(Long semesterId, Long teacherId, DayOfWeek day, EvenOdd evenOdd) {
        log.info("In periodsForTeacherBySemesterByDayByWeek(semesterId = [{}], teacherId = [{}], day = [{}], evenOdd = [{}])", semesterId, teacherId, day, evenOdd);
        return sessionFactory.getCurrentSession().createQuery("select distinct p1 from Period p1" +
                " where p1.id in" +
                " (select p.id from Schedule s join s.period p where (s.semester.id = :semesterId and s.lesson.teacher.id = :teacherId and s.dayOfWeek = :dayOfWeek) and (s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY')) order by p1.startTime")
                .setParameter("semesterId", semesterId)
                .setParameter("teacherId", teacherId)
                .setParameter("dayOfWeek", day)
                .setParameter("evenOdd", evenOdd)
                .getResultList();
    }

    @Override
    public List<Lesson> lessonsForTeacherBySemesterByDayByPeriodByWeek(Long semesterId, Long teacherId, Long periodId, DayOfWeek day, EvenOdd evenOdd) {
        log.info("In lessonsForTeacherBySemesterByDayByPeriodByWeek(semesterId = [{}], teacherId = [{}], periodId = [{}], day = [{}], evenOdd = [{}])", semesterId, teacherId, periodId, day, evenOdd);
        return sessionFactory.getCurrentSession().createQuery("select l1 from Lesson l1" +
                " where l1.id in" +
                " (select l.id from Schedule s join s.lesson l where (s.semester.id = :semesterId and s.dayOfWeek = :dayOfWeek and s.period.id = :periodId and s.lesson.teacher.id = :teacherId) and (s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY'))")
                .setParameter("semesterId", semesterId)
                .setParameter("teacherId", teacherId)
                .setParameter("periodId", periodId)
                .setParameter("dayOfWeek", day)
                .setParameter("evenOdd", evenOdd)
                .getResultList();
    }

    @Override
    public List<Schedule> getAllSchedulesByTeacherIdAndSemesterId(Long teacherId, Long semesterId) {
        log.info("Enter into getAll of TeacherRepositoryImpl");
        return sessionFactory.getCurrentSession().
                createQuery("from Schedule s where s.semester.id = :semesterId " +
                        "and s.lesson.teacher.id = :teacherId ")
                .setParameter("semesterId", semesterId)
                .setParameter("teacherId", teacherId)
                .getResultList();
    }


    /**
     * Method gets unique days when Room have classes in semester
     *
     * @param semesterId id of the semester
     * @param roomId    id of the room
     * @return List of days
     */
    @Override
    public List<DayOfWeek> getDaysWhenRoomHasClassesBySemester(Long semesterId, Long roomId) {
        log.info("In getDaysWhenRoomHasClassesBySemester(semesterId = [{}], roomId = [{}]", semesterId, roomId);
        return sessionFactory.getCurrentSession().createQuery("select distinct s.dayOfWeek from  Schedule s where s.semester.id = :semesterId and s.room.id= :roomId")
                .setParameter("semesterId", semesterId)
                .setParameter("roomId", roomId)
                .getResultList();
    }



    /**
     * Method gets the list of periods/classes for room in  semester at  day
     *
     * @param semesterId id of the semester
     * @param roomId    id of the room
     * @param day        day of the week
     * @return the list of periods/classes
     */
    @Override
    public List<Period> getPeriodsForRoomBySemesterByDayOfWeek(Long semesterId, Long roomId, DayOfWeek day) {
        log.info("In getPeriodsForRoomBySemesterByDayOfWeek(semesterId = [{}], roomId = [{}], day = [{}])", semesterId, roomId, day);
        return sessionFactory.getCurrentSession().createQuery("select distinct p1 from Period p1" +
                " where p1.id in" +
                " (select p.id from Schedule s join s.period p where s.semester.id = :semesterId and s.room.id = :roomId and s.dayOfWeek = :dayOfWeek) order by p1.startTime")
                .setParameter("semesterId", semesterId)
                .setParameter("roomId", roomId)
                .setParameter("dayOfWeek", day)
                .getResultList();
    }

    /**
     * Method gets Lesson for room in some semester at some day(even/odd) at some period/class
     *
     * @param semesterId id of the semester
     * @param roomId    id of the group
     * @param periodId   id of the period/class
     * @param day        day of the week
     * @param evenOdd    even/odd/weekly
     * @return Optional Lesson object
     */
    @Override
    public List<Lesson> lessonForRoomByDayBySemesterByPeriodByWeek(Long semesterId, Long roomId, Long periodId, DayOfWeek day, EvenOdd evenOdd) {
        log.info("In lessonForRoomByDayBySemesterByPeriodByWeek(semesterId = [{}], groupId = [{}], periodId = [{}], day = [{}], evenOdd = [{}], teacherId = [{}])", semesterId, roomId, periodId, day, evenOdd);
        return sessionFactory.getCurrentSession().createQuery("select l1 from Lesson l1" +
                " where l1.id in" +
                " (select l.id from Schedule s join s.lesson l where (s.semester.id = :semesterId and s.dayOfWeek = :dayOfWeek and s.period.id = :periodId and s.room.id = :roomId) and (s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY'))")
                .setParameter("semesterId", semesterId)
                .setParameter("roomId", roomId)
                .setParameter("periodId", periodId)
                .setParameter("dayOfWeek", day)
                .setParameter("evenOdd", evenOdd)
                .getResultList();
    }


    //test full schedule

    @Override
    public List<Period> periodsForSemester(Long semesterId) {
        log.info("In periodsForSemester(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession().createQuery("select distinct p1 from Period p1" +
                " where p1.id in" +
                " (select p.id from Schedule s join s.period p where s.semester.id = :semesterId ) order by p1.startTime")
                .setParameter("semesterId", semesterId)
                .getResultList();
    }

    @Override
    public List<DayOfWeek> getDaysForSemester(Long semesterId) {
        log.info("In getDaysForSemester(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession().createQuery("select distinct s.dayOfWeek from  Schedule s where s.semester.id = :semesterId")
                .setParameter("semesterId", semesterId)
                .getResultList();
    }

    @Override
    public List<Schedule> getScheduleBySemester(Long semesterId) {
        log.info("In getScheduleBySemester(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession().createQuery("SELECT s from Schedule s where s.semester.id = :semesterId")
                .setParameter("semesterId", semesterId)
                .getResultList();
    }
}
