package com.softserve.repository;

import com.softserve.entity.Semester;

import java.util.Optional;

public interface SemesterRepository extends BasicRepository<Semester, Long> {
    Optional<Semester> semesterDuplicates(Semester semester);
}
