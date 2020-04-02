package com.softserve.service.impl;

import com.softserve.entity.Lesson;
import com.softserve.entity.enums.LessonType;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.LessonRepository;
import com.softserve.service.LessonService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Transactional
@Service
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;

    @Autowired
    public LessonServiceImpl(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    /**
     * Method gets information from Repository for particular lesson with id parameter
     * @param id Identity number of the lesson
     * @return Lesson entity
     */
    @Override
    public Lesson getById(Long id) {
        log.info("Enter into getById method with id {}", id);
        return lessonRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Lesson.class, "id", id.toString()));
    }

    /**
     * Method gets information about all lessons from Repository
     * @return List of all lessons
     */
    @Override
    public List<Lesson> getAll() {
        log.info("Enter into getAll method");
        return lessonRepository.getAll();
    }

    /**
     * Method saves new lesson to Repository and automatically assigns
     * teacher for site by teacher data if teacher for site is empty or null and
     * subject for site by subject name if subject for site is empty or null
     * @param object Lesson entity with info to be saved
     * @return saved Lesson entity
     */
    @Override
    public Lesson save(Lesson object) {
        log.info("Enter into save method with entity: {}", object );

        if (isLessonForGroupExists(object)){
            throw new EntityAlreadyExistsException("Lesson with this parameters already exists");
        }
    else {
            //Fill in teacher for site by teacher data if teacher for site is empty or null
            if (object.getTeacherForSite().isEmpty() || object.getTeacherForSite() == null) {
                object.setTeacherForSite(object.getTeacher().getSurname()
                        + " " + object.getTeacher().getName()
                        + " " + object.getTeacher().getPatronymic());
            }
            //Fill in subject for site by subject name if subject for site is empty or null
            if (object.getSubjectForSite().isEmpty() || object.getSubjectForSite() == null) {
                object.setSubjectForSite(object.getSubject().getName());
            }
            return lessonRepository.save(object);
        }
    }

    /**
     * Method updates information for an existing lesson in Repository
     * @param object Lesson entity with info to be updated
     * @return updated Lesson entity
     */
    @Override
    public Lesson update(Lesson object) {
        log.info("Enter into update method with entity: {}", object);
        if (isLessonForGroupExists(object)){
            throw new EntityAlreadyExistsException("Lesson with this parameters already exists");
        }
        else {
            return lessonRepository.update(object);
        }
    }

    /**
     * Method deletes an existing lesson from Repository
     * @param object Lesson entity to be deleted
     * @return deleted Lesson entity
     */
    @Override
    public Lesson delete(Lesson object) {
        log.info("Enter into delete method with entity: {}", object);
        return lessonRepository.delete(object);
    }

    /**
     *  Method gets information about all lessons for particular group from Repository
     * @param groupId Identity number of the group for which need to find all lessons
     * @return List of filtered lessons
     */
    @Override
    public List<Lesson> getAllForGroup(Long groupId) {
        log.info("Enter into getAllForGroup method with groupId: {}",  groupId);
        return lessonRepository.getAllForGroup(groupId);
    }

    /**
     * Method creates a list from Lesson type enum
     * @return Lesson type enum in the List
     */
    @Override
    public List<LessonType> getAllLessonTypes() {
        return Arrays.asList(LessonType.values());
    }

    /**
     * Method verifies if lesson doesn't exist in Repository
     * @param lesson Lesson entity that needs to be verified
     * @return true if such lesson already exists
     */
    @Override
    public boolean isLessonForGroupExists(Lesson lesson) {
        return lessonRepository.countLessonDuplicates(lesson) !=0;
    }
}
