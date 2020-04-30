package com.softserve.service.impl;

import com.softserve.entity.Period;
import com.softserve.entity.Semester;
import com.softserve.exception.*;
import com.softserve.repository.SemesterRepository;
import com.softserve.service.PeriodService;
import com.softserve.service.SemesterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Transactional
@Service
public class SemesterServiceImpl implements SemesterService {

    private final SemesterRepository semesterRepository;
    private final PeriodService periodService;

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
        return semesterRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Semester.class, "id", id.toString()));
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
        return  semesters;
    }

    /**
     * Method saves new semester to Repository
     *
     * @param object Semester entity to be saved
     * @return saved Semester entity
     */
    @Override
    public Semester save(Semester object) {
        log.info("In save(entity = [{}]", object);
        if (isTimeInvalid(object)) {
            throw new IncorrectTimeException("The end day cannot be before the start day");
        }
        if (isSemesterExistsByDescriptionAndYear(object)) {
            throw new EntityAlreadyExistsException("Semester already exists with current description and year.");
        }
        if (object.getDaysOfWeek().isEmpty()){
            List<DayOfWeek> dayOfWeekList = Arrays.asList(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY);
            Set<DayOfWeek> dayOfWeekSet = new HashSet<>(dayOfWeekList);
            object.setDaysOfWeek(dayOfWeekSet);
        }
        if (object.getPeriods().isEmpty()){
            Set<Period> periodSet = new HashSet<>(periodService.getFistFourPeriods());
            object.setPeriods(periodSet);
        }
        if (object.isCurrentSemester()) {
            semesterRepository.setCurrentSemesterToFalse();
        }
        return semesterRepository.save(object);
    }

    /**
     * Method updates information for an existing semester in Repository
     *
     * @param object Semester entity with updated fields
     * @return updated Semester entity
     */
    @Override
    public Semester update(Semester object) {
        log.info("In update(entity = [{}]", object);
        if (isTimeInvalid(object)) {
            throw new IncorrectTimeException("The end day cannot be before the start day");
        }
        if (isSemesterExistsByDescriptionAndYearForUpdate(object)) {
            throw new EntityAlreadyExistsException("Semester already exists with current description and year.");
        }
        if (object.getDaysOfWeek().isEmpty()){
            List<DayOfWeek> dayOfWeekList = Arrays.asList(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY);
            Set<DayOfWeek> dayOfWeekSet = new HashSet<>(dayOfWeekList);
            object.setDaysOfWeek(dayOfWeekSet);
        }
        if (object.getPeriods().isEmpty()){
            Set<Period> periodSet = new HashSet<>(periodService.getFistFourPeriods());
            object.setPeriods(periodSet);
        }
        if (object.isCurrentSemester()) {
            semesterRepository.setCurrentSemesterToFalse();
        }
        return semesterRepository.update(object);
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
     * Method verifies if Semester doesn't exist in Repository
     *
     * @param semester Semester entity that needs to be verified
     * @return Semester if such semester already exists, else return null
     */
    @Override
    public Semester isSemesterExists(Semester semester) {
        log.info("In isSemesterExists with semester = {}", semester);
        return semesterRepository.semesterDuplicates(semester).orElse(null);
    }

    /**
     * Method searches get of semester with currentSemester = true in the DB
     *
     * @return entity Semester if such exist, else return null
     */
    @Override
    public Semester getCurrentSemester() {
        log.info("In getCurrentSemester");
        return semesterRepository.getCurrentSemester().orElseThrow(
                () -> new ScheduleConflictException("Current semester for managers work isn't specified"));
    }

    //check if the end time is not before the start time or equals return true, else - false
    private boolean isTimeInvalid(Semester object) {
        log.info("Enter into isTimeInvalid  with entity: {}", object);
        return object.getStartDay().isAfter(object.getEndDay()) ||
                object.getStartDay().equals(object.getEndDay());
    }

    //check if there is a semester with description and year return true, else - false
    private boolean isSemesterExistsByDescriptionAndYear(Semester semester) {
        log.info("In isSemesterExistsByDescriptionAndYear with semester = {}", semester);
        Semester object = isSemesterExists(semester);
        if (object == null) {
            return false;
        }
        return (object.getDescription().equals(semester.getDescription()) && object.getYear() == semester.getYear());
    }

    //check if there is a semester with description and year return true, else - false (for update method)
    private boolean isSemesterExistsByDescriptionAndYearForUpdate(Semester semester) {
        log.info("In isSemesterExistsByDescriptionAndYearForUpdate with semester = {}", semester);
        Semester object = isSemesterExists(semester);
        if (object == null) {
            return false;
        }
        return (object.getDescription().equals(semester.getDescription()) &&
                object.getYear() == semester.getYear() && object.getId() != semester.getId());
    }

    //check if semester is current return true, else - false
    private boolean isSemesterCurrent(long id) {
        log.info("In isSemesterCurrent with id = {}", id);
        Semester semester = getCurrentSemester();
        if (semester == null) {
            return false;
        }
        return semester.getId() != id;
    }


    /**
     * The method used for getting all disabled semesters
     *
     * @return list of disabled semesters
     */
    @Override
    public List<Semester> getDisabled() {
        log.info("Enter into getAll of getDisabled");
        return semesterRepository.getDisabled();
    }

    @Override
    public Semester changeCurrentSemester(Long semesterId) {
        log.info("In changeCurrentSemester(Long semesterId = [{}])", semesterId);
        semesterRepository.setCurrentSemesterToFalse();
        semesterRepository.setCurrentSemester(semesterId);
        return getById(semesterId);
    }
}
