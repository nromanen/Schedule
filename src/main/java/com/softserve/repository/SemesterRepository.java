package com.softserve.repository;

import com.softserve.entity.Period;
import com.softserve.entity.Semester;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface SemesterRepository extends BasicRepository<Semester, Long> {

    /**
     * Method gets count of semesters with provided description and year
     *
     * @param description searched description
     * @param year        searched year
     * @return count of semesters
     */
    Long countSemesterDuplicatesByDescriptionAndYear(String description, int year);

    /**
     * Method searches get of semester with currentSemester = true in the DB
     *
     * @return Optional with Semester if such exist, else return empty Optional
     */
    Optional<Semester> getCurrentSemester();

    /**
     * Method gets Semester object with provided description and year
     *
     * @param description searched description
     * @param year        searched year
     * @return Semester if such exists, else null
     */
    Optional<Semester> getSemesterByDescriptionAndYear(String description, int year);

    List<Semester> getDisabled();

    /**
     * Method sets value current semester to false fo all entities which have it true
     *
     * @return number of updated rows
     */
    int updateAllSemesterCurrentToFalse();

    /**
     * Method sets the value current semester true for semester with id
     *
     * @param semesterId id of the semester
     * @return number of updated rows
     */
    int setCurrentSemester(Long semesterId);

    /**
     * Method searches get of semester with defaultSemester = true in the DB
     *
     * @return Optional with Semester if such exist, else return empty Optional
     */
    Optional<Semester> getDefaultSemester();

    /**
     * Method sets value default semester to false fo all entities which have it true
     *
     * @return number of updated rows
     */
    int updateAllSemesterDefaultToFalse();

    /**
     * Method sets the value default semester true for semester with id
     *
     * @param semesterId id of the semester
     * @return number of updated rows
     */
    int setDefaultSemester(Long semesterId);

    /**
     * The method used for getting unique days with lessons in the semester
     *
     * @param semesterId id of the semester
     * @return a list of days
     */
    List<DayOfWeek> getDaysWithLessonsBySemesterId(Long semesterId);

    /**
     * The method used for getting periods with lessons in the semester
     *
     * @param semesterId id of the semester
     * @return a list of periods
     */
    List<Period> getPeriodsWithLessonsBySemesterId(Long semesterId);
}
