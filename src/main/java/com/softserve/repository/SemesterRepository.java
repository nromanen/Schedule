package com.softserve.repository;

import com.softserve.entity.Semester;

import java.util.List;
import java.util.Optional;

public interface SemesterRepository extends BasicRepository<Semester, Long> {
    Long countSemesterDuplicatesByDescriptionAndYear(String description, int year);
    Optional<Semester> getCurrentSemester();
    Optional<Semester> getSemesterByDescriptionAndYear(String description, int year);
    List<Semester> getDisabled();
    int setCurrentSemesterToFalse();
    int setCurrentSemester(Long semesterId);
}
