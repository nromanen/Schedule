package com.softserve.repository.impl;

import com.softserve.entity.Subject;
import com.softserve.exception.DeleteDisabledException;
import com.softserve.repository.SubjectRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class SubjectRepositoryImpl extends BasicRepositoryImpl<Subject, Long> implements SubjectRepository {

    /**
     * Method gets information about all subjects from DB
     *
     * @return List of all subjects with ASCII sorting by name
     */
    @Override
    public List<Subject> getAll() {
        log.info("Enter into getAll method");
        return sessionFactory.getCurrentSession()
                .createQuery("from Subject ORDER BY name ASC")
                .getResultList();
    }

    /**
     * The method used for getting number of subjects with name from database
     *
     * @param name String name used to find Subject
     * @return Long number of records with name
     */
    @Override
    public Long countSubjectsWithName(String name) {
        log.info("Enter into countSubjectsWithName method with name:{}", name);
        return (Long) sessionFactory.getCurrentSession().createQuery
                ("SELECT count (*) FROM Subject s WHERE s.name = :name")
                .setParameter("name", name).getSingleResult();
    }

    /**
     * Method used to verify if Subject with such id exists
     *
     * @param id of the Subject
     * @return 0 if there is no Subject with such id, 1 if record with id exists
     */
    @Override
    public Long existsById(Long id) {
        log.info("Enter into existsById method with id:{}", id);
        return (Long) sessionFactory.getCurrentSession().createQuery
                ("SELECT count (*) FROM Subject s WHERE s.id = :id")
                .setParameter("id", id).getSingleResult();
    }

    /**
     * The method used for deleting object in database, checking references before it
     *
     * @param entity is going to be deleted
     * @return deleted entity
     * @throws DeleteDisabledException when there are still references pointing to object requested for deleting
     */
    @Override
    public Subject delete(Subject entity) {
        if (checkReference(entity.getId())) {
            throw new DeleteDisabledException("Unable to delete object, till another object is referenced on it");
        }
        return super.delete(entity);
    }

    // Checking by id if subject is used in Lesson table
    private boolean checkReference(Long subjectId) {
        long count = (long) sessionFactory.getCurrentSession().createQuery
                ("select count (l.id) " +
                        "from Lesson l where l.subject.id = :subjectId")
                .setParameter("subjectId", subjectId)
                .getSingleResult();
        return count != 0;
    }
}
