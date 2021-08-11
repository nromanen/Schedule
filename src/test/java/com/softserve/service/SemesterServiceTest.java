package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.entity.Period;
import com.softserve.entity.Semester;
import com.softserve.exception.*;
import com.softserve.repository.SemesterRepository;
import com.softserve.service.impl.SemesterServiceImpl;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;

import static org.junit.Assert.*;
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
        Set<DayOfWeek> dayOfWeeks = new HashSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.TUESDAY);
        semester.setDaysOfWeek(dayOfWeeks);
        Period firstClasses = new Period();
        firstClasses.setName("1 para");
        Period secondClasses = new Period();
        secondClasses.setName("2 para");
        Period thirdClasses = new Period();
        thirdClasses.setName("3 para");
        Period fourthClasses = new Period();
        fourthClasses.setName("4 para");
        Set<Period> periodSet = new HashSet<>();
        periodSet.add(firstClasses);
        periodSet.add(secondClasses);
        periodSet.add(thirdClasses);
        periodSet.add(fourthClasses);
        semester.setPeriods(periodSet);

        when(semesterRepository.save(any(Semester.class))).thenReturn(semester);

        Semester result = semesterService.save(semester);
        assertNotNull(result);
        assertEquals(semester.getDescription(), result.getDescription());
        verify(semesterRepository, times(1)).save(semester);
    }

    @Test
    public void saveSemesterAndSetItAsCurrent() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setCurrentSemester(true);
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        Set<DayOfWeek> dayOfWeeks = new HashSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.TUESDAY);
        semester.setDaysOfWeek(dayOfWeeks);
        Period firstClasses = new Period();
        firstClasses.setName("1 para");
        Period secondClasses = new Period();
        secondClasses.setName("2 para");
        Period thirdClasses = new Period();
        thirdClasses.setName("3 para");
        Period fourthClasses = new Period();
        fourthClasses.setName("4 para");
        Set<Period> periodSet = new HashSet<>();
        periodSet.add(firstClasses);
        periodSet.add(secondClasses);
        periodSet.add(thirdClasses);
        periodSet.add(fourthClasses);
        semester.setPeriods(periodSet);

        when(semesterRepository.save(any(Semester.class))).thenReturn(semester);

        Semester result = semesterService.save(semester);
        assertNotNull(result);
        assertEquals(semester.getDescription(), result.getDescription());
        verify(semesterRepository, times(1)).save(semester);
        verify(semesterRepository, times(1)).updateAllSemesterCurrentToFalse();
    }

    @Test
    public void saveSemesterAndSetItAsDefault() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setDefaultSemester(true);
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        Set<DayOfWeek> dayOfWeeks = new HashSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.TUESDAY);
        semester.setDaysOfWeek(dayOfWeeks);
        Period firstClasses = new Period();
        firstClasses.setName("1 para");
        Period secondClasses = new Period();
        secondClasses.setName("2 para");
        Period thirdClasses = new Period();
        thirdClasses.setName("3 para");
        Period fourthClasses = new Period();
        fourthClasses.setName("4 para");
        Set<Period> periodSet = new HashSet<>();
        periodSet.add(firstClasses);
        periodSet.add(secondClasses);
        periodSet.add(thirdClasses);
        periodSet.add(fourthClasses);
        semester.setPeriods(periodSet);

        when(semesterRepository.save(any(Semester.class))).thenReturn(semester);

        Semester result = semesterService.save(semester);
        assertNotNull(result);
        assertEquals(semester.getDescription(), result.getDescription());
        verify(semesterRepository, times(1)).save(semester);
        verify(semesterRepository, times(1)).updateAllSemesterDefaultToFalse();
    }

    @Test(expected = EntityAlreadyExistsException.class)
    public void throwEntityAlreadyExistsExceptionIfDescriptionAlreadyExists() {
        Semester semesterInDatabase = new Semester();
        semesterInDatabase.setId(1L);
        semesterInDatabase.setDescription("1 semester");
        semesterInDatabase.setYear(2020);
        semesterInDatabase.setStartDay(LocalDate.of(2020, 4, 10));
        semesterInDatabase.setEndDay(LocalDate.of(2020, 5, 10));

        Semester newSemester = new Semester();
        newSemester.setId(0);
        newSemester.setDescription("1 semester");
        newSemester.setYear(2020);
        newSemester.setStartDay(LocalDate.of(2020, 4, 10));
        newSemester.setEndDay(LocalDate.of(2020, 5, 10));

        when(semesterRepository.getSemesterByDescriptionAndYear(newSemester.getDescription(), newSemester.getYear())).thenReturn(Optional.of(semesterInDatabase));

        semesterService.save(newSemester);
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
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        Set<DayOfWeek> dayOfWeeks = new HashSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.TUESDAY);
        semester.setDaysOfWeek(dayOfWeeks);
        Period firstClasses = new Period();
        firstClasses.setName("1 para");
        Period secondClasses = new Period();
        secondClasses.setName("2 para");
        Period thirdClasses = new Period();
        thirdClasses.setName("3 para");
        Period fourthClasses = new Period();
        fourthClasses.setName("4 para");
        Set<Period> periodSet = new HashSet<>();
        periodSet.add(firstClasses);
        periodSet.add(secondClasses);
        periodSet.add(thirdClasses);
        periodSet.add(fourthClasses);
        semester.setPeriods(periodSet);
        Semester updatedSemester = new Semester();
        updatedSemester.setId(1L);
        updatedSemester.setDescription("2 semester");
        updatedSemester.setStartDay(LocalDate.of(2020, 5, 11));
        updatedSemester.setEndDay(LocalDate.of(2020, 6, 22));
        updatedSemester.setPeriods(semester.getPeriods());
        updatedSemester.setDaysOfWeek(semester.getDaysOfWeek());

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
        Set<DayOfWeek> dayOfWeeks = new HashSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.TUESDAY);
        semester.setDaysOfWeek(dayOfWeeks);
        Period firstClasses = new Period();
        firstClasses.setName("1 para");
        Period secondClasses = new Period();
        secondClasses.setName("2 para");
        Period thirdClasses = new Period();
        thirdClasses.setName("3 para");
        Period fourthClasses = new Period();
        fourthClasses.setName("4 para");
        Set<Period> periodSet = new HashSet<>();
        periodSet.add(firstClasses);
        periodSet.add(secondClasses);
        periodSet.add(thirdClasses);
        periodSet.add(fourthClasses);
        semester.setPeriods(periodSet);
        Semester anotherSemester = new Semester();
        anotherSemester.setId(2L);
        anotherSemester.setDescription("1 semester");
        anotherSemester.setYear(2020);
        anotherSemester.setStartDay(LocalDate.of(2020, 10, 1));
        anotherSemester.setEndDay(LocalDate.of(2020, 12, 15));

        when(semesterRepository.getSemesterByDescriptionAndYear(semester.getDescription(),semester.getYear())).thenReturn(Optional.of(anotherSemester));

        semesterService.update(semester);
    }

    @Test(expected = UsedEntityException.class)
    public void throwEntityUsedEntityExceptionIfDaysHasLessons() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setDescription("1 semester");
        semester.setYear(2020);
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        Set<DayOfWeek> dayOfWeeks = new HashSet<>();
        dayOfWeeks.add(DayOfWeek.TUESDAY);
        dayOfWeeks.add(DayOfWeek.WEDNESDAY);
        semester.setDaysOfWeek(dayOfWeeks);
        Period firstClasses = new Period();
        firstClasses.setName("1 para");
        Period secondClasses = new Period();
        secondClasses.setName("2 para");
        Period thirdClasses = new Period();
        thirdClasses.setName("3 para");
        Period fourthClasses = new Period();
        fourthClasses.setName("4 para");
        Set<Period> periodSet = new HashSet<>();
        periodSet.add(firstClasses);
        periodSet.add(secondClasses);
        periodSet.add(thirdClasses);
        periodSet.add(fourthClasses);
        semester.setPeriods(periodSet);

        List<DayOfWeek> daysWithLessonsInSchedule = Arrays.asList(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY);

        when(semesterRepository.getDaysWithLessonsBySemesterId(semester.getId())).thenReturn(daysWithLessonsInSchedule);

        semesterService.update(semester);
    }

    @Test
    public void updateSemesterAndSetItAsCurrent() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        Set<DayOfWeek> dayOfWeeks = new HashSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.TUESDAY);
        semester.setDaysOfWeek(dayOfWeeks);
        Period firstClasses = new Period();
        firstClasses.setName("1 para");
        Period secondClasses = new Period();
        secondClasses.setName("2 para");
        Period thirdClasses = new Period();
        thirdClasses.setName("3 para");
        Period fourthClasses = new Period();
        fourthClasses.setName("4 para");
        Set<Period> periodSet = new HashSet<>();
        periodSet.add(firstClasses);
        periodSet.add(secondClasses);
        periodSet.add(thirdClasses);
        periodSet.add(fourthClasses);
        semester.setPeriods(periodSet);
        Semester updatedSemester = new Semester();
        updatedSemester.setId(1L);
        updatedSemester.setDescription("2 semester");
        updatedSemester.setCurrentSemester(true);
        updatedSemester.setStartDay(LocalDate.of(2020, 5, 11));
        updatedSemester.setEndDay(LocalDate.of(2020, 6, 22));
        updatedSemester.setDaysOfWeek(semester.getDaysOfWeek());
        updatedSemester.setPeriods(semester.getPeriods());

        when(semesterRepository.update(updatedSemester)).thenReturn(updatedSemester);

        semester = semesterService.update(updatedSemester);
        assertNotNull(semester);
        assertEquals(updatedSemester, semester);
        verify(semesterRepository, times(1)).update(semester);
        verify(semesterRepository, times(1)).updateAllSemesterCurrentToFalse();
    }

    @Test
    public void updateSemesterAndSetItAsDefault() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        Set<DayOfWeek> dayOfWeeks = new HashSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.TUESDAY);
        semester.setDaysOfWeek(dayOfWeeks);
        Period firstClasses = new Period();
        firstClasses.setName("1 para");
        Period secondClasses = new Period();
        secondClasses.setName("2 para");
        Period thirdClasses = new Period();
        thirdClasses.setName("3 para");
        Period fourthClasses = new Period();
        fourthClasses.setName("4 para");
        Set<Period> periodSet = new HashSet<>();
        periodSet.add(firstClasses);
        periodSet.add(secondClasses);
        periodSet.add(thirdClasses);
        periodSet.add(fourthClasses);
        semester.setPeriods(periodSet);
        Semester updatedSemester = new Semester();
        updatedSemester.setId(1L);
        updatedSemester.setDescription("2 semester");
        updatedSemester.setDefaultSemester(true);
        updatedSemester.setStartDay(LocalDate.of(2020, 5, 11));
        updatedSemester.setEndDay(LocalDate.of(2020, 6, 22));
        updatedSemester.setDaysOfWeek(semester.getDaysOfWeek());
        updatedSemester.setPeriods(semester.getPeriods());

        when(semesterRepository.update(updatedSemester)).thenReturn(updatedSemester);

        semester = semesterService.update(updatedSemester);
        assertNotNull(semester);
        assertEquals(updatedSemester, semester);
        verify(semesterRepository, times(1)).update(semester);
        verify(semesterRepository, times(1)).updateAllSemesterDefaultToFalse();
    }

    @Test
    public void getCurrentSemesterIfSemesterExists() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        semester.setCurrentSemester(true);

        when(semesterRepository.getCurrentSemester()).thenReturn(Optional.of(semester));

        Semester currentSemester = semesterService.getCurrentSemester();
        assertEquals(semester, currentSemester);
        verify(semesterRepository, times(1)).getCurrentSemester();
    }

    @Test
    public void getDefaultSemesterIfSemesterExists() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        semester.setDefaultSemester(true);

        when(semesterRepository.getDefaultSemester()).thenReturn(Optional.of(semester));

        Semester defaultSemester = semesterService.getDefaultSemester();
        assertEquals(semester, defaultSemester);
        verify(semesterRepository, times(1)).getDefaultSemester();
    }

    @Test(expected = ScheduleConflictException.class)
    public void throwScheduleConflictExceptionIfCurrentSemesterNotFounded() {
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        semester.setCurrentSemester(false);

        semesterService.getCurrentSemester();
    }

    @Test
    public void addGroupToSemester() {
        Group group = new Group();
        group.setTitle("some group");
        group.setId(1L);
        List<Group> groupList = new ArrayList<>();
        groupList.add(group);
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setYear(2020);
        semester.setDescription("1 semester");
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        semester.setCurrentSemester(false);
        Semester updatedSemester = new Semester();
        updatedSemester.setId(1L);
        updatedSemester.setYear(2020);
        updatedSemester.setDescription("1 semester");
        updatedSemester.setStartDay(LocalDate.of(2020, 4, 10));
        updatedSemester.setEndDay(LocalDate.of(2020, 5, 10));
        updatedSemester.setCurrentSemester(false);
        updatedSemester.setGroups(groupList);
        Semester semesterWithGroup = semesterService.addGroupToSemester(semester, group);
        assertNotNull(semesterWithGroup);
        assertTrue(semesterWithGroup.getGroups().contains(group));
    }
}
