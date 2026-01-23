package com.softserve.service;

import com.softserve.dto.LessonDTO;
import com.softserve.dto.LessonInfoDTO;
import com.softserve.entity.Lesson;
import com.softserve.entity.enums.LessonType;

import java.util.List;

public interface LessonService {

    /**
     * Returns all lessons grouped with the given lesson.
     * For internal service use only.
     *
     * @param lesson the lesson entity
     * @return the list of grouped lessons
     */
    List<Lesson> getAllGroupedLessonsByLesson(Lesson lesson);

    /**
     * Retrieves a lesson by the given id.
     *
     * @param id the id of the lesson
     * @return the lesson DTO with the given id
     */
    LessonInfoDTO getById(Long id);

    /**
     * Returns all lessons.
     *
     * @return the list of lesson DTOs
     */
    List<LessonInfoDTO> getAll();

    /**
     * Saves new lesson.
     *
     * @param lessonInfoDTO the lesson DTO to be saved
     * @return the saved lesson DTO
     */
    LessonInfoDTO save(LessonInfoDTO lessonInfoDTO);

    /**
     * Saves new lessons from the given list.
     *
     * @param lessons the list of the lesson DTOs
     * @return the list of the saved lesson DTOs
     */
    List<LessonInfoDTO> saveAll(List<LessonInfoDTO> lessons);

    /**
     * Updates existing lesson.
     *
     * @param lessonInfoDTO the lesson DTO to be updated
     * @return the updated lesson DTO
     */
    LessonInfoDTO update(LessonInfoDTO lessonInfoDTO);

    /**
     * Deletes lesson by id.
     *
     * @param id the id of the lesson to be deleted
     */
    void delete(Long id);

    /**
     * Returns all lessons for the given group id.
     *
     * @param groupId the id of the group
     * @return the list of lesson DTOs with the given group id
     */
    List<LessonInfoDTO> getAllForGroup(Long groupId);

    /**
     * Returns all lessons for the given teacher id.
     *
     * @param teacherId the id of the teacher
     * @return the list of lesson DTOs with the given teacher id
     */
    List<LessonInfoDTO> getByTeacher(Long teacherId);

    /**
     * Returns all lesson types.
     *
     * @return the list of lesson types
     */
    List<LessonType> getAllLessonTypes();

    /**
     * Returns all lessons for the given semester id.
     *
     * @param semesterId the id of the semester
     * @return the list of lesson DTOs
     */
    List<LessonInfoDTO> getBySemester(Long semesterId);

    /**
     * Copies lessons from one semester to another.
     *
     * @param fromSemesterId the source semester id
     * @param toSemesterId the target semester id
     * @return the list of copied lesson DTOs
     */
    List<LessonDTO> copyLessonsToSemester(Long fromSemesterId, Long toSemesterId);

    /**
     * Copies lesson for several groups.
     *
     * @param lessonId the lesson id to copy
     * @param groupIds the list of group ids
     * @return the list of copied lesson DTOs
     */
    List<LessonInfoDTO> copyLessonForGroups(Long lessonId, List<Long> groupIds);

    /**
     * Deletes all lessons by semester id.
     *
     * @param semesterId the id of the semester
     */
    void deleteBySemesterId(Long semesterId);


    /**
     * Updates link to meeting for lesson.
     *
     * @param lessonWithLinkDTO the lesson with new link
     * @return the number of updated links
     */
    Integer updateLinkToMeeting(com.softserve.dto.LessonWithLinkDTO lessonWithLinkDTO);
}
