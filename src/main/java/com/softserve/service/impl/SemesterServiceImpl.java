package com.softserve.service.impl;

import com.softserve.entity.Group;
import com.softserve.entity.Semester;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.IncorrectTimeException;
import com.softserve.exception.ScheduleConflictException;
import com.softserve.repository.SemesterRepository;
import com.softserve.service.PeriodService;
import com.softserve.service.SemesterService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Slf4j
@Transactional
@Service
public class SemesterServiceImpl implements SemesterService {

    private final SemesterRepository semesterRepository;
    private final PeriodService periodService;
    private final List<DayOfWeek> workDaysList = Arrays.asList(DayOfWeek.MONDAY, DayOfWeek.TUESDAY,
            DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY);

    @Autowired
    public SemesterServiceImpl(SemesterRepository semesterRepository, PeriodService periodService) {
        this.semesterRepository = semesterRepository;
        this.periodService = periodService;
    }

    /**
     * Method gets information from Repository for particular Semester with id parameter
     *
     * @param id Identity number of the Semester
     * @return Semester entity
     */
    @Override
    public Semester getById(Long id) {
        log.info("In getById(id = [{}])", id);
        Semester semester = semesterRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Semester.class, "id", id.toString()));
        Hibernate.initialize(semester.getDaysOfWeek());
        Hibernate.initialize(semester.getPeriods());
        Hibernate.initialize(semester.getGroups());
        return semester;
    }

    /**
     * Method gets information about all semesters from Repository
     *
     * @return List of all semesters
     */
    @Override
    public List<Semester> getAll() {
        log.info("In getAll()");
        List<Semester> semesters = semesterRepository.getAll();
        for (Semester semester:semesters) {
            Hibernate.initialize(semester.getDaysOfWeek());
            Hibernate.initialize(semester.getPeriods());
            Hibernate.initialize(semester.getGroups());
        }
        return  semesters;
    }

    /**
     * Method saves new semester to Repository
     *
     * @param semester Semester entity to be saved
     * @return saved Semester entity
     */
    @Override
    public Semester save(Semester semester) {
        log.info("In save(entity = [{}]", semester);
        checkConstraints(semester);
        fillDefaultValues(semester);
        setCurrentToFalse(semester);
        setDefaultToFalse(semester);
        return semesterRepository.save(semester);
    }

    private void checkConstraints(Semester semester) {
        if (isTimeInvalid(semester)) {
            throw new IncorrectTimeException("The end day cannot be before the start day");
        }
        if (isSemesterExists(semester.getId(), semester.getDescription(), semester.getYear())) {
            throw new EntityAlreadyExistsException("Semester already exists with current description and year.");
        }
    }

    private void fillDefaultValues(Semester semester) {
        if (CollectionUtils.isEmpty(semester.getDaysOfWeek())) {
            semester.setDaysOfWeek(new HashSet<>(workDaysList));
        }
        if (CollectionUtils.isEmpty(semester.getPeriods())) {
            semester.setPeriods(new HashSet<>(periodService.getFirstFourPeriods()));
        }
    }

    /**
     * Method sets current semester in database to false while saving new current semester or updating current semester
     * @param semester Semester entity to be saved or updated
     */
    private void setCurrentToFalse(Semester semester) {
        if (semester.isCurrentSemester()) {
            semesterRepository.updateAllSemesterCurrentToFalse();
            semesterRepository.setCurrentSemester(semester.getId());
        }
    }

    /**
     * Method sets default semester in database to false while saving new default semester or updating default semester
     * @param semester Semester entity to be saved or updated
     */
    private void setDefaultToFalse(Semester semester) {
        if (semester.isDefaultSemester()) {
            semesterRepository.updateAllSemesterDefaultToFalse();
            semesterRepository.setDefaultSemester(semester.getId());
        }
    }

    /**
     * Method updates information for an existing semester in Repository
     *
     * @param semester Semester entity with updated fields
     * @return updated Semester entity
     */
    @Override
    public Semester update(Semester semester) {
        log.info("In update(entity = [{}]", semester);
        checkConstraints(semester);
        setCurrentToFalse(semester);
        setDefaultToFalse(semester);
        return semesterRepository.update(semester);
    }

    /**
     * Method deletes an existing semester from Repository
     *
     * @param object Semester entity to be deleted
     * @return deleted Semester entity
     */
    @Override
    public Semester delete(Semester object) {
        log.info("In delete(object = [{}])", object);
        return semesterRepository.delete(object);
    }


    /**
     * Method searches get of semester with currentSemester = true in the DB
     *
     * @return entity Semester if such exist, else return null
     */
    @Override
    public Semester getCurrentSemester() {
        log.info("In getCurrentSemester");
        Semester semester = semesterRepository.getCurrentSemester().orElseThrow(
                () -> new ScheduleConflictException("Current semester for managers work isn't specified"));
        Hibernate.initialize(semester.getDaysOfWeek());
        Hibernate.initialize(semester.getPeriods());
        Hibernate.initialize(semester.getGroups());
        return semester;
    }

    /**
     * Method searches get of semester with defaultSemester = true in the DB
     *
     * @return entity Semester if such exist, else return null
     */
    @Override
    public Semester getDefaultSemester() {
        log.info("In getDefaultSemester");
        Semester semester = semesterRepository.getDefaultSemester().orElseThrow(
                () -> new ScheduleConflictException("Default semester isn't specified"));
        Hibernate.initialize(semester.getDaysOfWeek());
        Hibernate.initialize(semester.getPeriods());
        Hibernate.initialize(semester.getGroups());
        return semester;
    }

    //check if the end time is not before the start time or equals return true, else - false
    private boolean isTimeInvalid(Semester object) {
        log.info("Enter into isTimeInvalid  with entity: {}", object);
        return object.getStartDay().isAfter(object.getEndDay()) ||
                object.getStartDay().equals(object.getEndDay());
    }

    private boolean isSemesterExists(long semesterId, String description, int year){
        log.info("In isSemesterExists (semesterId = [{}],description = [{}], year = [{}])", semesterId, description, year);
        Semester existingSemester = semesterRepository.getSemesterByDescriptionAndYear(description, year).orElse(null);
        if (existingSemester == null){
            return false;
        }
        return existingSemester.getId() != semesterId;
    }

    /**
     * The method used for getting all disabled semesters
     *
     * @return list of disabled semesters
     */
    @Override
    public List<Semester> getDisabled() {
        log.info("Enter into getAll of getDisabled");
        List<Semester> semesters = semesterRepository.getDisabled();
        for (Semester semester:semesters) {
            Hibernate.initialize(semester.getDaysOfWeek());
            Hibernate.initialize(semester.getPeriods());
            Hibernate.initialize(semester.getGroups());
        }
        return  semesters;
    }

    /**
     * The method used to change the current semester that the Manager is working on
     * @param semesterId id of the semester that needs to be current
     * @return changed Semester
     */
    @Override
    public Semester changeCurrentSemester(Long semesterId) {
        log.info("In changeCurrentSemester(Long semesterId = [{}])", semesterId);
        semesterRepository.updateAllSemesterCurrentToFalse();
        semesterRepository.setCurrentSemester(semesterId);
        return getById(semesterId);
    }

    /**
     * The method used to change the default semester that the Manager is working on
     * @param semesterId id of the semester that needs to be current
     * @return changed Semester
     */
    @Override
    public Semester changeDefaultSemester(Long semesterId) {
        log.info("In changeDefaultSemester(Long semesterId = [{}])", semesterId);
        semesterRepository.updateAllSemesterDefaultToFalse();
        semesterRepository.setDefaultSemester(semesterId);
        return getById(semesterId);
    }

    /**
     *
     * Method add group to an existing semester
     *
     * @param semester semester id in which we need to add group
     * @param group group to add
     * @return changed Semester
     */
    @Override
    public Semester addGroupToSemester(Semester semester, Group group) {
        log.info("In addGroupToSemester (semester = [{}], group = [{}])", semester, group);
        List<Group> groups = semester.getGroups();
        if (groups == null){
            groups = new ArrayList<>();
        }
        groups.add(group);
        semester.setGroups(groups);
        getById(semester.getId()).setGroups(groups);
        return semester;
    }

    /**
     *
     * Method add groups to an existing semester
     *
     * @param semester semester id in which we need to add groups
     * @param groups groups to add
     * @return changed Semester
     */
    @Override
    public Semester addGroupsToSemester(Semester semester, List<Group> groups) {
        log.info("In addGroupsToSemester (semester = [{}], groups = [{}])", semester, groups);
        groups.forEach(group -> addGroupToSemester(semester, group));
        return semester;
    }

    /**
     *
     * Method delete group from an existing semester
     *
     * @param semester semester id in which we need to delete group
     * @param group group to delete
     * @return changed Semester
     */
    @Override
    public Semester deleteGroupFromSemester(Semester semester, Group group) {
        log.info("In deleteGroupFromSemester (semester = [{}], group = [{}])", semester, group);
        List<Group> groups = semester.getGroups();
        if (groups == null){
            return semester;
        }
        groups.remove(group);
        update(semester);
//        semester.setGroups(groups);
//        getById(semester.getId()).setGroups(groups);
        return semester;
    }

    /**
     *
     * Method delete groups from an existing semester
     *
     * @param semester semester id in which we need to delete groups
     * @param groups group to delete
     * @return changed Semester
     */
    @Override
    public Semester deleteGroupsFromSemester(Semester semester, List<Group> groups) {
        log.info("In deleteGroupsFromSemester (semester = [{}], group = [{}])", semester, groups);
        groups.forEach(group -> deleteGroupFromSemester(semester, group));
        return semester;
    }
}
