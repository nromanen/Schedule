package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.entity.Period;
import com.softserve.entity.Semester;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Set;

public interface SemesterService extends BasicService<Semester, Long> {

    /**
     * Method searches get of semester with currentSemester = true in the DB
     *
     * @return entity Semester if such exist, else return null
     */
    Semester getCurrentSemester();

    /**
     * The method used for getting all disabled semesters
     *
     * @return list of disabled semesters
     */
    List<Semester> getDisabled();

    /**
     * The method used to change the current semester that the Manager is working on
     *
     * @param semesterId id of the semester that needs to be current
     * @return changed Semester
     */
    Semester changeCurrentSemester(Long semesterId);

    /**
     * Method searches get of semester with defaultSemester = true in the DB
     *
     * @return entity Semester if such exist, else return null
     */
    Semester getDefaultSemester();

    /**
     * The method used to change the default semester that the Manager is working on
     *
     * @param semesterId id of the semester that needs to be current
     * @return changed Semester
     */
    Semester changeDefaultSemester(Long semesterId);

    /**
     * Method add group to an existing semester
     *
     * @param semester semester in which we need to add group
     * @param group    group to add
     * @return changed Semester
     */
    Semester addGroupToSemester(Semester semester, Group group);

    /**
     * Method add groups to an existing semester
     *
     * @param semester semester in which we need to add groups
     * @param groupIds groups to add
     * @return changed Semester
     */
    Semester addGroupsToSemester(Semester semester, List<Long> groupIds);

    /**
     * Method add daysOfWeek to an existing semester
     *
     * @param semester   semester in which we need to add daysOfWeek
     * @param daysOfWeek daysOfWeek to add
     * @return changed Semester
     */
    Semester addDaysOfWeekToSemester(Semester semester, Set<DayOfWeek> daysOfWeek);

    /**
     * Method add daysOfWeek to an existing semester
     *
     * @param semester semester in which we need to add periods
     * @param periods  periods to add
     * @return changed Semester
     */
    Semester addPeriodsToSemester(Semester semester, Set<Period> periods);

    /**
     * Method delete group from an existing semester
     *
     * @param semester semester in which we need to delete group
     * @param group    group to delete
     * @return changed Semester
     */
    Semester deleteGroupFromSemester(Semester semester, Group group);

    /**
     * Method delete groups, periods and days Of Weeks from an existing semester
     *
     * @param semester semester in which we need to delete group
     * @return changed Semester
     */
    Semester deleteAllContentFromSemester(Semester semester);

    /**
     * Method delete groups from an existing semester
     *
     * @param semester semester in which we need to delete groups
     * @param groups   groups to delete
     * @return changed Semester
     */
    Semester deleteGroupsFromSemester(Semester semester, List<Group> groups);

    /**
     * Method copy groups, periods, days Of Weeks and Schedule from one to other semester
     *
     * @param fromSemesterId id semester from which we need to copy groups, periods, days Of Weeks and Schedule
     * @param toSemesterId   id semester in which we need to copy groups, periods, days Of Weeks and Schedule
     * @return copied Semester
     */
    Semester copySemester(Long fromSemesterId, Long toSemesterId);
}
