package com.softserve.service.impl;

import com.softserve.entity.Semester;
import com.softserve.entity.Subject;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.IncorrectTimeException;
import com.softserve.repository.SemesterRepository;
import com.softserve.service.SemesterService;
import lombok.extern.slf4j.Slf4j;
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
     * @param id Identity number of the Semester
     * @return Semester entity
     */
    @Override
    public Semester getById(Long id) {
        log.info("In getById(id = [{}])",  id);
        return semesterRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Subject.class, "id", id.toString()));
    }

    /**
     * Method gets information about all semesters from Repository
     * @return List of all semesters
     */
    @Override
    public List<Semester> getAll() {
        log.info("In getAll()");
        return semesterRepository.getAll();
    }

    /**
     * Method saves new semester to Repository
     * @param object Semester entity to be saved
     * @return saved Semester entity
     */
    @Override
    public Semester save(Semester object) {
        log.info("In save(entity = [{}]", object);
        if (isTimeInvalid(object)) {
            throw new IncorrectTimeException("The end day cannot be before the start day");
        }
        return semesterRepository.save(object);
    }

    /**
     * Method updates information for an existing semester in Repository
     * @param object Semester entity with updated fields
     * @return updated Semester entity
     */
    @Override
    public Semester update(Semester object) {
        log.info("In update(entity = [{}]", object);
        if (isTimeInvalid(object)) {
            throw new IncorrectTimeException("The end day cannot be before the start day");
        }
        return semesterRepository.update(object);
    }

    /**
     * Method deletes an existing semester from Repository
     * @param object Semester entity to be deleted
     * @return deleted Semester entity
     */
    @Override
    public Semester delete(Semester object) {
        log.info("In delete(object = [{}])",  object);
        return semesterRepository.delete(object);
    }

    private boolean isTimeInvalid(Semester object) {
        log.info("Enter into isTimeInvalid  with entity: {}", object);
        return object.getStartDay().isAfter(object.getEndDay()) ||
                object.getStartDay().equals(object.getEndDay());
    }
}
