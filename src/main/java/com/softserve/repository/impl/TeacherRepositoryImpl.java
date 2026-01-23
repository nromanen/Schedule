package com.softserve.repository.impl;

import com.softserve.entity.Teacher;
import com.softserve.repository.TeacherRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class TeacherRepositoryImpl extends BasicRepositoryImpl<Teacher, Long> implements TeacherRepository {

    private static final String DISABLE_FILTER = " AND t.disable = false";

    private static final String GET_ALL_QUERY =
            "SELECT t FROM Teacher t WHERE t.disable = false ORDER BY t.surname ASC";

    private static final String CHECK_REFERENCE =
            "SELECT count(l.id) FROM Lesson l WHERE l.teacher.id = :teacherId";

    private static final String FIND_BY_USER_ID =
            "SELECT t FROM Teacher t WHERE t.userId = :userId" + DISABLE_FILTER;

    private static final String GET_ALL_WITHOUT_USER =
            "SELECT t FROM Teacher t WHERE t.userId IS NULL" + DISABLE_FILTER;

    private static final String GET_EXISTING_TEACHER =
            "SELECT t FROM Teacher t " +
                    "WHERE t.name = :tName " +
                    "AND t.surname = :tSurname " +
                    "AND t.patronymic = :tPatronymic " +
                    "AND t.position = :tPosition" +
                    DISABLE_FILTER;

    @Override
    public List<Teacher> getAll() {
        log.info("Enter into getAll of TeacherRepositoryImpl");
        return getSession()
                .createQuery(GET_ALL_QUERY, Teacher.class)
                .getResultList();
    }

    @Override
    public Teacher update(Teacher entity) {
        getSession().clear();
        return super.update(entity);
    }

    @Override
    protected boolean checkReference(Teacher teacher) {
        log.info("In checkReference(teacher = [{}])", teacher);
        Long count = getSession()
                .createQuery(CHECK_REFERENCE, Long.class)
                .setParameter("teacherId", teacher.getId())
                .getSingleResult();
        return count != 0;
    }

    @Override
    public Optional<Teacher> findByUserId(Long userId) {
        return getSession()
                .createQuery(FIND_BY_USER_ID, Teacher.class)
                .setParameter("userId", userId)
                .uniqueResultOptional();
    }

    @Override
    public List<Teacher> getAllTeacherWithoutUser() {
        log.info("Enter into getAllTeacherWithoutUser of TeacherRepositoryImpl");
        return getSession()
                .createQuery(GET_ALL_WITHOUT_USER, Teacher.class)
                .getResultList();
    }

    @Override
    public Optional<Teacher> getExistingTeacher(Teacher teacher) {
        return getSession()
                .createQuery(GET_EXISTING_TEACHER, Teacher.class)
                .setParameter("tName", teacher.getName())
                .setParameter("tSurname", teacher.getSurname())
                .setParameter("tPatronymic", teacher.getPatronymic())
                .setParameter("tPosition", teacher.getPosition())
                .uniqueResultOptional();
    }
}
