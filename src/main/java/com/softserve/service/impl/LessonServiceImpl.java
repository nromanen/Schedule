package com.softserve.service.impl;

import com.softserve.entity.Lesson;
import com.softserve.entity.Semester;
import com.softserve.entity.Subject;
import com.softserve.entity.enums.LessonType;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.LessonRepository;
import com.softserve.service.LessonService;
import com.softserve.service.SemesterService;
import com.softserve.service.SubjectService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final SubjectService subjectService;
    private final SemesterService semesterService;

    @Autowired
    public LessonServiceImpl(LessonRepository lessonRepository, SubjectService subjectService, SemesterService semesterService) {
        this.lessonRepository = lessonRepository;
        this.subjectService = subjectService;
        this.semesterService = semesterService;
    }

    /**
     * Method gets information from Repository for particular lesson with id parameter
     *
     * @param id Identity number of the lesson
     * @return Lesson entity
     */
    @Override
    @Transactional(readOnly = true)
    public Lesson getById(Long id) {
        log.info("In getById(id = [{}])", id);
        Lesson lesson = lessonRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Lesson.class, "id", id.toString()));
        Hibernate.initialize(lesson.getSemester().getPeriods());
        Hibernate.initialize(lesson.getSemester().getGroups());
        return lesson;
    }

    /**
     * Method gets information about all lessons from Repository
     *
     * @return List of all lessons
     */
    @Override
    @Transactional(readOnly = true)
    @Cacheable("lessons")
    public List<Lesson> getAll() {
        log.info("In getAll()");
        List<Lesson> lessons = lessonRepository.getAll();
        lessons.forEach(e -> {
            Hibernate.initialize(e.getSemester().getPeriods());
            Hibernate.initialize(e.getSemester().getGroups());
        });
        return lessonRepository.getAll();
    }

    /**
     * Method gets information about all lessons from Repository
     *
     * @return List of all lessons
     */
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "lessons", key = "#teacherId")
    public List<Lesson> getLessonByTeacher(Long teacherId) {
        log.info("In getLessonByTeacher()");
        List<Lesson> lessons = lessonRepository.getLessonByTeacher(teacherId, semesterService.getCurrentSemester().getId());
        lessons.forEach(e -> {
            Hibernate.initialize(e.getSemester().getPeriods());
            Hibernate.initialize(e.getSemester().getGroups());
        });
        return lessons;
    }

    /**
     * Method saves new lesson to Repository and automatically assigns
     * teacher for site by teacher data if teacher for site is empty or null and
     * subject for site by subject name if subject for site is empty or null
     *
     * @param object Lesson entity with info to be saved
     * @return saved Lesson entity
     */
    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public Lesson save(Lesson object) {
        object.setSemester(semesterService.getCurrentSemester());
        log.info("In save(entity = [{}]", object);
        if (isLessonForGroupExists(object)) {
            throw new EntityAlreadyExistsException("Lesson with this parameters already exists");
        } else {
            //Fill in subject for site by subject name (from JSON) if subject for site is empty or null
            if (object.getSubjectForSite().isEmpty() || object.getSubjectForSite() == null) {
                Subject subject = subjectService.getById(object.getSubject().getId());
                object.setSubjectForSite(subject.getName());
            }
            return lessonRepository.save(object);
        }
    }

    /**
     * Method saves new lessons to Repository.
     * Saves only lessons that did not exist in the database.
     *
     * @param lessons Lessons entities with info to be saved
     * @return saved Lessons entities
     */
    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public List<Lesson> save(List<Lesson> lessons) {
        log.info("In save(lessons = [{}])", lessons);
        List<Lesson> lessonsList = new ArrayList<>();
        lessons.forEach(lesson -> {
            lessonsList.add(save(lesson));
        });
        return lessonsList;
    }

    /**
     * Method updates information for an existing lesson in Repository
     *
     * @param lesson Lesson entity with info to be updated
     * @return updated Lesson entity
     */
    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public Lesson update(Lesson lesson) {
        lesson.setSemester(semesterService.getCurrentSemester());
        log.info("In update(entity = [{}]", lesson);
        if (isLessonForGroupExistsAndIgnoreWithId(lesson)) {
            throw new EntityAlreadyExistsException("Lesson with this parameters already exists");
        }
        if (lesson.isGrouped()) {
            Lesson oldLesson = getById(lesson.getId());
            if (!oldLesson.isGrouped()) {
                lessonRepository.setGrouped(lesson.getId());
            }
            boolean isSubjectUpdated = oldLesson.getSubject().getId().longValue() != lesson.getSubject().getId().longValue();
            boolean isTeacherUpdated = oldLesson.getTeacher().getId() != lesson.getTeacher().getId();
            lesson = lessonRepository.updateGrouped(oldLesson, lesson, isSubjectUpdated || isTeacherUpdated);
        } else {
            lesson = lessonRepository.update(lesson);
        }
        return lesson;
    }

    /**
     * Method deletes an existing lesson from Repository
     *
     * @param object Lesson entity to be deleted
     * @return deleted Lesson entity
     */
    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public Lesson delete(Lesson object) {
        log.info("In delete(object = [{}])", object);
        if (object.isGrouped()) {
            return lessonRepository.deleteGrouped(object);
        }
        return lessonRepository.delete(object);

    }

    /**
     * Method gets information about all lessons for particular group from Repository
     *
     * @param groupId Identity number of the group for which need to find all lessons
     * @return List of filtered lessons
     */
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "lessons", key = "#groupId")
    public List<Lesson> getAllForGroup(Long groupId) {
        log.info("In getAllForGroup(groupId = [{}])", groupId);
        List<Lesson> lessons = lessonRepository.getAllForGroup(groupId, semesterService.getCurrentSemester().getId());
        lessons.forEach(e -> {
            Hibernate.initialize(e.getSemester().getPeriods());
            Hibernate.initialize(e.getSemester().getGroups());
        });
        return lessons;
    }

    /**
     * Method creates a list from Lesson type enum
     *
     * @return Lesson type enum in the List
     */
    @Override
    @Transactional(readOnly = true)
    public List<LessonType> getAllLessonTypes() {
        log.info("In getAllLessonTypes()");
        return Arrays.asList(LessonType.values());
    }

    /**
     * Method verifies if lesson doesn't exist in Repository
     *
     * @param lesson Lesson entity that needs to be verified
     * @return true if such lesson already exists
     */
    @Override
    @Transactional(readOnly = true)
    public boolean isLessonForGroupExists(Lesson lesson) {
        log.info("In isLessonForGroupExists(lesson = [{}])", lesson);
        return lessonRepository.countLessonDuplicates(lesson) != 0;
    }

    /**
     * Method verifies if lesson doesn't exist in Repository
     *
     * @param lesson Lesson entity that needs to be verified
     * @return true if such lesson already exists
     */
    @Override
    @Transactional(readOnly = true)
    public boolean isLessonForGroupExistsAndIgnoreWithId(Lesson lesson) {
        log.info("In isLessonForGroupExistsAndIgnoreWithId(lesson = [{}])", lesson);
        return lessonRepository.countLessonDuplicatesWithIgnoreId(lesson) != 0;
    }

    /**
     * The method used for getting list of lessons from database by semesterId
     *
     * @param semesterId Semester id for getting all lessons by this id from db
     * @return list of entities Lesson
     */
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "lessons", key = "#semesterId")
    public List<Lesson> getLessonsBySemester(Long semesterId) {
        log.info("In getLessonsBySemester(semesterId = [{}])", semesterId);
        List<Lesson> lessons = lessonRepository.getLessonsBySemester(semesterId);
        lessons.forEach(e -> {
            Hibernate.initialize(e.getSemester().getPeriods());
            Hibernate.initialize(e.getSemester().getGroups());
        });
        return lessons;
    }

    /**
     * Method copyLessonsFromOneToAnotherSemester save lessons in db by copy from one semester to another
     *
     * @param lessons    List<Lesson> from one semester
     * @param toSemester Semester entity for which save schedule
     * @return list of lessons for toSemester
     */
    @Override
    @Transactional
    public List<Lesson> copyLessonsFromOneToAnotherSemester(List<Lesson> lessons, Semester toSemester) {
        log.info("In method copyLessonsFromOneToAnotherSemester with lessons = {} and toSemester = {}", lessons, toSemester);
        List<Lesson> toLessons = new ArrayList<>();
        for (Lesson lesson : lessons) {
            lesson.setSemester(toSemester);
            toLessons.add(lessonRepository.save(lesson));
        }
        return toLessons;
    }

    /**
     * Method saveLessonDuringCopy save lessons in db
     *
     * @param lesson Lesson entity
     * @return Lesson entity after saved in db
     */
    @Override
    @Transactional
    public Lesson saveLessonDuringCopy(Lesson lesson) {
        log.info("In method saveLessonDuringCopy with lesson = {}", lesson);
        return lessonRepository.save(lesson);
    }

    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public void deleteLessonBySemesterId(Long semesterId) {
        log.info("In method deleteLessonBySemesterId with semesterId = {}", semesterId);
        lessonRepository.deleteLessonBySemesterId(semesterId);
    }

    /**
     * The method used for getting all lessons from database by subjectId, teacherId, semesterId and lessonType and exclude current lessonId
     *
     * @param lesson Lesson object for getting lessons from db by this param
     * @return List of Lessons
     */
    @Override
    @Transactional(readOnly = true)
    public List<Lesson> getLessonsBySubjectIdTeacherIdSemesterIdLessonTypeAndExcludeCurrentLessonId(Lesson lesson) {
        log.info("In getLessonsBySubjectIdTeacherIdSemesterIdLessonTypeAndExcludeCurrentLessonId(lesson = [{}]", lesson);
        List<Lesson> lessons = lessonRepository.getLessonsBySubjectIdTeacherIdSemesterIdLessonTypeAndExcludeCurrentLessonId(lesson);
        lessons.forEach(e -> {
            Hibernate.initialize(e.getSemester().getPeriods());
            Hibernate.initialize(e.getSemester().getGroups());
        });
        return lessons;
    }

    /**
     * The method used for getting all lessons which are grouped by lesson
     *
     * @param lesson Lesson object for getting lessons
     * @return List of Lessons
     */
    @Override
    @Transactional(readOnly = true)
    public List<Lesson> getAllGroupedLessonsByLesson(Lesson lesson) {
        return lessonRepository.getGroupedLessonsByLesson(lesson);
    }

    /**
     * The method used for updating links to meeting for lessons
     *
     * @param lesson Lesson object with new link to meeting
     * @return Integer the number of links that was updated
     */
    @Override
    @Transactional
    public Integer updateLinkToMeeting(Lesson lesson) {
        log.info("In service updateLinkToMeeting lesson = [{}]", lesson);
        return lessonRepository.updateLinkToMeeting(lesson);
    }
}
