package com.softserve.repository.impl;

import com.softserve.entity.Student;
import com.softserve.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class StudentRepositoryImpl extends BasicRepositoryImpl<Student, Long> implements StudentRepository {
    private static final String HQL_IS_EXISTS_BY_EMAIL
            = "SELECT (count(*) > 0) "
            + "FROM Student s "
            + "WHERE s.user.email = :email";

    private static final String HQL_IS_EXISTS_BY_EMAIL_IN_CURRENT_STUDENT
            = "SELECT (count(*) > 0) "
            + "FROM Student s "
            + "WHERE s.user.email = :email AND s.id = :id";

    private static final String FIND_BY_EMAIL = "SELECT s FROM Student s JOIN FETCH s.group WHERE s.email = :email";

    @Override
    public Optional<Student> getExistingStudent(Student student) {
        return sessionFactory.getCurrentSession().createQuery(
                        "select s from Student s " +
                                "where s.name = :sName and " +
                                "s.surname = :sSurname and " +
                                "s.patronymic = :sPatronymic")
                .setParameter("sName", student.getName())
                .setParameter("sSurname", student.getSurname())
                .setParameter("sPatronymic", student.getPatronymic())
                .uniqueResultOptional();
    }

    /**
     * The method used for finding out if Student exists by email
     *
     * @param email String email used to find Student
     * @return boolean : if exists - true, else - false
     */
    @Override
    public boolean isEmailInUse(String email) {
        return (boolean) sessionFactory.getCurrentSession()
                .createQuery(HQL_IS_EXISTS_BY_EMAIL)
                .setParameter("email", email)
                .getSingleResult();
    }

    /**
     * The method used for finding out if Student exists by email and id
     *
     * @param email String email used to find Student
     * @param id Long id, which is used to find Student
     * @return boolean : if exists - true, else - false
     */
    @Override
    public boolean isEmailForThisStudent(String email, Long id) {
        return (boolean) sessionFactory.getCurrentSession()
                .createQuery(HQL_IS_EXISTS_BY_EMAIL_IN_CURRENT_STUDENT)
                .setParameter("email", email)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    public Optional<Student> findByEmail(String email) {
        return sessionFactory.getCurrentSession().createQuery(
                        "select s from Student s " +
                                "where s.user.email = :sEmail")
                .setParameter("sEmail", email)
                .uniqueResultOptional();
    }
}
