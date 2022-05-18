package com.softserve.repository.impl;

import com.softserve.entity.Period;
import com.softserve.entity.Semester;
import com.softserve.repository.SemesterRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Slf4j
@Repository
public class SemesterRepositoryImpl extends BasicRepositoryImpl<Semester, Long> implements SemesterRepository {

    private static final String HQL_SELECT_DAYS_WITH_LESSONS
            = "select distinct s.dayOfWeek from Schedule s where s.lesson.semester.id = :semesterId";

    private static final String HQL_SELECT_PERIODS_WITH_LESSONS
            = "select s.period from Schedule s where s.lesson.semester.id = :semesterId";

    private Session getSession() {
        Session session = sessionFactory.getCurrentSession();
        Filter filter = session.enableFilter("semesterDisableFilter");
        filter.setParameter("disable", false);
        return session;
    }

    /**
     * The method used for getting list of entities from database
     *
     * @return list of entities
     */
    @Override
    public List<Semester> getAll() {
        log.info("In getAll()");
        return getSession().createQuery("SELECT distinct s " +
                        "from Semester s " +
                        "left join fetch s.periods " +
                        "left join fetch s.groups " +
                        "left join fetch s.daysOfWeek", Semester.class)
                .getResultList();
    }

    /**
     * Modified update method, which merge entity before updating it
     *
     * @param entity Semester is going to be updated
     * @return Semester
     */
    @Override
    public Semester update(Semester entity) {
        log.info("Enter into update method with entity:{}", entity);
        entity = (Semester) sessionFactory.getCurrentSession().merge(entity);
        sessionFactory.getCurrentSession().update(entity);
        return entity;
    }

    // Checking if semester is used in Schedule table
    @Override
    protected boolean checkReference(Semester semester) {
        log.info("In checkReference(semester = [{}])", semester);
        Long count = (Long) sessionFactory.getCurrentSession().createQuery
                        ("select count (s.id) " +
                                "from Schedule s where s.lesson.semester.id = :semesterId")
                .setParameter("semesterId", semester.getId()).getSingleResult();

        return count != 0;
    }

    @Override
    public Long countSemesterDuplicatesByDescriptionAndYear(String description, int year) {
        log.info("In countSemesterDuplicates(description = [{}], year = [{}])", description, year);
        return (Long) sessionFactory.getCurrentSession().createQuery("select count(*) from Semester s where s.description = :description and s.year = :year")
                .setParameter("description", description)
                .setParameter("year", year)
                .getSingleResult();
    }

    @Override
    public Optional<Semester> getCurrentSemester() {
        log.info("In getCurrentSemester method");
        TypedQuery<Semester> query = sessionFactory.getCurrentSession().createNamedQuery("findCurrentSemester", Semester.class).setMaxResults(1);
        query.setParameter("currentSemester", true);
        List<Semester> semesters = query.getResultList();
        if (semesters.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(semesters.get(0));
    }

    @Override
    public Optional<Semester> getDefaultSemester() {
        log.info("In getDefaultSemester method");
        TypedQuery<Semester> query = sessionFactory.getCurrentSession().createNamedQuery("findDefaultSemester", Semester.class).setMaxResults(1);
        query.setParameter("defaultSemester", true);
        List<Semester> semesters = query.getResultList();
        if (semesters.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(semesters.get(0));
    }

    @Override
    public int updateAllSemesterCurrentToFalse() {
        log.info("In setCurrentSemesterToFalse()");
        return sessionFactory.getCurrentSession().createQuery(
                        "UPDATE Semester s set s.currentSemester = false where currentSemester = true")
                .executeUpdate();
    }

    @Override
    public int updateAllSemesterDefaultToFalse() {
        log.info("In setDefaultSemesterToFalse()");
        return sessionFactory.getCurrentSession().createQuery(
                        "UPDATE Semester s set s.defaultSemester = false where defaultSemester = true")
                .executeUpdate();
    }

    @Override
    public int setCurrentSemester(Long semesterId) {
        log.info("In setCurrentSemester(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession().createQuery(
                        "UPDATE Semester s set s.currentSemester = true where s.id = :semesterId")
                .setParameter("semesterId", semesterId)
                .executeUpdate();
    }

    @Override
    public int setDefaultSemester(Long semesterId) {
        log.info("In setDefaultSemester(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession().createQuery(
                        "UPDATE Semester s set s.defaultSemester = true where s.id = :semesterId")
                .setParameter("semesterId", semesterId)
                .executeUpdate();
    }

    @Override
    public Optional<Semester> getSemesterByDescriptionAndYear(String description, int year) {
        log.info("In getSemesterByDescriptionAndYear(String description = [{}], int year = [{}])", description, year);
        return sessionFactory.getCurrentSession().createQuery("select s from Semester s where s.description= :description and s.year= :year", Semester.class)
                .setParameter("description", description).
                setParameter("year", year)
                .uniqueResultOptional();
    }

    @Override
    public List<DayOfWeek> getDaysWithLessonsBySemesterId(Long semesterId) {
        log.info("In getDaysWithLessonsBySemesterId(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession().createQuery(HQL_SELECT_DAYS_WITH_LESSONS, DayOfWeek.class)
                .setParameter("semesterId", semesterId)
                .getResultList();
    }

    @Override
    public List<Period> getPeriodsWithLessonsBySemesterId(Long semesterId) {
        log.info("In getPeriodsWithLessonsBySemesterId(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession().createQuery(HQL_SELECT_PERIODS_WITH_LESSONS, Period.class)
                .setParameter("semesterId", semesterId)
                .getResultList();
    }
}
