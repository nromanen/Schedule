package com.softserve.repository.impl;


import com.softserve.entity.Teacher;
import com.softserve.exception.DeleteDisabledException;
import com.softserve.repository.TeacherRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
@Slf4j
@SuppressWarnings("unchecked")
public class TeacherRepositoryImpl extends BasicRepositoryImpl<Teacher, Long> implements TeacherRepository {
    /**
     * The method used for getting list of teachers entities from database
     *
     * @return list of entities ordered by surname
     */
    @Override
    public List<Teacher> getAll() {
        log.info("Enter into getAll of TeacherRepositoryImpl");
        return sessionFactory.getCurrentSession().
                createQuery("select t from " + basicClass.getName() + " t" +
                        " order by t.surname ASC").getResultList();
    }

    /**
     * The method used for deleting object in database, checking references before it
     *
     * @param entity is going to be deleted
     * @return deleted entity
     * @throws DeleteDisabledException when there are still references pointing to object requested for deleting
     */
    @Override
    public Teacher delete(Teacher entity) {
        if (checkReference(entity.getId())) {
            throw new DeleteDisabledException("Unable to delete object, till another object is referenced on it");
        }
        return super.delete(entity);
    }

    // Checking by id if teacher is used in Lesson and TeacherWishes tables
    public boolean checkReference(Long teacherId) {
        long count = (long) sessionFactory.getCurrentSession().createQuery
                ("select count (l.id) " +
                        "from Lesson l where l.teacher.id = :teacherId")
                .setParameter("teacherId", teacherId).getSingleResult()
                + (long) sessionFactory.getCurrentSession().createQuery
                ("select count (tw.id) " +
                        "from TeacherWishes tw where tw.teacher.id = :teacherId")
                .setParameter("teacherId", teacherId).getSingleResult();

        return count != 0;
    }
}
