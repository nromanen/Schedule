package com.softserve.repository.impl;

import com.softserve.entity.Student;
import com.softserve.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@Slf4j
public class StudentRepositoryImpl extends BasicRepositoryImpl<Student, Long> implements StudentRepository {

    private static final String FROM_STUDENT = " FROM Student s ";

    private static final String HQL_IS_EXISTS_BY_EMAIL
            = "SELECT CASE WHEN count(s.id) > 0 THEN true ELSE false END"
            + FROM_STUDENT
            + "WHERE s.user.email = :email";

    private static final String HQL_IS_EXISTS_BY_EMAIL_IN_CURRENT_STUDENT
            = "SELECT CASE WHEN count(s.id) > 0 THEN true ELSE false END"
            + FROM_STUDENT
            + "WHERE s.user.email = :email AND s.id = :id";

    private static final String GET_STUDENT_WITH_FULL_NAME_SURNAME
            = "SELECT s" + FROM_STUDENT +
            "WHERE s.name = :sName AND " +
            "s.surname = :sSurname AND " +
            "s.patronymic = :sPatronymic";

    @Override
    public Optional<Student> getExistingStudent(Student student) {
        return sessionFactory.getCurrentSession()
                .createQuery(GET_STUDENT_WITH_FULL_NAME_SURNAME, Student.class)
                .setParameter("sName", student.getName())
                .setParameter("sSurname", student.getSurname())
                .setParameter("sPatronymic", student.getPatronymic())
                .uniqueResultOptional();
    }

    @Override
    public boolean isEmailInUse(String email) {
        return sessionFactory.getCurrentSession()
                .createQuery(HQL_IS_EXISTS_BY_EMAIL, Boolean.class)
                .setParameter("email", email)
                .getSingleResult();
    }

    @Override
    public boolean isEmailForThisStudent(String email, Long id) {
        return sessionFactory.getCurrentSession()
                .createQuery(HQL_IS_EXISTS_BY_EMAIL_IN_CURRENT_STUDENT, Boolean.class)
                .setParameter("email", email)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    public boolean isIdPresent(Long id) {
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT CASE WHEN count(s.id) > 0 THEN true ELSE false END " +
                        "FROM Student s " +
                        "WHERE s.id = :sId", Boolean.class)
                .setParameter("sId", id)
                .getSingleResult();
    }
}
