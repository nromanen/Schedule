package com.softserve.service.impl;

import com.softserve.entity.Lesson;
import com.softserve.entity.Semester;
import com.softserve.entity.Subject;
import com.softserve.entity.Teacher;
import com.softserve.entity.enums.LessonType;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.LessonRepository;
import com.softserve.service.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Transactional
@Service
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final TeacherService teacherService;
    private final SubjectService subjectService;
    private final SemesterService semesterService;

    @Autowired
    public LessonServiceImpl(LessonRepository lessonRepository, TeacherService teacherService, SubjectService subjectService, SemesterService semesterService) {
        this.lessonRepository = lessonRepository;
        this.teacherService = teacherService;
        this.subjectService = subjectService;
        this.semesterService = semesterService;
    }

    /**
     * Method gets information from Repository for particular lesson with id parameter
     * @param id Identity number of the lesson
     * @return Lesson entity
     */
    @Override
    public Lesson getById(Long id) {
        log.info("In getById(id = [{}])",  id);
        Lesson lesson = lessonRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Lesson.class, "id", id.toString()));
        Hibernate.initialize(lesson.getSemester().getPeriods());
        return lesson;
    }

    /**
     * Method gets information about all lessons from Repository
     * @return List of all lessons
     */
    @Override
    public List<Lesson> getAll() {
        log.info("In getAll()");
        return lessonRepository.getAll();
    }

    /**
     * Method gets information about all lessons from Repository
     * @return List of all lessons
     */
    @Override
    public List<Lesson> getLessonByTeacher(Long teacherId) {
        log.info("In getLessonByTeacher()");
        return lessonRepository.getLessonByTeacher(teacherId, semesterService.getCurrentSemester().getId());
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
        object.setSemester(semesterService.getCurrentSemester());
        log.info("In save(entity = [{}]", object);
        if (isLessonForGroupExists(object)){
            throw new EntityAlreadyExistsException("Lesson with this parameters already exists");
        }
    else {
            //Fill in teacher for site by teacher data (from JSON) if teacher for site is empty or null
            if (object.getTeacherForSite().isEmpty() || object.getTeacherForSite() == null) {
                Teacher teacher = teacherService.getById(object.getTeacher().getId());
                object.setTeacherForSite(
                                teacher.getSurname() + " "
                                + teacher.getName() + " "
                                + teacher.getPatronymic());
            }
            //Fill in subject for site by subject name (from JSON) if subject for site is empty or null
            if (object.getSubjectForSite().isEmpty() || object.getSubjectForSite() == null) {
                Subject subject = subjectService.getById(object.getSubject().getId());
                object.setSubjectForSite(subject.getName());
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
        object.setSemester(semesterService.getCurrentSemester());
        log.info("In update(entity = [{}]", object);
        if (isLessonForGroupExistsAndIgnoreWithId(object)){
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
        log.info("In delete(object = [{}])",  object);
        return lessonRepository.delete(object);
    }

    /**
     *  Method gets information about all lessons for particular group from Repository
     * @param groupId Identity number of the group for which need to find all lessons
     * @return List of filtered lessons
     */
    @Override
    public List<Lesson> getAllForGroup(Long groupId) {
        log.info("In getAllForGroup(groupId = [{}])",  groupId);
        return lessonRepository.getAllForGroup(groupId, semesterService.getCurrentSemester().getId());
    }

    /**
     * Method creates a list from Lesson type enum
     * @return Lesson type enum in the List
     */
    @Override
    public List<LessonType> getAllLessonTypes() {
        log.info("In getAllLessonTypes()");
        return Arrays.asList(LessonType.values());
    }

    /**
     * Method verifies if lesson doesn't exist in Repository
     * @param lesson Lesson entity that needs to be verified
     * @return true if such lesson already exists
     */
    @Override
    public boolean isLessonForGroupExists(Lesson lesson) {
        log.info("In isLessonForGroupExists(lesson = [{}])", lesson);
        return lessonRepository.countLessonDuplicates(lesson) !=0;
    }

    /**
     * Method verifies if lesson doesn't exist in Repository
     * @param lesson Lesson entity that needs to be verified
     * @return true if such lesson already exists
     */
    @Override
    public boolean isLessonForGroupExistsAndIgnoreWithId(Lesson lesson) {
        log.info("In isLessonForGroupExistsAndIgnoreWithId(lesson = [{}])", lesson);
        return lessonRepository.countLessonDuplicatesWithIgnoreId(lesson) != 0;
    }

    /*
     * The method used for getting list of lessons from database by semesterId
     *
     * @param semesterId Semester id for getting all lessons by this id from db
     * @return list of entities Lesson
     */
    @Override
    public List<Lesson> getLessonsBySemester(Long semesterId) {
        log.info("In getLessonsBySemester(semesterId = [{}])", semesterId);
        return lessonRepository.getLessonsBySemester(semesterId);
    }

    /**
     * Method copyLessonsFromOneToAnotherSemester save lessons in db by copy from one semester to another
     *
     * @param lessons  List<Lesson> from one semester
     * @param toSemester Semester entity for which save schedule
     * @return list of lessons for toSemester
     */
    @Override
    public List<Lesson> copyLessonsFromOneToAnotherSemester(List<Lesson> lessons, Semester toSemester) {
        log.info("In method copyLessonsFromOneToAnotherSemester with lessons = {} and toSemester = {}", lessons, toSemester);
        List<Lesson> toLessons = new ArrayList<>();
        for (Lesson lesson: lessons) {
            lesson.setSemester(toSemester);
            toLessons.add(lessonRepository.save(lesson));
        }
        return toLessons;
    }

    /**
     * Method saveLessonDuringCopy save lessons in db
     *
     * @param lesson  Lesson entity
     * @return Lesson entity after saved in db
     */
    @Override
    public Lesson saveLessonDuringCopy(Lesson lesson) {
        log.info("In method saveLessonDuringCopy with lesson = {}", lesson);
        return lessonRepository.save(lesson);
    }

    @Override
    public void deleteLessonBySemesterId(Long semesterId) {
        log.info("In method deleteLessonBySemesterId with semesterId = {}", semesterId);
        lessonRepository.deleteLessonBySemesterId(semesterId);
    }
}
