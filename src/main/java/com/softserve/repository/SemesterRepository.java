package com.softserve.repository;

import com.softserve.entity.Semester;

import java.util.List;
import java.util.Optional;

public interface SemesterRepository extends BasicRepository<Semester, Long> {
    Long semesterDuplicates(String description, int year);
    Optional<Semester> getCurrentSemester();
    List<Semester> getDisabled();
    int setCurrentSemesterToFalse();
    int setCurrentSemester(Long semesterId);
}
