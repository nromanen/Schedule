package com.softserve.service;

import com.softserve.entity.Subject;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.SubjectRepository;
import com.softserve.service.impl.SubjectServiceImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class SubjectServiceTest {

    @Mock
    SubjectRepository subjectRepository;

    @InjectMocks
    SubjectServiceImpl subjectService;

    @Test
    public void testGetById() {
        Subject subject = new Subject();
        subject.setName("some subject");
        subject.setId(1L);

        when(subjectRepository.findById(anyLong())).thenReturn(Optional.of(subject));

        Subject result = subjectService.getById(1L);
        assertNotNull(result);
        assertEquals(subject.getId(), result.getId());
        verify(subjectRepository, times(1)).findById(anyLong());
    }

    @Test(expected = EntityNotFoundException.class)
    public void notFoundId() {
        Subject subject = new Subject();
        subject.setName("some subject");

        subjectService.getById(2L);
        verify(subjectService, times(1)).getById(2L);
    }

    @Test
    public void testSave() {
        Subject subject = new Subject();
        subject.setName("some subject");

        when(subjectRepository.save(any(Subject.class))).thenReturn(subject);
        when(subjectRepository.countSubjectsWithName(anyString())).thenReturn(0L);

        Subject result = subjectService.save(subject);
        assertNotNull(result);
        assertEquals(subject.getName(), result.getName());
        verify(subjectRepository, times(1)).save(subject);
        verify(subjectRepository, times(1)).countSubjectsWithName(anyString());
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void saveExistsName() {
        Subject subject = new Subject();
        subject.setName("some subject");

        when(subjectRepository.countSubjectsWithName(anyString())).thenReturn(1L);

        subjectService.save(subject);
        verify(subjectRepository, times(1)).save(subject);
        verify(subjectRepository, times(1)).countSubjectsWithName(anyString());
    }

    @Test
    public void testUpdate() {
        Subject oldSubject = new Subject();
        oldSubject.setName("some subject");
        oldSubject.setId(1L);
        Subject updatedSubject = new Subject();
        updatedSubject.setName("updated name");
        updatedSubject.setId(1L);

        when(subjectRepository.existsById(anyLong())).thenReturn(1L);
        when(subjectRepository.countSubjectsWithName(anyString())).thenReturn(0L);
        when(subjectRepository.update(updatedSubject)).thenReturn(updatedSubject);

        oldSubject = subjectService.update(updatedSubject);
        assertNotNull(oldSubject);
        assertEquals(updatedSubject, oldSubject);
        verify(subjectRepository, times(1)).update(oldSubject);
        verify(subjectRepository, times(1)).countSubjectsWithName(anyString());
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void updateWhenNameIsExists() {
        Subject oldSubject = new Subject();
        oldSubject.setName("some subject");
        oldSubject.setId(1L);
        Subject updatedSubject = new Subject();
        updatedSubject.setName("updated name");
        updatedSubject.setId(1L);

        when(subjectRepository.existsById(anyLong())).thenReturn(1L);
        when(subjectRepository.countSubjectsWithName(anyString())).thenReturn(1L);

        oldSubject = subjectService.update(updatedSubject);
        verify(subjectRepository, times(1)).update(oldSubject);
        verify(subjectRepository, times(1)).countSubjectsWithName(anyString());
    }

    @Test(expected = EntityNotFoundException.class)
    public void updateWhenSubjectNotFound() {
        Subject subject = new Subject();
        subject.setName("some subject");
        subject.setId(1L);

        when(subjectRepository.existsById(anyLong())).thenReturn(0L);

        subjectService.update(subject);
        verify(subjectRepository, times(1)).update(subject);
    }
}
