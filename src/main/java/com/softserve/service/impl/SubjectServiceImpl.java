package com.softserve.service.impl;

import com.softserve.entity.Group;
import com.softserve.entity.Subject;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.SubjectRepository;
import com.softserve.service.SubjectService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional
@Service
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;


    @Autowired
    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    /**
     * Method gets information from Repository for particular subject with id parameter
     * @param id Identity number of the subject
     * @return Group entity
     */
    @Override
    public Subject getById(Long id) {
        log.info("Enter into getById method of {} with id {}", getClass().getName(), id);
        return subjectRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Subject.class, "id", id.toString()));
    }

    /**
     * Method gets information about all subjects from Repository
     * @return List of all subject
     */
    @Override
    public List<Subject> getAll() {
        log.info("Enter into getAll method of {} ", getClass().getName());
        return subjectRepository.getAll();
    }

    /**
     * Method saves new subject to Repository
     * @param object Subject entity to be saved
     * @return saved Subject entity
     */
    @Override
    public Subject save(Subject object) {
        log.info("Enter into save method of {} with entity:{}", getClass().getName(), object );
        return subjectRepository.save(object);
    }

    /**
     * Method updates information for an existing subject in Repository
     * @param object Subject entity with updated fields
     * @return updated Subject entity
     */
    @Override
    public Subject update(Subject object) {
        log.info("Enter into update method of {} with entity:{}", getClass().getName(), object);
        if(findByName(object.getName())){
            throw new FieldAlreadyExistsException(Subject.class, "name", object.getName());
        }
        return subjectRepository.update(object);
    }

    /**
     * Method deletes an existing subject from Repository
     * @param object Subject entity to be deleted
     * @return deleted Subject entity
     */
    @Override
    public Subject delete(Subject object) {
        log.info("Enter into delete method  of {} with entity:{}", getClass().getName(), object);
        if(findByName(object.getName())){
            throw new FieldAlreadyExistsException(Subject.class, "name", object.getName());
        }
        return subjectRepository.delete(object);
    }

    /**
     * Method finds if Subject with name already exists
     * @param name
     * @return true if Subject with such name already exist
     */
    @Override
    public boolean findByName(String name) {
        log.info("Enter into findByName method  of {} with name:{}", getClass().getName(), name);
        return subjectRepository.findByName(name).isPresent();
    }
}
