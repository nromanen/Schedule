package com.softserve.repository.impl;

import com.softserve.dto.SubjectWithTypeDTO;
import com.softserve.entity.Subject;
import com.softserve.repository.SubjectRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class SubjectRepositoryImpl extends BasicRepositoryImpl<Subject, Long> implements SubjectRepository {

    private static final String GET_SUBJECTS = "SELECT new com.softserve.dto.SubjectWithTypeDTO(l.subject, l.lessonType) " +
            "FROM Lesson l WHERE l.teacher.id = :teacherId AND l.semester.id = :semesterId";

    private Session getSession(){
        Session session = sessionFactory.getCurrentSession();
        Filter filter = session.enableFilter("subjectDisableFilter");
        filter.setParameter("disable", false);
        return session;
    }
    /**
     * Method gets information about all subjects from DB
     *
     * @return List of all subjects with ASCII sorting by name
     */
    @Override
    public List<Subject> getAll() {
        log.info("In getAll()");
        Session session = getSession();
        return session.createQuery("from Subject ORDER BY name ASC", Subject.class)
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
        log.info("In countSubjectsWithName(name = [{}])", name);
        return (Long) sessionFactory.getCurrentSession().createQuery
                ("SELECT count (*) FROM Subject s WHERE s.name = :name")
                .setParameter("name", name).getSingleResult();
    }

    /**
     * The method used for getting number of subjects with name from database
     *
     * @param id Long id used to ignore Subject
     * @param name String name used to find Subject
     * @return Long number of records with name
     */
    @Override
    public Long countSubjectsWithNameAndIgnoreWithId(Long id, String name) {
        log.info("In countSubjectsWithName(name = [{}])", name);
        return (Long) sessionFactory.getCurrentSession().createQuery
                ("SELECT count (*) FROM Subject s WHERE s.name = :name and id!=:id")
                .setParameter("name", name).setParameter("id", id).getSingleResult();
    }

    /**
     * Method used to verify if Subject with such id exists
     *
     * @param id of the Subject
     * @return 0 if there is no Subject with such id, 1 if record with id exists
     */
    @Override
    public Long countBySubjectId(Long id) {
        log.info("In countBySubjectId(id = [{}])", id);
        return (Long) sessionFactory.getCurrentSession().createQuery
                ("SELECT count (*) FROM Subject s WHERE s.id = :id")
                .setParameter("id", id).getSingleResult();
    }

    // Checking if subject is used in Lesson table
    @Override
    protected boolean checkReference(Subject subject) {
        log.info("In checkReference(subject = [{}])", subject);
        Long count = (Long) sessionFactory.getCurrentSession().createQuery
                ("select count (l.id) " +
                        "from Lesson l where l.subject.id = :subjectId")
                .setParameter("subjectId", subject.getId())
                .getSingleResult();
        return count != 0;
    }

    /**
     * The method used for getting subjects with their types from database
     * @param semesterId Long semester from which subjects will be taken
     * @param teacherId Long teacher who teaches subjects
     * @return List of subjects with their types
     */
    @Override
    public List<SubjectWithTypeDTO> getSubjectsWithTypes(Long semesterId, Long teacherId) {
        log.info("In repository getSubjects(semesterId = [{}], teacherId = [{}])", semesterId, teacherId);
        return sessionFactory.getCurrentSession().createQuery(GET_SUBJECTS, SubjectWithTypeDTO.class)
                .setParameter("teacherId", teacherId)
                .setParameter("semesterId", semesterId)
                .getResultList();
    }
}
