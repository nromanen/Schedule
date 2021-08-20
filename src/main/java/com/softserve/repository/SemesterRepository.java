package com.softserve.repository;

import com.softserve.entity.Period;
import com.softserve.entity.Semester;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface SemesterRepository extends BasicRepository<Semester, Long> {
    Long countSemesterDuplicatesByDescriptionAndYear(String description, int year);
    Optional<Semester> getCurrentSemester();
    Optional<Semester> getSemesterByDescriptionAndYear(String description, int year);
    List<Semester> getDisabled();
    int updateAllSemesterCurrentToFalse();
    int setCurrentSemester(Long semesterId);
    Optional<Semester> getDefaultSemester();
    int updateAllSemesterDefaultToFalse();
    int setDefaultSemester(Long semesterId);
    List<DayOfWeek> getDaysWithLessonsBySemesterId(Long semesterId);
    List<Period> getPeriodsWithLessonsBySemesterId(Long semesterId);
}
