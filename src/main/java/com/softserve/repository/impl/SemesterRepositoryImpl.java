package com.softserve.repository.impl;

import com.softserve.entity.Period;
import com.softserve.entity.Semester;
import com.softserve.repository.SemesterRepository;
import com.softserve.util.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Slf4j
@Repository
public class SemesterRepositoryImpl extends BasicRepositoryImpl<Semester, Long> implements SemesterRepository {

    private static final String HQL_SELECT_DAYS_WITH_LESSONS =
            "SELECT DISTINCT s.dayOfWeek FROM Schedule s WHERE s.lesson.semester.id = :semesterId";

    private static final String HQL_SELECT_PERIODS_WITH_LESSONS =
            "SELECT s.period FROM Schedule s WHERE s.lesson.semester.id = :semesterId";

    private static final String HQL_GET_ALL =
            "SELECT DISTINCT s FROM Semester s " +
                    "LEFT JOIN FETCH s.periods " +
                    "LEFT JOIN FETCH s.groups " +
                    "LEFT JOIN FETCH s.daysOfWeek " +
                    "WHERE s.disable = false";

    private static final String HQL_COUNT_SCHEDULES_BY_SEMESTER =
            "SELECT count(s.id) FROM Schedule s WHERE s.lesson.semester.id = :semesterId";

    private static final String HQL_COUNT_DUPLICATES_BY_DESCRIPTION_AND_YEAR =
            "SELECT count(s.id) FROM Semester s WHERE s.description = :description AND s.year = :year";

    private static final String HQL_GET_BY_DESCRIPTION_AND_YEAR =
            "SELECT s FROM Semester s WHERE s.description = :description AND s.year = :year";

    private static final String HQL_UPDATE_ALL_CURRENT_TO_FALSE =
            "UPDATE Semester s SET s.currentSemester = false WHERE s.currentSemester = true";

    private static final String HQL_UPDATE_ALL_DEFAULT_TO_FALSE =
            "UPDATE Semester s SET s.defaultSemester = false WHERE s.defaultSemester = true";

    private static final String HQL_SET_CURRENT_SEMESTER =
            "UPDATE Semester s SET s.currentSemester = true WHERE s.id = :semesterId";

    private static final String HQL_SET_DEFAULT_SEMESTER =
            "UPDATE Semester s SET s.defaultSemester = true WHERE s.id = :semesterId";

    private static final String PARAM_DESCRIPTION = "description";
    private static final String PARAM_YEAR = "year";

    @Override
    public List<Semester> getAll() {
        log.info("In getAll()");
        return getSession()
                .createQuery(HQL_GET_ALL, Semester.class)
                .getResultList();
    }

    @Override
    public Semester update(Semester entity) {
        log.info("Enter into update method with entity:{}", entity);
        return sessionFactory.getCurrentSession().merge(entity);
    }

    @Override
    protected boolean checkReference(Semester semester) {
        log.info("In checkReference(semester = [{}])", semester);
        Long count = sessionFactory.getCurrentSession()
                .createQuery(HQL_COUNT_SCHEDULES_BY_SEMESTER, Long.class)
                .setParameter(Constants.SEMESTER_ID, semester.getId())
                .getSingleResult();
        return count != 0;
    }

    @Override
    public Long countSemesterDuplicatesByDescriptionAndYear(String description, int year) {
        log.info("In countSemesterDuplicates(description = [{}], year = [{}])", description, year);
        return sessionFactory.getCurrentSession()
                .createQuery(HQL_COUNT_DUPLICATES_BY_DESCRIPTION_AND_YEAR, Long.class)
                .setParameter(PARAM_DESCRIPTION, description)
                .setParameter(PARAM_YEAR, year)
                .getSingleResult();
    }

    @Override
    public Optional<Semester> getCurrentSemester() {
        log.info("In getCurrentSemester method");
        List<Semester> semesters = sessionFactory.getCurrentSession()
                .createNamedQuery("findCurrentSemester", Semester.class)
                .setParameter("currentSemester", true)
                .setMaxResults(1)
                .getResultList();
        return semesters.isEmpty() ? Optional.empty() : Optional.of(semesters.get(0));
    }

    @Override
    public Optional<Semester> getDefaultSemester() {
        log.info("In getDefaultSemester method");
        List<Semester> semesters = sessionFactory.getCurrentSession()
                .createNamedQuery("findDefaultSemester", Semester.class)
                .setParameter("defaultSemester", true)
                .setMaxResults(1)
                .getResultList();
        return semesters.isEmpty() ? Optional.empty() : Optional.of(semesters.get(0));
    }

    @Override
    public int updateAllSemesterCurrentToFalse() {
        log.info("In setCurrentSemesterToFalse()");
        return sessionFactory.getCurrentSession()
                .createMutationQuery(HQL_UPDATE_ALL_CURRENT_TO_FALSE)
                .executeUpdate();
    }

    @Override
    public int updateAllSemesterDefaultToFalse() {
        log.info("In setDefaultSemesterToFalse()");
        return sessionFactory.getCurrentSession()
                .createMutationQuery(HQL_UPDATE_ALL_DEFAULT_TO_FALSE)
                .executeUpdate();
    }

    @Override
    public int setCurrentSemester(Long semesterId) {
        log.info("In setCurrentSemester(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession()
                .createMutationQuery(HQL_SET_CURRENT_SEMESTER)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .executeUpdate();
    }

    @Override
    public int setDefaultSemester(Long semesterId) {
        log.info("In setDefaultSemester(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession()
                .createMutationQuery(HQL_SET_DEFAULT_SEMESTER)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .executeUpdate();
    }

    @Override
    public Optional<Semester> getSemesterByDescriptionAndYear(String description, int year) {
        log.info("In getSemesterByDescriptionAndYear(description = [{}], year = [{}])", description, year);
        return sessionFactory.getCurrentSession()
                .createQuery(HQL_GET_BY_DESCRIPTION_AND_YEAR, Semester.class)
                .setParameter(PARAM_DESCRIPTION, description)
                .setParameter(PARAM_YEAR, year)
                .uniqueResultOptional();
    }

    @Override
    public List<DayOfWeek> getDaysWithLessonsBySemesterId(Long semesterId) {
        log.info("In getDaysWithLessonsBySemesterId(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession()
                .createQuery(HQL_SELECT_DAYS_WITH_LESSONS, DayOfWeek.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .getResultList();
    }

    @Override
    public List<Period> getPeriodsWithLessonsBySemesterId(Long semesterId) {
        log.info("In getPeriodsWithLessonsBySemesterId(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession()
                .createQuery(HQL_SELECT_PERIODS_WITH_LESSONS, Period.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .getResultList();
    }
}
