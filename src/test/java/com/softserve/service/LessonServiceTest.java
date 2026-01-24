package com.softserve.service;

import com.softserve.dto.LessonInfoDTO;
import com.softserve.dto.LessonWithLinkDTO;
import com.softserve.dto.SemesterWithGroupsDTO;
import com.softserve.dto.SubjectDTO;
import com.softserve.entity.*;
import com.softserve.entity.enums.LessonType;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.mapper.LessonInfoMapper;
import com.softserve.repository.LessonRepository;
import com.softserve.repository.SemesterRepository;
import com.softserve.service.impl.LessonServiceImpl;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@Tag("unit")
@ExtendWith(MockitoExtension.class)
class LessonServiceTest {

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private SubjectService subjectService;

    @Mock
    private SemesterService semesterService;

    @Mock
    private SemesterRepository semesterRepository;

    @Mock
    private LessonInfoMapper lessonInfoMapper;

    @InjectMocks
    private LessonServiceImpl lessonService;

    @Test
    void getLessonById() {
        Semester semester = new Semester();
        semester.setId(4L);
        semester.setCurrentSemester(true);
        semester.setPeriods(Set.of(new Period()));
        semester.setYear(2020);
        semester.setEndDay(LocalDate.of(2020, 2, 20));
        semester.setStartDay(LocalDate.of(2020, 1, 20));

        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setHours(1);
        lesson.setLessonType(LessonType.LECTURE);
        lesson.setSubjectForSite("Human anatomy");
        lesson.setLinkToMeeting("https://softserveinc.zoom.us/j/93198369163");
        lesson.setSemester(semester);

        LessonInfoDTO expectedDTO = new LessonInfoDTO();
        expectedDTO.setId(1L);
        expectedDTO.setHours(1);
        expectedDTO.setLessonType(LessonType.LECTURE);
        expectedDTO.setSubjectForSite("Human anatomy");

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(lessonInfoMapper.lessonToLessonInfoDTO(lesson)).thenReturn(expectedDTO);

        LessonInfoDTO result = lessonService.getById(1L);

        assertNotNull(result);
        assertEquals(expectedDTO.getId(), result.getId());
        assertEquals(expectedDTO.getHours(), result.getHours());
        verify(lessonRepository, times(1)).findById(1L);
        verify(lessonInfoMapper, times(1)).lessonToLessonInfoDTO(lesson);
    }

    @Test
    void throwEntityNotFoundExceptionIfLessonNotFoundedById() {
        when(lessonRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> lessonService.getById(2L));
        verify(lessonRepository, times(1)).findById(2L);
    }

    @Test
    void saveLessonIfDuplicatesDoesNotExists() {
        Subject subject = new Subject();
        subject.setId(1L);

        Semester semester = new Semester();
        semester.setId(4L);

        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setSubject(subject);
        lesson.setSubjectForSite("");

        LessonInfoDTO inputDTO = new LessonInfoDTO();
        inputDTO.setSubjectForSite("");

        LessonInfoDTO expectedDTO = new LessonInfoDTO();
        expectedDTO.setId(1L);

        SemesterWithGroupsDTO semesterDTO = new SemesterWithGroupsDTO();
        semesterDTO.setId(4L);

        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setId(1L);
        subjectDTO.setName("Biology");

        when(lessonInfoMapper.lessonInfoDTOToLesson(inputDTO)).thenReturn(lesson);
        when(semesterService.getCurrentSemester()).thenReturn(semesterDTO);
        when(semesterRepository.findById(4L)).thenReturn(Optional.of(semester));
        when(lessonRepository.countLessonDuplicates(lesson)).thenReturn(0L);
        when(subjectService.getById(1L)).thenReturn(subjectDTO);
        when(lessonRepository.save(lesson)).thenReturn(lesson);
        when(lessonInfoMapper.lessonToLessonInfoDTO(lesson)).thenReturn(expectedDTO);

        LessonInfoDTO result = lessonService.save(inputDTO);

        assertNotNull(result);
        assertEquals(expectedDTO.getId(), result.getId());
    }

    @Test
    void throwEntityAlreadyExistsExceptionIfSaveLessonWithSameTeacherSubjectGroupLessonType() {
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setHours(1);
        lesson.setLessonType(LessonType.LECTURE);

        LessonInfoDTO inputDTO = new LessonInfoDTO();
        inputDTO.setHours(1);
        inputDTO.setLessonType(LessonType.LECTURE);

        Semester semester = new Semester();
        semester.setId(4L);
        semester.setCurrentSemester(true);

        SemesterWithGroupsDTO semesterDTO = new SemesterWithGroupsDTO();
        semesterDTO.setId(4L);
        semesterDTO.setCurrentSemester(true);

        when(lessonInfoMapper.lessonInfoDTOToLesson(inputDTO)).thenReturn(lesson);
        when(semesterService.getCurrentSemester()).thenReturn(semesterDTO);
        when(semesterRepository.findById(4L)).thenReturn(Optional.of(semester));
        when(lessonRepository.countLessonDuplicates(lesson)).thenReturn(1L);

        assertThrows(EntityAlreadyExistsException.class, () -> lessonService.save(inputDTO));

        verify(semesterService).getCurrentSemester();
        verify(semesterRepository).findById(4L);
        verify(lessonRepository).countLessonDuplicates(lesson);
        verify(lessonRepository, never()).save(any());
    }

    @Test
    void updateLessonIfItDoesNotEqualsWithExistsLessons() {
        Group group = new Group();
        group.setId(1L);
        group.setTitle("group");

        Teacher teacher = new Teacher();
        teacher.setId(10L);
        teacher.setName("Ivan");

        Subject subject = new Subject();
        subject.setId(1L);
        subject.setName("Biology");

        Semester semester = new Semester();
        semester.setId(4L);
        semester.setCurrentSemester(true);

        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setGroup(group);
        lesson.setTeacher(teacher);
        lesson.setSubject(subject);
        lesson.setSemester(semester);
        lesson.setHours(1);
        lesson.setLessonType(LessonType.LECTURE);
        lesson.setGrouped(false);

        LessonInfoDTO inputDTO = new LessonInfoDTO();
        inputDTO.setId(1L);
        inputDTO.setHours(1);
        inputDTO.setLessonType(LessonType.LECTURE);
        inputDTO.setGrouped(false);

        LessonInfoDTO expectedDTO = new LessonInfoDTO();
        expectedDTO.setId(1L);
        expectedDTO.setHours(1);
        expectedDTO.setLessonType(LessonType.LECTURE);

        SemesterWithGroupsDTO semesterDTO = new SemesterWithGroupsDTO();
        semesterDTO.setId(4L);
        semesterDTO.setCurrentSemester(true);

        when(lessonInfoMapper.lessonInfoDTOToLesson(inputDTO)).thenReturn(lesson);
        when(semesterService.getCurrentSemester()).thenReturn(semesterDTO);
        when(semesterRepository.findById(4L)).thenReturn(Optional.of(semester));
        when(lessonRepository.countLessonDuplicatesWithIgnoreId(lesson)).thenReturn(0L);
        when(lessonRepository.update(lesson)).thenReturn(lesson);
        when(lessonInfoMapper.lessonToLessonInfoDTO(lesson)).thenReturn(expectedDTO);

        LessonInfoDTO result = lessonService.update(inputDTO);

        assertNotNull(result);
        assertEquals(expectedDTO.getId(), result.getId());
        verify(semesterService).getCurrentSemester();
        verify(semesterRepository).findById(4L);
        verify(lessonRepository).countLessonDuplicatesWithIgnoreId(lesson);
        verify(lessonRepository).update(lesson);
    }

    @Test
    void throwEntityAlreadyExistsExceptionIfUpdatedLessonEqualsWithExistsLessons() {
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setHours(1);
        lesson.setLessonType(LessonType.LECTURE);

        LessonInfoDTO inputDTO = new LessonInfoDTO();
        inputDTO.setId(1L);
        inputDTO.setHours(1);
        inputDTO.setLessonType(LessonType.LECTURE);

        Semester semester = new Semester();
        semester.setId(4L);
        semester.setCurrentSemester(true);

        SemesterWithGroupsDTO semesterDTO = new SemesterWithGroupsDTO();
        semesterDTO.setId(4L);
        semesterDTO.setCurrentSemester(true);

        when(lessonInfoMapper.lessonInfoDTOToLesson(inputDTO)).thenReturn(lesson);
        when(semesterService.getCurrentSemester()).thenReturn(semesterDTO);
        when(semesterRepository.findById(4L)).thenReturn(Optional.of(semester));
        when(lessonRepository.countLessonDuplicatesWithIgnoreId(lesson)).thenReturn(1L);

        assertThrows(EntityAlreadyExistsException.class, () -> lessonService.update(inputDTO));

        verify(semesterService).getCurrentSemester();
        verify(semesterRepository).findById(4L);
        verify(lessonRepository).countLessonDuplicatesWithIgnoreId(lesson);
        verify(lessonRepository, never()).update(any());
    }

    @Test
    void updateLinkToMeeting() {
        Semester semester = new Semester();
        semester.setId(7L);

        Teacher teacher = new Teacher();
        teacher.setId(5L);

        Subject subject = new Subject();
        subject.setId(5L);

        Lesson lesson = new Lesson();
        lesson.setLinkToMeeting("https://www.youtube.com/");
        lesson.setLessonType(LessonType.LECTURE);
        lesson.setSemester(semester);
        lesson.setTeacher(teacher);
        lesson.setSubject(subject);

        LessonWithLinkDTO inputDTO = new LessonWithLinkDTO();
        inputDTO.setLinkToMeeting("https://www.youtube.com/");

        when(lessonInfoMapper.lessonWithLinkDTOToLesson(inputDTO)).thenReturn(lesson);
        when(lessonRepository.updateLinkToMeeting(lesson)).thenReturn(2);

        Integer result = lessonService.updateLinkToMeeting(inputDTO);

        assertEquals(2, result);
        verify(lessonRepository).updateLinkToMeeting(lesson);
    }
}
