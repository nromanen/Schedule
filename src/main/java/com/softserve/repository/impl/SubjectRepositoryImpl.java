package com.softserve.repository.impl;

import com.softserve.dto.SubjectWithTypeDTO;
import com.softserve.entity.Subject;
import com.softserve.repository.SubjectRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class SubjectRepositoryImpl extends BasicRepositoryImpl<Subject, Long> implements SubjectRepository {

    private static final String GET_SUBJECTS = "SELECT new com.softserve.dto.SubjectWithTypeDTO(l.subject, l.lessonType) " +
            "FROM Lesson l WHERE l.teacher.id = :teacherId AND l.semester.id = :semesterId";

    @Override
    public List<Subject> getAll() {
        log.info("In getAll()");
        Session session = getSession();
        return session.createQuery("SELECT s FROM Subject s ORDER BY s.name ASC", Subject.class)
                .getResultList();
    }

    @Override
    public Long countSubjectsWithName(String name) {
        log.info("In countSubjectsWithName(name = [{}])", name);
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT count(s.id) FROM Subject s WHERE s.name = :name", Long.class)
                .setParameter("name", name)
                .getSingleResult();
    }

    @Override
    public Long countSubjectsWithNameAndIgnoreWithId(Long id, String name) {
        log.info("In countSubjectsWithName(name = [{}])", name);
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT count(s.id) FROM Subject s WHERE s.name = :name AND s.id <> :id", Long.class)
                .setParameter("name", name)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    public Long countBySubjectId(Long id) {
        log.info("In countBySubjectId(id = [{}])", id);
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT count(s.id) FROM Subject s WHERE s.id = :id", Long.class)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    protected boolean checkReference(Subject subject) {
        log.info("In checkReference(subject = [{}])", subject);
        Long count = sessionFactory.getCurrentSession()
                .createQuery("SELECT count(l.id) FROM Lesson l WHERE l.subject.id = :subjectId", Long.class)
                .setParameter("subjectId", subject.getId())
                .getSingleResult();
        return count != 0;
    }

    @Override
    public List<SubjectWithTypeDTO> getSubjectsWithTypes(Long semesterId, Long teacherId) {
        log.info("In repository getSubjects(semesterId = [{}], teacherId = [{}])", semesterId, teacherId);
        return sessionFactory.getCurrentSession()
                .createQuery(GET_SUBJECTS, SubjectWithTypeDTO.class)
                .setParameter("teacherId", teacherId)
                .setParameter("semesterId", semesterId)
                .getResultList();
    }
}
