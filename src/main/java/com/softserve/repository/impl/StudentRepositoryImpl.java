package com.softserve.repository.impl;

import com.softserve.dto.StudentForUpdateListDTO;
import com.softserve.dto.StudentWithoutGroupDTO;
import com.softserve.entity.Student;
import com.softserve.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    private static final String FIND_BY_EMAIL = "SELECT s FROM Student s JOIN FETCH s.group WHERE s.email = :email";

    private static final String UPDATE_BY_LIST_OF_STUDENTS = "UPDATE Student s SET s.group.id = :groupId WHERE s.id IN (:studentsIdList)";

    /**
     * The method used for finding out if Student exists by email
     *
     * @param email String email used to find Student
     * @return boolean : if exists - true, else - false
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
     * @return boolean : if exists - true, else - false
     */
    @Override
    public boolean isExistsByEmailIgnoringId(String email, Long id) {
        return (boolean) sessionFactory.getCurrentSession()
                .createQuery(HQL_IS_EXISTS_BY_EMAIL_IGNORING_ID)
                .setParameter("email", email)
                .setParameter("id", id)
                .getSingleResult();
    }

    /**
     * The method used for getting Student by email from database
     * @param email String email used to find Student by it
     * @return optional student or empty object if student with provided email doesn't exist
     */
    @Override
    public Optional<Student> findByEmail(String email) {
        log.info("In findByEmail() with email: {}", email);
        return sessionFactory.getCurrentSession()
                .createQuery(FIND_BY_EMAIL, Student.class).setParameter("email", email).uniqueResultOptional();
    }

    @Override
    public void updateListStudentsByGroups(StudentForUpdateListDTO students){
        log.info("In updateListStudentsByGroups with : {}", students);
        List<Long> studentsIdList = new ArrayList<>();
        for (StudentWithoutGroupDTO studentWithoutGroupDTO : students.getStudentsWithoutGroupDTOList()) {
            studentsIdList.add(studentWithoutGroupDTO.getId());
        }

        sessionFactory.getCurrentSession().createQuery(UPDATE_BY_LIST_OF_STUDENTS ).setParameter("groupId", students.getGroupId()).setParameter("studentsIdList", studentsIdList).executeUpdate();
    }
}
