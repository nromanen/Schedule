package com.softserve.repository.impl;

import com.softserve.entity.Semester;
import com.softserve.exception.DeleteDisabledException;
import com.softserve.repository.SemesterRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
public class SemesterRepositoryImpl extends BasicRepositoryImpl<Semester, Long> implements SemesterRepository {

    /**
     * The method used for deleting object in database, checking references before it
     *
     * @param entity is going to be deleted
     * @return deleted entity
     * @throws DeleteDisabledException when there are still references pointing to object requested for deleting
     */
    @Override
    public Semester delete(Semester entity) {
        if (checkReference(entity.getId())) {
            throw new DeleteDisabledException("Unable to delete object, till another object is referenced on it");
        }
        return super.delete(entity);
    }

    // Checking by id if semester is used in Schedule and TeacherWishes tables
    private boolean checkReference(Long semesterId) {
        long count = (long) sessionFactory.getCurrentSession().createQuery
                ("select count (s.id) " +
                        "from Schedule s where s.semester.id = :semesterId")
                .setParameter("semesterId", semesterId).getSingleResult()
                + (long) sessionFactory.getCurrentSession().createQuery
                ("select count (tw.id) " +
                        "from TeacherWishes tw where tw.semester.id = :semesterId")
                .setParameter("semesterId", semesterId).getSingleResult();

        return count != 0;
    }
}
