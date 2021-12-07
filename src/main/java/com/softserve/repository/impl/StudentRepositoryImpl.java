package com.softserve.repository.impl;

import com.softserve.entity.Student;
import com.softserve.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@Slf4j
public class StudentRepositoryImpl extends BasicRepositoryImpl<Student, Long> implements StudentRepository {

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

    @Override
    public boolean isEmailInUse(String email) {
        long count = sessionFactory.getCurrentSession().createQuery(
                        "select count(s) from Student s " +
                                "where s.user.email = :sEmail")
                .setParameter("sEmail", email).stream().count();
        return count != 0;
    }

    @Override
    public boolean isEmailForThisStudent(String email, Long id) {
        long count = sessionFactory.getCurrentSession().createQuery(
                        "select count(s) from Student s " +
                                "where s.user.email = :sEmail " +
                                "and s.id = :sId")
                .setParameter("sEmail", email)
                .setParameter("sId", id).stream().count();
        return count != 0;
    }

}
