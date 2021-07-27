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

    private static final String GET_ALL_QUERY = "from Student s order by s.surname ASC";
    private static final String FIND_BY_EMAIL = "from Student s where s.email = :email";
    private static final String FIND_BY_USER_ID = "from Student s where s.user_id = :user_id";

    /**
     * Modified GetAll method used for getting list of Student entities by surname ascending from database
     *
     * @return list of entities ordered by surname
     */
    @Override
    public List<Student> getAll() {
        log.info("In getAll()");
        return sessionFactory.getCurrentSession().createQuery(GET_ALL_QUERY).getResultList();
    }

    /**
     * The method used for getting Student by email from database
     *
     * @param email String email used to find Student by it
     * @return Student
     */
    @Override
    public Student findByEmail(String email) {
        log.info("In findByEmail() with email: {}", email);
        TypedQuery<Student> query = sessionFactory.getCurrentSession()
                .createQuery(FIND_BY_EMAIL).setMaxResults(1);
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
        log.info("In findByUserId() with UserId: {}", userId);
        return (Student) sessionFactory.getCurrentSession().createQuery(FIND_BY_USER_ID)
                .setParameter("user_id", userId)
                .uniqueResult();
    }
}
