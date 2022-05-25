package com.softserve.repository.impl;

import com.softserve.entity.Student;
import com.softserve.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

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

    private static final String GET_STUDENT_WITH_FULL_NAME_SURNAME
            = "select s from Student s " +
            "where s.name = :sName and " +
            "s.surname = :sSurname and " +
            "s.patronymic = :sPatronymic";

    @Override
    public Optional<Student> getExistingStudent(Student student) {
        return sessionFactory.getCurrentSession().createQuery(GET_STUDENT_WITH_FULL_NAME_SURNAME)
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
     * @param id    Long id, which is used to find Student
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
    public boolean isIdPresent(Long id) {
        return (boolean) sessionFactory.getCurrentSession()
                .createQuery("SELECT (count(*) > 0) "
                        + "FROM Student s "
                        + "WHERE s.id = :sId")
                .setParameter("sId", id)
                .getSingleResult();
    }

}
