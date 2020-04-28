package com.softserve.repository;

import com.softserve.entity.Subject;
import java.util.List;

public interface SubjectRepository extends BasicRepository<Subject, Long> {
    Long countSubjectsWithName(String name);
    Long countBySubjectId(Long id);
    List<Subject> getDisabled();

}
