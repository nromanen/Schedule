package com.softserve.repository;

import com.softserve.dto.StudentForUpdateListDTO;
import com.softserve.entity.Student;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends BasicRepository <Student, Long> {
    boolean isExistsByEmail(String email);

    boolean isExistsByEmailIgnoringId(String email, Long id);

    Optional<Student> findByEmail(String email);

    void updateListStudentsByGroups(StudentForUpdateListDTO students);
}
