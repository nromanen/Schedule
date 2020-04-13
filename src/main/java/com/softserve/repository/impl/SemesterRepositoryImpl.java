package com.softserve.repository.impl;

import com.softserve.entity.Semester;
import com.softserve.repository.SemesterRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

@Slf4j
@Repository
public class SemesterRepositoryImpl extends BasicRepositoryImpl<Semester, Long> implements SemesterRepository {


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
        TypedQuery<Semester> query = sessionFactory.getCurrentSession().createNamedQuery("findDescription", Semester.class).setMaxResults(1);
        query.setParameter("description", semester.getDescription());
        List<Semester> semesters = query.getResultList();
        if (semesters.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(query.getResultList().get(0));
    }
}
