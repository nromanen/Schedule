package com.softserve.repository.impl;

import com.softserve.entity.Student;
import com.softserve.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import java.util.List;

@Repository
@Slf4j
public class StudentRepositoryImpl extends BasicRepositoryImpl<Student, Long> implements StudentRepository {

    /**
     * The method used for getting list of Student entities from database
     *
     * @return list of entities ordered by surname
     */
    @Override
    public List<Student> getAll() {
        return sessionFactory.getCurrentSession().createQuery("select s from " +  basicClass.getName() + " as s"
             + " order by s.surname ASC").getResultList();
    }

    /**
     * The method used for getting Student by email from database
     *
     * @param email String email used to find Student by it
     * @return Student
     */
    @Override
    public Student findByEmail(String email) {
        log.info("Enter into findByEmail method with email: {}", email);
        TypedQuery<Student> query = sessionFactory.getCurrentSession()
                .createQuery("select s from Student as s"
                        + " where s.email = :email").setMaxResults(1);
        query.setParameter("email", email);
        List<Student> studentList = query.getResultList();
        if (studentList.isEmpty()) {
            log.warn("Student List is empty.");
            return null;
        }
        return query.getResultList().get(0);
    }

    /**
     * The method used for getting Student by userId from database
     *
     * @param userId Long userId used to find Student by it
     * @return Student
     */
    @Override
    public Student findByUserId(Long userId) {
        log.info("Enter into findByUserId method with UserId: {}", userId);
        return (Student) sessionFactory.getCurrentSession().createQuery(
                "select s from Student as s" +
                        " where s.user_id = :user_id")
                .setParameter("user_id", userId)
                .uniqueResult();
    }
}
