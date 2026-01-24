package com.softserve.repository.impl;

import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.repository.ScheduleRepository;
import com.softserve.util.Constants;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import jakarta.persistence.criteria.*;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class ScheduleRepositoryImpl extends BasicRepositoryImpl<Schedule, Long> implements ScheduleRepository {
    private static final String NOT_DISABLED_SQL = " AND s.room.disable = false AND s.lesson.semester.disable = false " +
            "AND s.lesson.group.disable = false AND s.lesson.teacher.disable = false AND s.lesson.subject.disable = false ";

    private static final String SCHEDULE_WITH_DETAILS_JOINS =
            "SELECT DISTINCT s FROM Schedule s " +
                    "JOIN FETCH s.lesson l " +
                    "JOIN FETCH s.room r " +
                    "JOIN FETCH s.period p " +
                    "JOIN FETCH l.group g " +
                    "JOIN FETCH l.teacher t " +
                    "JOIN FETCH l.subject subj " +
                    "JOIN FETCH l.semester sem " +
                    "LEFT JOIN FETCH r.type " +
                    "LEFT JOIN FETCH t.department ";
    private static final String SELECT_COUNT = "SELECT COUNT(s.id) FROM Schedule s " +
            "WHERE s.lesson.semester.id = :semesterId " +
            "AND s.dayOfWeek = :dayOfWeek " +
            "AND s.period.id = :classId " + NOT_DISABLED_SQL;

    private static final String GET_BY_ALL_PARAMETERS = "SELECT s FROM Schedule s " +
            "WHERE s.period.id = :periodId " +
            "AND s.lesson.id = :lessonId " +
            "AND s.dayOfWeek = :dayOfWeek " +
            "AND s.evenOdd = :evenOdd " +
            "AND s.room.id = :roomId";

    private static final String GET_ALL_ORDERED_BY_ROOMS_DAYS_PERIODS =
            "SELECT s FROM Schedule s " +
                    "WHERE s.lesson.semester.id = :semesterId " +
                    "ORDER BY s.room.name, " +
                    "CASE " +
                    "WHEN s.dayOfWeek = 'MONDAY' THEN 1 " +
                    "WHEN s.dayOfWeek = 'TUESDAY' THEN 2 " +
                    "WHEN s.dayOfWeek = 'WEDNESDAY' THEN 3 " +
                    "WHEN s.dayOfWeek = 'THURSDAY' THEN 4 " +
                    "WHEN s.dayOfWeek = 'FRIDAY' THEN 5 " +
                    "WHEN s.dayOfWeek = 'SATURDAY' THEN 6 " +
                    "WHEN s.dayOfWeek = 'SUNDAY' THEN 7 " +
                    "END, " +
                    "s.evenOdd, s.period.name, " +
                    "s.lesson.subjectForSite, s.lesson.teacher.surname, s.lesson.lessonType";

    @Override
    public Long conflictForGroupInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long groupId) {
        log.info("In conflictForGroupInSchedule(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], groupId = [{}])",
                semesterId, dayOfWeek, evenOdd, classId, groupId);

        if (evenOdd == EvenOdd.WEEKLY) {
            log.debug("Search when lesson repeats weekly");
            return sessionFactory.getCurrentSession()
                    .createQuery(SELECT_COUNT + "AND s.lesson.group.id = :groupId", Long.class)
                    .setParameter(Constants.SEMESTER_ID, semesterId)
                    .setParameter(Constants.DAY_OF_WEEK, dayOfWeek)
                    .setParameter(Constants.CLASS_ID, classId)
                    .setParameter(Constants.GROUP_ID, groupId)
                    .getSingleResult();
        } else {
            log.debug("Search when lesson repeats by even/odd");
            return sessionFactory.getCurrentSession()
                    .createQuery(SELECT_COUNT +
                            "AND s.lesson.group.id = :groupId " +
                            "AND (s.evenOdd = :evenOdd OR s.evenOdd = 'WEEKLY')", Long.class)
                    .setParameter(Constants.SEMESTER_ID, semesterId)
                    .setParameter(Constants.DAY_OF_WEEK, dayOfWeek)
                    .setParameter(Constants.CLASS_ID, classId)
                    .setParameter(Constants.GROUP_ID, groupId)
                    .setParameter(Constants.EVEN_ODD, evenOdd)
                    .getSingleResult();
        }
    }

    @Override
    public Long conflictForTeacherInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long teacherId) {
        log.info("In conflictForTeacherInSchedule(semesterId = [{}], dayOfWeek = [{}], evenOdd = [{}], classId = [{}], teacherId = [{}])",
                semesterId, dayOfWeek, evenOdd, classId, teacherId);

        if (evenOdd == EvenOdd.WEEKLY) {
            return sessionFactory.getCurrentSession()
                    .createQuery(SELECT_COUNT + "AND s.lesson.teacher.id = :teacherId", Long.class)
                    .setParameter(Constants.SEMESTER_ID, semesterId)
                    .setParameter(Constants.DAY_OF_WEEK, dayOfWeek)
                    .setParameter(Constants.CLASS_ID, classId)
                    .setParameter(Constants.TEACHER_ID, teacherId)
                    .getSingleResult();
        } else {
            return sessionFactory.getCurrentSession()
                    .createQuery(SELECT_COUNT +
                            "AND s.lesson.teacher.id = :teacherId " +
                            "AND (s.evenOdd = :evenOdd OR s.evenOdd = 'WEEKLY')", Long.class)
                    .setParameter(Constants.SEMESTER_ID, semesterId)
                    .setParameter(Constants.DAY_OF_WEEK, dayOfWeek)
                    .setParameter(Constants.CLASS_ID, classId)
                    .setParameter(Constants.TEACHER_ID, teacherId)
                    .setParameter(Constants.EVEN_ODD, evenOdd)
                    .getSingleResult();
        }
    }

    @Override
    public List<Group> uniqueGroupsInScheduleBySemester(Long semesterId) {
        log.info("In uniqueGroupsInScheduleBySemester(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT DISTINCT g FROM Schedule s " +
                                "JOIN s.lesson.group g " +
                                "WHERE s.lesson.semester.id = :semesterId " +
                                NOT_DISABLED_SQL +
                                "ORDER BY g.sortOrder ASC",
                        Group.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .getResultList();
    }

    @Override
    public List<Period> periodsForGroupByDayBySemester(Long semesterId, Long groupId, DayOfWeek day) {
        log.info("In periodsForGroupByDayBySemester(semesterId = [{}], groupId = [{}], day = [{}])", semesterId, groupId, day);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT DISTINCT p FROM Schedule s " +
                                "JOIN s.period p " +
                                "WHERE s.lesson.semester.id = :semesterId " +
                                "AND s.lesson.group.id = :groupId " +
                                "AND s.dayOfWeek = :dayOfWeek " +
                                NOT_DISABLED_SQL +
                                "ORDER BY p.startTime",
                        Period.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .setParameter(Constants.GROUP_ID, groupId)
                .setParameter(Constants.DAY_OF_WEEK, day)
                .getResultList();
    }

    @Override
    public Optional<Lesson> lessonForGroupByDayBySemesterByPeriodByWeek(Long semesterId, Long groupId, Long periodId,
                                                                        DayOfWeek day, EvenOdd evenOdd) {
        log.info("In lessonForGroupByDayBySemesterByPeriodByWeek(semesterId = [{}], groupId = [{}], periodId = [{}], day = [{}], evenOdd = [{}])",
                semesterId, groupId, periodId, day, evenOdd);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT l FROM Schedule s " +
                                "JOIN s.lesson l " +
                                "WHERE s.lesson.semester.id = :semesterId " +
                                "AND s.dayOfWeek = :dayOfWeek " +
                                "AND s.period.id = :periodId " +
                                "AND s.lesson.group.id = :groupId " +
                                "AND (s.evenOdd = :evenOdd OR s.evenOdd = 'WEEKLY') " +
                                NOT_DISABLED_SQL,
                        Lesson.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .setParameter(Constants.GROUP_ID, groupId)
                .setParameter(Constants.PERIOD_ID, periodId)
                .setParameter(Constants.DAY_OF_WEEK, day)
                .setParameter(Constants.EVEN_ODD, evenOdd)
                .uniqueResultOptional();
    }

    @Override
    public Room getRoomForLesson(Long semesterId, Long periodId, Long lessonId, DayOfWeek day, EvenOdd evenOdd) {
        log.info("In getRoomForLesson(semesterId = [{}], periodId = [{}], lessonId = [{}], day = [{}], evenOdd = [{}])",
                semesterId, periodId, lessonId, day, evenOdd);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT r FROM Schedule s " +
                                "JOIN s.room r " +
                                "WHERE s.lesson.semester.id = :semesterId " +
                                "AND s.dayOfWeek = :dayOfWeek " +
                                "AND s.period.id = :periodId " +
                                "AND s.lesson.id = :lessonId " +
                                "AND (s.evenOdd = :evenOdd OR s.evenOdd = 'WEEKLY') " +
                                NOT_DISABLED_SQL,
                        Room.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .setParameter(Constants.LESSON_ID, lessonId)
                .setParameter(Constants.PERIOD_ID, periodId)
                .setParameter(Constants.DAY_OF_WEEK, day)
                .setParameter(Constants.EVEN_ODD, evenOdd)
                .getSingleResult();
    }

    @Override
    public List<DayOfWeek> getDaysWhenGroupHasClassesBySemester(Long semesterId, Long groupId) {
        log.info("In getDaysWhenGroupHasClassesBySemester(semesterId = [{}], groupId = [{}])", semesterId, groupId);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT DISTINCT s.dayOfWeek FROM Schedule s " +
                                "WHERE s.lesson.semester.id = :semesterId " +
                                "AND s.lesson.group.id = :groupId " +
                                NOT_DISABLED_SQL,
                        DayOfWeek.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .setParameter(Constants.GROUP_ID, groupId)
                .getResultList();
    }

    @Override
    public Long countSchedulesForGroupInSemester(Long semesterId, Long groupId) {
        log.info("In countSchedulesForGroupInSemester(semesterId = [{}], groupId = [{}])", semesterId, groupId);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT COUNT(s.id) FROM Schedule s " +
                                "WHERE s.lesson.semester.id = :semesterId " +
                                "AND s.lesson.group.id = :groupId " +
                                NOT_DISABLED_SQL, Long.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .setParameter(Constants.GROUP_ID, groupId)
                .getSingleResult();
    }

    @Override
    public List<DayOfWeek> getDaysWhenTeacherHasClassesBySemester(Long semesterId, Long teacherId) {
        log.info("In getDaysWhenTeacherHasClassesBySemester(semesterId = [{}], teacherId = [{}])", semesterId, teacherId);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT DISTINCT s.dayOfWeek FROM Schedule s " +
                                "WHERE s.lesson.semester.id = :semesterId " +
                                "AND s.lesson.teacher.id = :teacherId " +
                                NOT_DISABLED_SQL,
                        DayOfWeek.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .setParameter(Constants.TEACHER_ID, teacherId)
                .getResultList();
    }

    @Override
    public List<Period> periodsForTeacherBySemesterByDayByWeek(Long semesterId, Long teacherId, DayOfWeek day, EvenOdd evenOdd) {
        log.info("In periodsForTeacherBySemesterByDayByWeek(semesterId = [{}], teacherId = [{}], day = [{}], evenOdd = [{}])",
                semesterId, teacherId, day, evenOdd);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT DISTINCT p FROM Schedule s " +
                                "JOIN s.period p " +
                                "WHERE s.lesson.semester.id = :semesterId " +
                                "AND s.lesson.teacher.id = :teacherId " +
                                "AND s.dayOfWeek = :dayOfWeek " +
                                "AND (s.evenOdd = :evenOdd OR s.evenOdd = 'WEEKLY') " +
                                NOT_DISABLED_SQL +
                                "ORDER BY p.startTime",
                        Period.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .setParameter(Constants.TEACHER_ID, teacherId)
                .setParameter(Constants.DAY_OF_WEEK, day)
                .setParameter(Constants.EVEN_ODD, evenOdd)
                .getResultList();
    }

    @Override
    public List<Lesson> lessonsForTeacherBySemesterByDayByPeriodByWeek(Long semesterId, Long teacherId, Long periodId,
                                                                       DayOfWeek day, EvenOdd evenOdd) {
        log.info("In lessonsForTeacherBySemesterByDayByPeriodByWeek(semesterId = [{}], teacherId = [{}], periodId = [{}], " +
                "day = [{}], evenOdd = [{}])", semesterId, teacherId, periodId, day, evenOdd);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT l FROM Schedule s " +
                                "JOIN s.lesson l " +
                                "WHERE s.lesson.semester.id = :semesterId " +
                                "AND s.dayOfWeek = :dayOfWeek " +
                                "AND s.period.id = :periodId " +
                                "AND s.lesson.teacher.id = :teacherId " +
                                "AND (s.evenOdd = :evenOdd OR s.evenOdd = 'WEEKLY') " +
                                NOT_DISABLED_SQL,
                        Lesson.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .setParameter(Constants.TEACHER_ID, teacherId)
                .setParameter(Constants.PERIOD_ID, periodId)
                .setParameter(Constants.DAY_OF_WEEK, day)
                .setParameter(Constants.EVEN_ODD, evenOdd)
                .getResultList();
    }

    @Override
    public List<Schedule> getAllSchedulesByTeacherIdAndSemesterId(Long teacherId, Long semesterId) {
        log.info("In getAllSchedulesByTeacherIdAndSemesterId(teacherId = [{}], semesterId = [{}])", teacherId, semesterId);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT s FROM Schedule s " +
                                "WHERE s.lesson.semester.id = :semesterId " +
                                "AND s.lesson.teacher.id = :teacherId " +
                                NOT_DISABLED_SQL,
                        Schedule.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .setParameter(Constants.TEACHER_ID, teacherId)
                .getResultList();
    }

    @Override
    public Schedule getScheduleByObject(Schedule schedule) {
        log.info("In getScheduleByObject(schedule = [{}])", schedule);
        return sessionFactory.getCurrentSession()
                .createQuery(GET_BY_ALL_PARAMETERS, Schedule.class)
                .setParameter(Constants.PERIOD_ID, schedule.getPeriod().getId())
                .setParameter(Constants.LESSON_ID, schedule.getLesson().getId())
                .setParameter(Constants.DAY_OF_WEEK, schedule.getDayOfWeek())
                .setParameter(Constants.EVEN_ODD, schedule.getEvenOdd())
                .setParameter(Constants.ROOM_ID, schedule.getRoom().getId())
                .getSingleResult();
    }

    @Override
    public List<Schedule> getScheduleBySemester(Long semesterId) {
        log.info("In getScheduleBySemester(semesterId = [{}])", semesterId);

        List<Schedule> schedules = sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT DISTINCT s FROM Schedule s " +
                                "JOIN FETCH s.lesson l " +
                                "JOIN FETCH l.semester sem " +
                                "LEFT JOIN FETCH sem.periods " +
                                "LEFT JOIN FETCH sem.daysOfWeek " +
                                "WHERE l.semester.id = :semesterId " +
                                NOT_DISABLED_SQL,
                        Schedule.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .getResultList();

        schedules.stream()
                .map(s -> s.getLesson().getSemester())
                .distinct()
                .forEach(sem -> Hibernate.initialize(sem.getGroups()));

        return schedules;
    }

    @Override
    public List<Schedule> getAll() {
        log.info("In getAll()");
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Schedule> cq = cb.createQuery(Schedule.class);
        Root<Schedule> from = cq.from(Schedule.class);

        Fetch<Schedule, Lesson> lessonFetch = from.fetch(Constants.LESSON, JoinType.LEFT);
        Fetch<Lesson, Semester> semesterFetch = lessonFetch.fetch(Constants.SEMESTER, JoinType.LEFT);
        semesterFetch.fetch("daysOfWeek", JoinType.LEFT);
        semesterFetch.fetch("periods", JoinType.LEFT);

        cq.where(
                cb.equal(from.get(Constants.ROOM).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.LESSON).get(Constants.SEMESTER).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.LESSON).get(Constants.GROUP).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.LESSON).get(Constants.SUBJECT).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.LESSON).get(Constants.TEACHER).get(Constants.DISABLE), false)
        );

        cq.distinct(true);

        List<Schedule> schedules = session.createQuery(cq).getResultList();

        schedules.stream()
                .map(s -> s.getLesson().getSemester())
                .distinct()
                .forEach(sem -> Hibernate.initialize(sem.getGroups()));

        return schedules;
    }

    @Override
    public List<Schedule> scheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId) {
        log.info("In scheduleByDateRangeForTeacher(fromDate = [{}], toDate = [{}], teacherId = [{}])", fromDate, toDate, teacherId);

        List<Schedule> schedules = sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT DISTINCT s FROM Schedule s " +
                                "JOIN FETCH s.lesson l " +
                                "JOIN FETCH l.semester sem " +
                                "LEFT JOIN FETCH sem.periods " +
                                "JOIN FETCH s.room " +
                                "JOIN FETCH s.period " +
                                "JOIN FETCH l.subject " +
                                "JOIN FETCH l.group " +
                                "JOIN FETCH l.teacher " +
                                "WHERE sem.startDay <= :toDate " +
                                "AND sem.endDay >= :fromDate " +
                                "AND l.teacher.id = :teacherId",
                        Schedule.class)
                .setParameter(Constants.FROM_DATE, fromDate)
                .setParameter(Constants.TO_DATE, toDate)
                .setParameter(Constants.TEACHER_ID, teacherId)
                .getResultList();

        schedules.stream()
                .map(s -> s.getLesson().getSemester())
                .distinct()
                .forEach(sem -> Hibernate.initialize(sem.getGroups()));

        return schedules;
    }

    @Override
    public List<Schedule> scheduleForRoomBySemester(Long semesterId, Long roomId) {
        log.info("In scheduleForRoomBySemester(semesterId = [{}], roomId = [{}])", semesterId, roomId);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT s FROM Schedule s " +
                                "WHERE s.room.id = :roomId " +
                                "AND s.lesson.semester.id = :semesterId " +
                                "ORDER BY s.period.startTime ASC",
                        Schedule.class)
                .setParameter(Constants.ROOM_ID, roomId)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .getResultList();
    }

    @Override
    public void deleteSchedulesBySemesterId(Long semesterId) {
        log.info("In deleteSchedulesBySemesterId(semesterId = [{}])", semesterId);
        sessionFactory.getCurrentSession()
                .createMutationQuery("DELETE FROM Schedule s WHERE s.lesson.semester.id = :semesterId")
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .executeUpdate();
    }

    @Override
    public Long countInputLessonsInScheduleByLessonId(Long lessonId) {
        log.info("In countInputLessonsInScheduleByLessonId(lessonId = [{}])", lessonId);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT COUNT(s.id) FROM Schedule s " +
                                "WHERE s.lesson.id = :lessonId " +
                                NOT_DISABLED_SQL, Long.class)
                .setParameter(Constants.LESSON_ID, lessonId)
                .getSingleResult();
    }

    @Override
    public Long countByLessonIdPeriodIdEvenOddDayOfWeek(Long lessonId, Long periodId, EvenOdd evenOdd, DayOfWeek day) {
        log.info("In countByLessonIdPeriodIdEvenOddDayOfWeek(lessonId = [{}], periodId = [{}], evenOdd = [{}], day = [{}])",
                lessonId, periodId, evenOdd, day);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT COUNT(s.id) FROM Schedule s " +
                                "WHERE s.lesson.id = :lessonId " +
                                "AND s.period.id = :periodId " +
                                "AND s.dayOfWeek = :dayOfWeek " +
                                "AND (s.evenOdd = :evenOdd OR s.evenOdd = 'WEEKLY') " +
                                NOT_DISABLED_SQL, Long.class)
                .setParameter(Constants.LESSON_ID, lessonId)
                .setParameter(Constants.PERIOD_ID, periodId)
                .setParameter(Constants.DAY_OF_WEEK, day)
                .setParameter(Constants.EVEN_ODD, evenOdd)
                .getSingleResult();
    }

    @Override
    public List<Schedule> getAllOrdered(Long semesterId) {
        log.debug("In getAllOrdered(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession()
                .createQuery(GET_ALL_ORDERED_BY_ROOMS_DAYS_PERIODS, Schedule.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .getResultList();
    }

    @Override
    public Optional<Schedule> findByIdWithDetails(Long id) {
        log.info("In findByIdWithDetails(id = [{}])", id);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        SCHEDULE_WITH_DETAILS_JOINS + "WHERE s.id = :id",
                        Schedule.class)
                .setParameter("id", id)
                .uniqueResultOptional();
    }

    @Override
    public List<Schedule> findAllBySemesterWithDetails(Long semesterId) {
        log.info("In findAllBySemesterWithDetails(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession()
                .createQuery(
                        SCHEDULE_WITH_DETAILS_JOINS +
                                "WHERE l.semester.id = :semesterId " +
                                "AND r.disable = false " +
                                "AND sem.disable = false " +
                                "AND g.disable = false " +
                                "AND t.disable = false " +
                                "AND subj.disable = false",
                        Schedule.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .getResultList();
    }
}
