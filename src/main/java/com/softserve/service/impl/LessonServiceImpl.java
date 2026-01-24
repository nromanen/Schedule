package com.softserve.service.impl;

import com.softserve.dto.*;
import com.softserve.entity.Lesson;
import com.softserve.entity.Semester;
import com.softserve.entity.enums.LessonType;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.mapper.LessonInfoMapper;
import com.softserve.repository.LessonRepository;
import com.softserve.repository.SemesterRepository;
import com.softserve.service.GroupService;
import com.softserve.service.LessonService;
import com.softserve.service.SemesterService;
import com.softserve.service.SubjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final SubjectService subjectService;
    private final SemesterService semesterService;
    private final SemesterRepository semesterRepository;
    private final LessonInfoMapper lessonInfoMapper;
    private final GroupService groupService;

    @Override
    @Transactional(readOnly = true)
    public LessonInfoDTO getById(Long id) {
        log.info("In getById(id = [{}])", id);
        Lesson lesson = findLessonById(id);
        return lessonInfoMapper.lessonToLessonInfoDTO(lesson);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Lesson> getAllGroupedLessonsByLesson(Lesson lesson) {
        log.info("In getGroupedLessonsByLesson(lesson = [{}])", lesson);
        return lessonRepository.getGroupedLessonsByLesson(lesson);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("lessons")
    public List<LessonInfoDTO> getAll() {
        log.info("In getAll()");
        List<Lesson> lessons = lessonRepository.getAll();
        return lessonInfoMapper.lessonsToLessonInfoDTOs(lessons);
    }

    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public LessonInfoDTO save(LessonInfoDTO lessonInfoDTO) {
        log.info("In save(lessonInfoDTO = [{}])", lessonInfoDTO);
        Lesson lesson = lessonInfoMapper.lessonInfoDTOToLesson(lessonInfoDTO);
        Lesson savedLesson = saveLesson(lesson);
        return lessonInfoMapper.lessonToLessonInfoDTO(savedLesson);
    }

    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public List<LessonInfoDTO> saveAll(List<LessonInfoDTO> lessonDTOs) {
        log.info("In saveAll(lessons = [{}])", lessonDTOs);
        List<LessonInfoDTO> savedLessons = new ArrayList<>();
        for (LessonInfoDTO dto : lessonDTOs) {
            savedLessons.add(save(dto));
        }
        return savedLessons;
    }

    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public LessonInfoDTO update(LessonInfoDTO lessonInfoDTO) {
        log.info("In update(lessonInfoDTO = [{}])", lessonInfoDTO);
        Lesson lesson = lessonInfoMapper.lessonInfoDTOToLesson(lessonInfoDTO);
        Lesson updatedLesson = updateLesson(lesson);
        return lessonInfoMapper.lessonToLessonInfoDTO(updatedLesson);
    }

    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public void delete(Long id) {
        log.info("In delete(id = [{}])", id);
        Lesson lesson = findLessonById(id);
        if (lesson.isGrouped()) {
            lessonRepository.deleteGrouped(lesson);
        } else {
            lessonRepository.delete(lesson);
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "lessons", key = "'group-' + #groupId")
    public List<LessonInfoDTO> getAllForGroup(Long groupId) {
        log.info("In getAllForGroup(groupId = [{}])", groupId);

        SemesterWithGroupsDTO semester = semesterService.getCurrentSemester();
        log.info("Current semester id: {}", semester != null ? semester.getId() : "NULL");

        List<Lesson> lessons = lessonRepository.getAllForGroup(groupId, semester.getId());
        log.info("Found lessons: {}", lessons.size());

        return lessonInfoMapper.lessonsToLessonInfoDTOs(lessons);
    }
//    public List<LessonInfoDTO> getAllForGroup(Long groupId) {
//        log.info("In getAllForGroup(groupId = [{}])", groupId);
//        List<Lesson> lessons = lessonRepository.getAllForGroup(
//                groupId, semesterService.getCurrentSemester().getId());
//        return lessonInfoMapper.lessonsToLessonInfoDTOs(lessons);
//    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "lessons", key = "'teacher-' + #teacherId")
    public List<LessonInfoDTO> getByTeacher(Long teacherId) {
        log.info("In getByTeacher(teacherId = [{}])", teacherId);
        List<Lesson> lessons = lessonRepository.getLessonByTeacher(
                teacherId, semesterService.getCurrentSemester().getId());
        return lessonInfoMapper.lessonsToLessonInfoDTOs(lessons);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonType> getAllLessonTypes() {
        log.info("In getAllLessonTypes()");
        return Arrays.asList(LessonType.values());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "lessons", key = "'semester-' + #semesterId")
    public List<LessonInfoDTO> getBySemester(Long semesterId) {
        log.info("In getBySemester(semesterId = [{}])", semesterId);
        List<Lesson> lessons = lessonRepository.getLessonsBySemester(semesterId);
        return lessonInfoMapper.lessonsToLessonInfoDTOs(lessons);
    }

    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public List<LessonDTO> copyLessonsToSemester(Long fromSemesterId, Long toSemesterId) {
        log.info("In copyLessonsToSemester(from = [{}], to = [{}])", fromSemesterId, toSemesterId);
        Semester toSemester = semesterRepository.findById(toSemesterId)
                .orElseThrow(() -> new EntityNotFoundException(
                        Semester.class, "id", toSemesterId.toString()));

        List<Lesson> lessons = lessonRepository.getLessonsBySemester(fromSemesterId);
        List<Lesson> savedLessons = new ArrayList<>();

        for (Lesson lesson : lessons) {
            lesson.setSemester(toSemester);
            savedLessons.add(lessonRepository.save(lesson));
        }
        return lessonInfoMapper.lessonsToLessonDTOs(savedLessons);
    }

    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public List<LessonInfoDTO> copyLessonForGroups(Long lessonId, List<Long> groupIds) {
        log.info("In copyLessonForGroups(lessonId = [{}], groupIds = [{}])", lessonId, groupIds);
        Lesson lesson = findLessonById(lessonId);
        List<Lesson> savedLessons = new ArrayList<>();

        for (Long groupId : groupIds) {
            if (groupService.isExistsById(groupId)) {
                lesson.setGroup(groupService.getGroupEntityById(groupId));
                savedLessons.add(lessonRepository.save(lesson));
            }
        }
        return lessonInfoMapper.lessonsToLessonInfoDTOs(savedLessons);
    }

    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public void deleteBySemesterId(Long semesterId) {
        log.info("In deleteBySemesterId(semesterId = [{}])", semesterId);
        lessonRepository.deleteLessonsBySemesterId(semesterId);
    }

    @Override
    @Transactional
    @CacheEvict(value = "lessons", allEntries = true)
    public Integer updateLinkToMeeting(LessonWithLinkDTO lessonWithLinkDTO) {
        log.info("In updateLinkToMeeting(lessonWithLinkDTO = [{}])", lessonWithLinkDTO);
        Lesson lesson = lessonInfoMapper.lessonWithLinkDTOToLesson(lessonWithLinkDTO);
        return lessonRepository.updateLinkToMeeting(lesson);
    }

    // Private helper methods

    private Lesson findLessonById(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Lesson.class, "id", id.toString()));
    }

    private Lesson saveLesson(Lesson lesson) {
        SemesterWithGroupsDTO currentSemesterDTO = semesterService.getCurrentSemester();
        Semester currentSemester = semesterRepository.findById(currentSemesterDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException(
                        Semester.class, "id", currentSemesterDTO.getId().toString()));

        lesson.setSemester(currentSemester);

        if (lessonRepository.countLessonDuplicates(lesson) != 0) {
            throw new EntityAlreadyExistsException("Lesson with this parameters already exists");
        }

        if (lesson.getSubjectForSite() == null || lesson.getSubjectForSite().isEmpty()) {
            SubjectDTO subject = subjectService.getById(lesson.getSubject().getId());
            lesson.setSubjectForSite(subject.getName());
        }

        return lessonRepository.save(lesson);
    }

    private Lesson updateLesson(Lesson lesson) {
        SemesterWithGroupsDTO currentSemesterDTO = semesterService.getCurrentSemester();
        Semester currentSemester = semesterRepository.findById(currentSemesterDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException(
                        Semester.class, "id", currentSemesterDTO.getId().toString()));

        lesson.setSemester(currentSemester);

        if (lessonRepository.countLessonDuplicatesWithIgnoreId(lesson) != 0) {
            throw new EntityAlreadyExistsException("Lesson with this parameters already exists");
        }

        if (lesson.isGrouped()) {
            Lesson oldLesson = findLessonById(lesson.getId());
            if (!oldLesson.isGrouped()) {
                lessonRepository.setGrouped(lesson.getId());
            }
            boolean isSubjectUpdated = !oldLesson.getSubject().getId()
                    .equals(lesson.getSubject().getId());
            boolean isTeacherUpdated = !oldLesson.getTeacher().getId()
                    .equals(lesson.getTeacher().getId());
            return lessonRepository.updateGrouped(oldLesson, lesson, isSubjectUpdated || isTeacherUpdated);
        }

        return lessonRepository.update(lesson);
    }
}
