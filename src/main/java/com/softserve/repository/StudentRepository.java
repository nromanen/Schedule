package com.softserve.repository;

import com.softserve.entity.Student;

public interface StudentRepository extends BasicRepository <Student, Long> {
    boolean isExistsByEmail(String email);

    boolean isExistsByEmailIgnoringId(String email, Long id);
}
