package com.softserve.service;

import com.softserve.dto.SubjectDTO;
import com.softserve.dto.SubjectNameWithTypesDTO;
import com.softserve.dto.SubjectWithTypeDTO;
import com.softserve.entity.Subject;
import com.softserve.entity.enums.LessonType;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.mapper.SubjectMapper;
import com.softserve.repository.SubjectRepository;
import com.softserve.service.impl.SubjectServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@Tag("unit")
@ExtendWith(MockitoExtension.class)
class SubjectServiceTest {

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private SubjectMapper subjectMapper;

    @InjectMocks
    private SubjectServiceImpl subjectService;

    private Subject subject;
    private SubjectDTO subjectDTO;

    @BeforeEach
    void setUp() {
        subject = new Subject();
        subject.setId(1L);
        subject.setName("some subject");

        subjectDTO = new SubjectDTO();
        subjectDTO.setId(1L);
        subjectDTO.setName("some subject");
    }

    @Test
    void getSubjectById() {
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));
        when(subjectMapper.subjectToSubjectDTO(subject)).thenReturn(subjectDTO);

        SubjectDTO result = subjectService.getById(1L);

        assertNotNull(result);
        assertEquals(subjectDTO.getId(), result.getId());
        assertEquals(subjectDTO.getName(), result.getName());
        verify(subjectRepository, times(1)).findById(1L);
        verify(subjectMapper, times(1)).subjectToSubjectDTO(subject);
    }

    @Test
    void throwEntityNotFoundExceptionIfSubjectNotFounded() {
        when(subjectRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> subjectService.getById(2L));
        verify(subjectRepository, times(1)).findById(2L);
    }

    @Test
    void saveSubjectIfNameDoesNotExists() {
        SubjectDTO inputDTO = new SubjectDTO();
        inputDTO.setName("some subject");

        when(subjectRepository.countSubjectsWithName(anyString())).thenReturn(0L);
        when(subjectMapper.subjectDTOToSubject(inputDTO)).thenReturn(subject);
        when(subjectRepository.save(subject)).thenReturn(subject);
        when(subjectMapper.subjectToSubjectDTO(subject)).thenReturn(subjectDTO);

        SubjectDTO result = subjectService.save(inputDTO);

        assertNotNull(result);
        assertEquals(subjectDTO.getName(), result.getName());
        verify(subjectRepository, times(1)).countSubjectsWithName(anyString());
        verify(subjectMapper, times(1)).subjectDTOToSubject(inputDTO);
        verify(subjectRepository, times(1)).save(subject);
        verify(subjectMapper, times(1)).subjectToSubjectDTO(subject);
    }

    @Test
    void throwFieldAlreadyExistsExceptionIfNameAlreadyExists() {
        SubjectDTO inputDTO = new SubjectDTO();
        inputDTO.setName("some subject");

        when(subjectRepository.countSubjectsWithName(anyString())).thenReturn(1L);

        assertThrows(FieldAlreadyExistsException.class, () -> subjectService.save(inputDTO));
        verify(subjectRepository, times(1)).countSubjectsWithName(anyString());
        verify(subjectRepository, never()).save(any(Subject.class));
    }

    @Test
    void updateSubjectIfNameDoesNotExists() {
        SubjectDTO inputDTO = new SubjectDTO();
        inputDTO.setId(1L);
        inputDTO.setName("updated name");

        Subject updatedSubject = new Subject();
        updatedSubject.setId(1L);
        updatedSubject.setName("updated name");

        SubjectDTO resultDTO = new SubjectDTO();
        resultDTO.setId(1L);
        resultDTO.setName("updated name");

        when(subjectRepository.countBySubjectId(1L)).thenReturn(1L);
        when(subjectRepository.countSubjectsWithNameAndIgnoreWithId(1L, "updated name")).thenReturn(0L);
        when(subjectMapper.subjectDTOToSubject(inputDTO)).thenReturn(updatedSubject);
        when(subjectRepository.update(updatedSubject)).thenReturn(updatedSubject);
        when(subjectMapper.subjectToSubjectDTO(updatedSubject)).thenReturn(resultDTO);

        SubjectDTO result = subjectService.update(inputDTO);

        assertNotNull(result);
        assertEquals(resultDTO.getName(), result.getName());
        verify(subjectRepository, times(1)).countBySubjectId(1L);
        verify(subjectRepository, times(1)).countSubjectsWithNameAndIgnoreWithId(1L, "updated name");
        verify(subjectMapper, times(1)).subjectDTOToSubject(inputDTO);
        verify(subjectRepository, times(1)).update(updatedSubject);
        verify(subjectMapper, times(1)).subjectToSubjectDTO(updatedSubject);
    }

    @Test
    void throwFieldAlreadyExistsExceptionIfUpdatedNameAlreadyExists() {
        SubjectDTO inputDTO = new SubjectDTO();
        inputDTO.setId(1L);
        inputDTO.setName("updated name");

        when(subjectRepository.countBySubjectId(1L)).thenReturn(1L);
        when(subjectRepository.countSubjectsWithNameAndIgnoreWithId(1L, "updated name")).thenReturn(1L);

        assertThrows(FieldAlreadyExistsException.class, () -> subjectService.update(inputDTO));
        verify(subjectRepository, times(1)).countBySubjectId(1L);
        verify(subjectRepository, times(1)).countSubjectsWithNameAndIgnoreWithId(1L, "updated name");
        verify(subjectRepository, never()).update(any(Subject.class));
    }

    @Test
    void throwEntityNotFoundExceptionIfUpdatedSubjectNotFounded() {
        SubjectDTO inputDTO = new SubjectDTO();
        inputDTO.setId(1L);
        inputDTO.setName("some subject");

        when(subjectRepository.countBySubjectId(1L)).thenReturn(0L);

        assertThrows(EntityNotFoundException.class, () -> subjectService.update(inputDTO));
        verify(subjectRepository, times(1)).countBySubjectId(1L);
        verify(subjectRepository, never()).update(any(Subject.class));
    }

    @Test
    void deleteById() {
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));
        when(subjectRepository.delete(subject)).thenReturn(subject);

        subjectService.deleteById(1L);

        verify(subjectRepository, times(1)).findById(1L);
        verify(subjectRepository, times(1)).delete(subject);
    }

    @Test
    void throwEntityNotFoundExceptionIfDeletedSubjectNotFounded() {
        when(subjectRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> subjectService.deleteById(1L));
        verify(subjectRepository, times(1)).findById(1L);
        verify(subjectRepository, never()).delete(any(Subject.class));
    }

    @Test
    void getSubjectsWithTypes() {
        Subject firstSubject = new Subject();
        firstSubject.setName("Organic chemistry");
        firstSubject.setId(1L);

        Subject secondSubject = new Subject();
        secondSubject.setName("Economics");
        secondSubject.setId(2L);

        SubjectWithTypeDTO firstSubjectWithType = new SubjectWithTypeDTO(firstSubject, LessonType.LECTURE);
        SubjectWithTypeDTO secondSubjectWithType = new SubjectWithTypeDTO(secondSubject, LessonType.PRACTICAL);

        List<SubjectWithTypeDTO> subjectsWithTypes = List.of(firstSubjectWithType, secondSubjectWithType);

        SubjectNameWithTypesDTO firstResult = new SubjectNameWithTypesDTO();
        firstResult.setId(1L);
        firstResult.setName("Organic chemistry");

        SubjectNameWithTypesDTO secondResult = new SubjectNameWithTypesDTO();
        secondResult.setId(2L);
        secondResult.setName("Economics");

        List<SubjectNameWithTypesDTO> expectedResult = List.of(firstResult, secondResult);

        when(subjectRepository.getSubjectsWithTypes(1L, 3L)).thenReturn(subjectsWithTypes);
        when(subjectMapper.subjectWithTypeDTOsToSubjectNameWithTypesDTOs(subjectsWithTypes)).thenReturn(expectedResult);

        List<SubjectNameWithTypesDTO> actualResult = subjectService.getSubjectsWithTypes(1L, 3L);

        assertNotNull(actualResult);
        assertEquals(expectedResult.size(), actualResult.size());
        verify(subjectRepository, times(1)).getSubjectsWithTypes(1L, 3L);
        verify(subjectMapper, times(1)).subjectWithTypeDTOsToSubjectNameWithTypesDTOs(subjectsWithTypes);
    }

    @Test
    void getAllSubjects() {
        List<Subject> subjects = List.of(subject);
        List<SubjectDTO> expectedDTOs = List.of(subjectDTO);

        when(subjectRepository.getAll()).thenReturn(subjects);
        when(subjectMapper.subjectsToSubjectDTOs(subjects)).thenReturn(expectedDTOs);

        List<SubjectDTO> result = subjectService.getAll();

        assertNotNull(result);
        assertEquals(expectedDTOs.size(), result.size());
        verify(subjectRepository, times(1)).getAll();
        verify(subjectMapper, times(1)).subjectsToSubjectDTOs(subjects);
    }

    @Test
    void getDisabledSubjects() {
        List<Subject> subjects = List.of(subject);
        List<SubjectDTO> expectedDTOs = List.of(subjectDTO);

        when(subjectRepository.getDisabled()).thenReturn(subjects);
        when(subjectMapper.subjectsToSubjectDTOs(subjects)).thenReturn(expectedDTOs);

        List<SubjectDTO> result = subjectService.getDisabled();

        assertNotNull(result);
        assertEquals(expectedDTOs.size(), result.size());
        verify(subjectRepository, times(1)).getDisabled();
        verify(subjectMapper, times(1)).subjectsToSubjectDTOs(subjects);
    }
}
