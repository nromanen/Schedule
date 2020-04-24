package com.softserve.service;

import com.softserve.entity.Semester;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.exception.IncorrectTimeException;
import com.softserve.repository.SemesterRepository;
import com.softserve.service.impl.SemesterServiceImpl;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(MockitoJUnitRunner.class)
public class SemesterServiceTest {

    @Mock
    private SemesterRepository semesterRepository;

    @InjectMocks
    private SemesterServiceImpl semesterService;

    @Test
    public void getSemesterById() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));

        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));

        Semester result = semesterService.getById(1L);
        assertNotNull(result);
        assertEquals(semester.getId(), result.getId());
        verify(semesterRepository, times(1)).findById(anyLong());
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionIfSemesterNotFounded() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));

        semesterService.getById(2L);
        verify(semesterRepository, times(1)).findById(2L);
    }

    @Test
    public void saveSemesterIfSemesterDoesNotExists() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));

        when(semesterRepository.save(any(Semester.class))).thenReturn(semester);

        Semester result = semesterService.save(semester);
        assertNotNull(result);
        assertEquals(semester.getDescription(), result.getDescription());
        verify(semesterRepository, times(1)).save(semester);
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionIfFieldCurrentSemesterAlreadyExists() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        semester.setCurrentSemester(true);

        when(semesterRepository.getCurrentSemester()).thenReturn(Optional.of(semester));

        semesterService.save(semester);
    }

    @Test(expected = EntityAlreadyExistsException.class)
    public void throwEntityAlreadyExistsExceptionIfDescriptionAlreadyExists() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));

        when(semesterRepository.semesterDuplicates(semester)).thenReturn(Optional.of(semester));

        semesterService.save(semester);
    }

    @Test(expected = IncorrectTimeException.class)
    public void throwIncorrectTimeExceptionIfStartTimeBeginAfterEndTime() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 3, 10));

        semesterService.save(semester);
    }

    @Test
    public void updateIfUpdatedSemesterDoestNotExists() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        Semester updatedSemester = new Semester();
        updatedSemester.setId(1L);
        updatedSemester.setDescription("2 semester");
        updatedSemester.setStartDay(LocalDate.of(2020, 5, 11));
        updatedSemester.setEndDay(LocalDate.of(2020, 6, 22));

        when(semesterRepository.update(updatedSemester)).thenReturn(updatedSemester);

        semester = semesterService.update(updatedSemester);
        assertNotNull(semester);
        assertEquals(updatedSemester, semester);
        verify(semesterRepository, times(1)).update(semester);
    }

    @Test(expected = IncorrectTimeException.class)
    public void throwIncorrectTimeExceptionIfUpdatedStartTimeBeginAfterEndTime() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 3, 10));
        semester.setEndDay(LocalDate.of(2020, 1, 11));

        semesterService.update(semester);
    }

    @Test(expected = EntityAlreadyExistsException.class)
    public void throwEntityAlreadyExistsExceptionIfUpdatedDescriptionAlreadyExists() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setDescription("1 semester");
        semester.setYear(2020);
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        Semester anotherSemester = new Semester();
        anotherSemester.setId(2L);
        anotherSemester.setDescription("1 semester");
        anotherSemester.setYear(2020);
        anotherSemester.setStartDay(LocalDate.of(2020, 10, 1));
        anotherSemester.setEndDay(LocalDate.of(2020, 12, 15));

        when(semesterRepository.semesterDuplicates(semester)).thenReturn(Optional.of(anotherSemester));

        semesterService.update(semester);
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionIfUpdatedCurrentSemesterAlreadyExists() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("3 semester");
        semester.setStartDay(LocalDate.of(2020, 8, 10));
        semester.setEndDay(LocalDate.of(2020, 9, 10));
        semester.setCurrentSemester(true);
        Semester currentSemester = new Semester();
        currentSemester.setId(2L);
        currentSemester.setYear(2020);
        currentSemester.setDescription("1 semester");
        currentSemester.setStartDay(LocalDate.of(2020, 4, 10));
        currentSemester.setEndDay(LocalDate.of(2020, 5, 10));
        currentSemester.setCurrentSemester(true);

        when(semesterRepository.getCurrentSemester()).thenReturn(Optional.of(currentSemester));

        semesterService.update(semester);
    }
}
