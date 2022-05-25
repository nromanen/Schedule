package com.softserve.service;

import com.softserve.entity.Lesson;
import com.softserve.entity.Semester;
import com.softserve.entity.enums.LessonType;

import java.util.List;

public interface LessonService extends BasicService<Lesson, Long> {

    /**
     * Method saves new lessons to Repository.
     * Saves only lessons that did not exist in the database.
     *
     * @param lessons Lessons entities with info to be saved
     * @return saved Lessons entities
     */
    List<Lesson> save(List<Lesson> lessons);

    /**
     * Method gets information about all lessons for particular group from Repository
     *
     * @param groupId Identity number of the group for which need to find all lessons
     * @return List of filtered lessons
     */
    List<Lesson> getAllForGroup(Long groupId);

    /**
     * Method gets information about all lessons from Repository
     *
     * @return List of all lessons
     */
    List<Lesson> getLessonByTeacher(Long teacherId);

    /**
     * Method creates a list from Lesson type enum
     *
     * @return Lesson type enum in the List
     */
    List<LessonType> getAllLessonTypes();

    /**
     * Method verifies if lesson doesn't exist in Repository
     *
     * @param lesson Lesson entity that needs to be verified
     * @return true if such lesson already exists
     */
    boolean isLessonForGroupExists(Lesson lesson);

    /**
     * Method verifies if lesson doesn't exist in Repository
     *
     * @param lesson Lesson entity that needs to be verified
     * @return true if such lesson already exists
     */
    boolean isLessonForGroupExistsAndIgnoreWithId(Lesson lesson);

    /**
     * The method used for getting list of lessons from database by semesterId
     *
     * @param semesterId Semester id for getting all lessons by this id from db
     * @return list of entities Lesson
     */
    List<Lesson> getLessonsBySemester(Long semesterId);

    /**
     * Method copyLessonsFromOneToAnotherSemester save lessons in db by copy from one semester to another
     *
     * @param lessons    List<Lesson> from one semester
     * @param toSemester Semester entity for which save schedule
     * @return list of lessons for toSemester
     */
    List<Lesson> copyLessonsFromOneToAnotherSemester(List<Lesson> lessons, Semester toSemester);

    /**
     * Method saveLessonDuringCopy save lessons in db
     *
     * @param lesson Lesson entity
     * @return Lesson entity after saved in db
     */
    Lesson saveLessonDuringCopy(Lesson lesson);

    void deleteLessonBySemesterId(Long semesterId);

    /**
     * The method used for getting all lessons from database by subjectId, teacherId, semesterId and lessonType and exclude current lessonId
     *
     * @param lesson Lesson object for getting lessons from db by this param
     * @return List of Lessons
     */
    List<Lesson> getLessonsBySubjectIdTeacherIdSemesterIdLessonTypeAndExcludeCurrentLessonId(Lesson lesson);

    /**
     * The method used for getting all lessons which are grouped by lesson
     *
     * @param lesson Lesson object for getting lessons
     * @return List of Lessons
     */
    List<Lesson> getAllGroupedLessonsByLesson(Lesson lesson);

    /**
     * The method used for updating links to meeting for lessons
     *
     * @param lesson Lesson object with new link to meeting
     * @return Integer the number of links that was updated
     */
    Integer updateLinkToMeeting(Lesson lesson);
}
