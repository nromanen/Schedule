package com.softserve.repository;

import com.softserve.entity.Lesson;

import java.util.List;

public interface LessonRepository extends BasicRepository<Lesson, Long> {

    /**
     * Method gets information about all lessons for particular group from DB
     *
     * @param groupId Identity number of the group for which need to find all lessons
     * @return List of filtered lessons
     */
    List<Lesson> getAllForGroup(Long groupId, Long semesterId);

    /**
     * Method gets information  all lessons for teacher from DB
     *
     * @param teacherId Identity number of the teacher for which need to find all lessons
     * @return List of filtered lessons
     */
    List<Lesson> getLessonByTeacher(Long teacherId, Long semesterId);

    /**
     * Method searches duplicate of lesson in the DB
     *
     * @param lesson Lesson entity that needs to be verified
     * @return count of duplicates if such exist, else return 0
     */
    Long countLessonDuplicates(Lesson lesson);

    /**
     * Method searches duplicate of lesson in the DB
     *
     * @param lesson Lesson entity that needs to be verified
     * @return count of duplicates if such exist, else return 0
     */
    Long countLessonDuplicatesWithIgnoreId(Lesson lesson);

    /**
     * The method used for getting list of lessons from database by semesterId
     *
     * @param semesterId Semester id for getting all lessons by this id from db
     * @return list of entities Lesson
     */
    List<Lesson> getLessonsBySemester(Long semesterId);

    void deleteLessonBySemesterId(Long semesterId);

    /**
     * The method used for getting all lessons from database by subjectForSite, teacherForSite and semesterId
     *
     * @param lesson Lesson object for getting lessons from db by this param
     * @return List of Lessons
     */
    List<Lesson> getLessonsBySubjectIdTeacherIdSemesterIdLessonTypeAndExcludeCurrentLessonId(Lesson lesson);

    /**
     * The method used for getting all lessons from database which are grouped by lesson
     *
     * @param lesson Lesson object for getting lessons
     * @return List of Lessons
     */
    List<Lesson> getGroupedLessonsByLesson(Lesson lesson);

    /**
     * The method used for updating links to meeting for lessons.
     * By default, link to meeting is updated by semester id and teacher id
     * But update can be more specific by providing additional subject id and/or lesson type in a lesson object
     *
     * @param lesson Lesson object with new link to meeting
     * @return Integer the number of links that was updated
     */
    Integer updateLinkToMeeting(Lesson lesson);

    /**
     * Method is used to update grouped lessons
     *
     * @param updatedLesson grouped lesson that needs to be updated
     * @return updated Lesson
     */
    Lesson updateGrouped(Lesson oldLesson, Lesson updatedLesson, boolean isTeacherOrSubjectUpdated);

    /**
     * The method is used to delete all lessons grouped
     *
     * @param lesson grouped lesson which must be deleted
     * @return deleted lesson
     */
    Lesson deleteGrouped(Lesson lesson);

    int setGrouped(Long lessonId);
}
