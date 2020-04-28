package com.softserve.repository;

import com.softserve.entity.Semester;

import java.util.List;
import java.util.Optional;

public interface SemesterRepository extends BasicRepository<Semester, Long> {
    Optional<Semester> semesterDuplicates(Semester semester);
    Optional<Semester> getCurrentSemester();
    List<Semester> getDisabled();
}
