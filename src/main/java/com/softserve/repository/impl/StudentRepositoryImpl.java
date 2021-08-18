package com.softserve.repository.impl;

import com.softserve.entity.Student;
import com.softserve.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class StudentRepositoryImpl extends BasicRepositoryImpl<Student, Long> implements StudentRepository {
    private static final String HQL_IS_EXISTS_BY_EMAIL
            = "SELECT (count(*) > 0) "
            + "FROM Student s "
            + "WHERE s.email = :email";

    private static final String HQL_IS_EXISTS_BY_EMAIL_IGNORING_ID
            = "SELECT (count(*) > 0) "
            + "FROM Student s "
            + "WHERE s.email = :email AND s.id != :id";

    /**
     * The method used for finding out if Student exists by email
     *
     * @param email String email used to find Student
     * @return Student
     */
    @Override
    public boolean isExistsByEmail(String email) {
        return (boolean) sessionFactory.getCurrentSession()
                .createQuery(HQL_IS_EXISTS_BY_EMAIL)
                .setParameter("email", email)
                .getSingleResult();
    }

    /**
     * The method used for finding out if Student exists by email ignoring id
     *
     * @param email String email used to find Student
     * @param id Long id, which is ignored during the search
     * @return Student
     */
    @Override
    public boolean isExistsByEmailIgnoringId(String email, Long id) {
        return (boolean) sessionFactory.getCurrentSession()
                .createQuery(HQL_IS_EXISTS_BY_EMAIL_IGNORING_ID)
                .setParameter("email", email)
                .setParameter("id", id)
                .getSingleResult();
    }
}
