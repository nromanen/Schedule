package com.softserve.repository.impl;

import com.softserve.entity.Semester;
import com.softserve.repository.SemesterRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

@Slf4j
@Repository
public class SemesterRepositoryImpl extends BasicRepositoryImpl<Semester, Long> implements SemesterRepository {

    private Session getSession(){
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
        Session session = getSession();
        return session.createQuery("from Semester " )
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
        long count = (long) sessionFactory.getCurrentSession().createQuery
                ("select count (s.id) " +
                        "from Schedule s where s.semester.id = :semesterId")
                .setParameter("semesterId", semester.getId()).getSingleResult();

        return count != 0;
    }

    /**
     * Method searches duplicate of semester in the DB
     *
     * @param semester Semester entity that needs to be verified
     * @return Optional with Semester of duplicates if such exist, else return empty Optional
     */
    @Override
    public Optional<Semester> semesterDuplicates(Semester semester) {
        log.info("In countSemesterDuplicates(semester = [{}])", semester);
        TypedQuery<Semester> query = sessionFactory.getCurrentSession().createNamedQuery("findDescriptionAndYear", Semester.class).setMaxResults(1);
        query.setParameter("description", semester.getDescription()).setParameter("year", semester.getYear());
        List<Semester> semesters = query.getResultList();
        if (semesters.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(query.getResultList().get(0));
    }

    /**
     * Method searches get of semester with currentSemester = true in the DB
     *
     * @return Optional with Semester if such exist, else return empty Optional
     */
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
    public List<Semester> getDisabled() {
        log.info("In getDisabled");
        return sessionFactory.getCurrentSession().createQuery(
                "select s from Semester s " +
                        "where s.disable = true ")
                .getResultList();
    }

    @Override
    public int setCurrentSemesterToFalse() {
        log.info("In setCurrentSemesterToFalse()");
        return  sessionFactory.getCurrentSession().createQuery(
                "UPDATE Semester s set s.currentSemester = false  where currentSemester = true")
                .executeUpdate();
    }

    @Override
    public int setCurrentSemester(Long semesterId) {
        log.info("In setCurrentSemester(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession().createQuery(
                "UPDATE Semester s set s.currentSemester = true  where s.id = :semesterId")
                .setParameter("semesterId", semesterId)
                .executeUpdate();
    }
}
