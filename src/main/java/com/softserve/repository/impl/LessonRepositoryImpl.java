package com.softserve.repository.impl;

import com.softserve.entity.Lesson;
import com.softserve.exception.DeleteDisabledException;
import com.softserve.repository.LessonRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class LessonRepositoryImpl extends BasicRepositoryImpl<Lesson, Long> implements LessonRepository {

    /**
     * Method gets information about all lessons for particular group from DB
     *
     * @param groupId Identity number of the group for which need to find all lessons
     * @return List of filtered lessons
     */
    @Override
    public List<Lesson> getAllForGroup(Long groupId) {
        log.info("Enter into  getAllForGroup method to search lessons for group with id = {}", groupId);

        return sessionFactory.getCurrentSession().createQuery
                ("FROM Lesson l WHERE l.group.id = :groupId")
                .setParameter("groupId", groupId).getResultList();
    }


    /**
     * Method searches duplicate of lesson in the DB
     *
     * @param lesson Lesson entity that needs to be verified
     * @return count of duplicates if such exist, else return 0
     */
    @Override
    public Long countLessonDuplicates(Lesson lesson) {
        return (Long) sessionFactory.getCurrentSession().createQuery("" +
                "select count(*) from Lesson l " +
                "where l.teacher.id = :teacherId " +
                "and l.subject.id = :subjectId " +
                "and l.group.id = :groupId " +
                "and l.lessonType = :lessonType")
                .setParameter("teacherId", lesson.getTeacher().getId())
                .setParameter("subjectId", lesson.getSubject().getId())
                .setParameter("groupId", lesson.getSubject().getId())
                .setParameter("lessonType", lesson.getLessonType())
                .getSingleResult();
    }

    /**
     * The method used for deleting object in database, checking references before it
     *
     * @param entity is going to be deleted
     * @return deleted entity
     * @throws DeleteDisabledException when there are still references pointing to object requested for deleting
     */
    @Override
    public Lesson delete(Lesson entity) {
        if (checkReference(entity.getId())) {
            throw new DeleteDisabledException("Unable to delete object, till another object is referenced on it");
        }
        return super.delete(entity);
    }

    // Checking by id if lesson is used in Schedule table
    private boolean checkReference(Long lessonId) {
        long count = (long) sessionFactory.getCurrentSession().createQuery
                ("select count (s.id) " +
                        "from Schedule s where s.lesson.id = :lessonId")
                .setParameter("lessonId", lessonId)
                .getSingleResult();
        return count != 0;
    }
}
