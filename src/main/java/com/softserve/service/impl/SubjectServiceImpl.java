package com.softserve.service.impl;

import com.softserve.dto.SubjectWithTypeDTO;
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
     *
     * @param id Identity number of the subject
     * @return Subject entity
     */
    @Override
    public Subject getById(Long id) {
        log.info("In getById(id = [{}])", id);
        return subjectRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Subject.class, "id", id.toString()));
    }

    /**
     * Method gets information about all subjects from Repository
     *
     * @return List of all subject
     */
    @Override
    public List<Subject> getAll() {
        log.info("In getAll()");
        return subjectRepository.getAll();
    }

    /**
     * Method saves new subject to Repository
     *
     * @param object Subject entity to be saved
     * @return saved Subject entity
     */
    @Override
    public Subject save(Subject object) {
        log.info("In save(entity = [{}]", object);
        if (isSubjectExistsWithName(object.getName())) {
            log.error("Subject with name {} already exists", object.getName());
            throw new FieldAlreadyExistsException(Subject.class, "name", object.getName());
        }
        return subjectRepository.save(object);
    }

    /**
     * Method updates information for an existing subject in Repository
     *
     * @param object Subject entity with updated fields
     * @return updated Subject entity
     */
    @Override
    public Subject update(Subject object) {
        log.info("In update(entity = [{}]", object);
        if (isExistsWithId(object.getId())) {
            if (isSubjectExistsWithNameAndIgnoreWithId(object.getId(), object.getName())) {
                log.error("Subject with name [{}] already exists", object.getName());
                throw new FieldAlreadyExistsException(Subject.class, "name", object.getName());
            }
            return subjectRepository.update(object);
        } else {
            throw new EntityNotFoundException(Group.class, "id", object.getId().toString());
        }
    }

    /**
     * Method deletes an existing subject from Repository
     *
     * @param object Subject entity to be deleted
     * @return deleted Subject entity
     */
    @Override
    public Subject delete(Subject object) {
        log.info("In delete(object = [{}])", object);
        return subjectRepository.delete(object);
    }

    /**
     * Method finds if Subject with name already exists
     *
     * @param name subject name
     * @return true if Subject with such name already exist
     */
    @Override
    public boolean isSubjectExistsWithName(String name) {
        log.info("In isSubjectExistsWithName(name = [{}])", name);
        return subjectRepository.countSubjectsWithName(name) != 0;
    }

    /**
     * Method finds if Subject with name already exists
     *
     * @param id   subject id
     * @param name subject name
     * @return true if Subject with such name already exist
     */
    @Override
    public boolean isSubjectExistsWithNameAndIgnoreWithId(Long id, String name) {
        log.info("In isSubjectExistsWithNameAndIgnoreWithId(id = [{}], name = [{}])", id, name);
        return subjectRepository.countSubjectsWithNameAndIgnoreWithId(id, name) != 0;
    }

    /**
     * Method verifies if Subject with id param exist in repository
     *
     * @param id subject id
     * @return true if Subject with id param exist
     */
    @Override
    public boolean isExistsWithId(Long id) {
        log.info("In isExistsWithId(id = [{}])", id);
        return subjectRepository.countBySubjectId(id) != 0;
    }

    /**
     * The method used for getting all disabled subjects
     *
     * @return list of disabled subjects
     */
    @Override
    public List<Subject> getDisabled() {
        log.info("Enter into getAll of getDisabled");
        return subjectRepository.getDisabled();
    }

    /**
     * The method used for getting subjects with their types from database
     *
     * @param semesterId Long semester from which subjects will be taken
     * @param teacherId  Long teacher who teaches subjects
     * @return List of subjects with their types
     */
    @Override
    public List<SubjectWithTypeDTO> getSubjectsWithTypes(Long semesterId, Long teacherId) {
        log.info("In service getSubjects(semesterId = [{}], teacherId = [{}])", semesterId, teacherId);
        return subjectRepository.getSubjectsWithTypes(semesterId, teacherId);
    }
}
