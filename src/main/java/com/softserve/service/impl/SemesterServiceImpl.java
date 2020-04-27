package com.softserve.service.impl;

import com.softserve.entity.Semester;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.exception.IncorrectTimeException;
import com.softserve.repository.SemesterRepository;
import com.softserve.service.SemesterService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional
@Service
public class SemesterServiceImpl implements SemesterService {

    private final SemesterRepository semesterRepository;

    @Autowired
    public SemesterServiceImpl(SemesterRepository semesterRepository) {
        this.semesterRepository = semesterRepository;
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
        if (object.isCurrentSemester()) {
            if (getCurrentSemester() != null) {
                throw new FieldAlreadyExistsException(Semester.class, "currentSemester", String.valueOf(object.isCurrentSemester()));
            }
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
        if (object.isCurrentSemester()) {
            if (isSemesterCurrent(object.getId())) {
                throw new FieldAlreadyExistsException(Semester.class, "currentSemester", String.valueOf(object.isCurrentSemester()));
            }
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
        return semesterRepository.getCurrentSemester().orElse(null);
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
}
