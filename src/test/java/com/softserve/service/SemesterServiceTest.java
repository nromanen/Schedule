package com.softserve.service;

import com.softserve.dto.SemesterDTO;
import com.softserve.dto.SemesterWithGroupsDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Period;
import com.softserve.entity.Semester;
import com.softserve.exception.*;
import com.softserve.mapper.SemesterMapper;
import com.softserve.repository.GroupRepository;
import com.softserve.repository.ScheduleRepository;
import com.softserve.repository.SemesterRepository;
import com.softserve.service.impl.SemesterServiceImpl;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@Tag("unit")
@ExtendWith(MockitoExtension.class)
class SemesterServiceTest {

    @Mock
    private SemesterRepository semesterRepository;

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private SemesterMapper semesterMapper;

    @InjectMocks
    private SemesterServiceImpl semesterService;

    @Test
    void getSemesterById() {
        Semester semester = createSemester(1L, "1 semester", 2020);
        SemesterWithGroupsDTO expectedDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);

        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));
        when(semesterMapper.semesterToSemesterWithGroupsDTO(semester)).thenReturn(expectedDTO);

        SemesterWithGroupsDTO result = semesterService.getById(1L);

        assertNotNull(result);
        assertEquals(expectedDTO.getId(), result.getId());
        assertEquals(expectedDTO.getDescription(), result.getDescription());
        verify(semesterRepository).findById(1L);
        verify(semesterMapper).semesterToSemesterWithGroupsDTO(semester);
    }

    @Test
    void throwEntityNotFoundExceptionIfSemesterNotFound() {
        when(semesterRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> semesterService.getById(2L));
        verify(semesterRepository).findById(2L);
    }

    @Test
    void saveSemester() {
        Semester semester = createSemesterWithPeriodsAndDays(1L, "1 semester", 2020);
        Semester savedSemester = createSemesterWithPeriodsAndDays(1L, "1 semester", 2020);
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(null, "1 semester", 2020);
        SemesterWithGroupsDTO expectedDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(semester);
        when(semesterRepository.save(semester)).thenReturn(savedSemester);
        when(semesterMapper.semesterToSemesterWithGroupsDTO(savedSemester)).thenReturn(expectedDTO);

        SemesterWithGroupsDTO result = semesterService.save(inputDTO);

        assertNotNull(result);
        assertEquals(expectedDTO.getId(), result.getId());
        assertEquals(expectedDTO.getDescription(), result.getDescription());
        verify(semesterRepository).save(semester);
        verify(semesterMapper).semesterToSemesterWithGroupsDTO(savedSemester);
    }

    @Test
    void saveSemesterAndSetItAsCurrent() {
        Semester semester = createSemesterWithPeriodsAndDays(1L, "1 semester", 2020);
        semester.setCurrentSemester(true);
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(null, "1 semester", 2020);
        inputDTO.setCurrentSemester(true);
        SemesterWithGroupsDTO expectedDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);
        expectedDTO.setCurrentSemester(true);

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(semester);
        when(semesterRepository.save(semester)).thenReturn(semester);
        when(semesterMapper.semesterToSemesterWithGroupsDTO(semester)).thenReturn(expectedDTO);

        SemesterWithGroupsDTO result = semesterService.save(inputDTO);

        assertNotNull(result);
        assertTrue(result.isCurrentSemester());
        verify(semesterRepository).updateAllSemesterCurrentToFalse();
        verify(semesterRepository).setCurrentSemester(semester.getId());
        verify(semesterRepository).save(semester);
    }

    @Test
    void saveSemesterAndSetItAsDefault() {
        Semester semester = createSemesterWithPeriodsAndDays(1L, "1 semester", 2020);
        semester.setDefaultSemester(true);
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(null, "1 semester", 2020);
        inputDTO.setDefaultSemester(true);
        SemesterWithGroupsDTO expectedDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);
        expectedDTO.setDefaultSemester(true);

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(semester);
        when(semesterRepository.save(semester)).thenReturn(semester);
        when(semesterMapper.semesterToSemesterWithGroupsDTO(semester)).thenReturn(expectedDTO);

        SemesterWithGroupsDTO result = semesterService.save(inputDTO);

        assertNotNull(result);
        assertTrue(result.isDefaultSemester());
        verify(semesterRepository).updateAllSemesterDefaultToFalse();
        verify(semesterRepository).setDefaultSemester(semester.getId());
        verify(semesterRepository).save(semester);
    }

    @Test
    void throwEntityAlreadyExistsExceptionIfDescriptionAlreadyExists() {
        Semester existingSemester = createSemester(1L, "1 semester", 2020);
        Semester newSemester = createSemester(0L, "1 semester", 2020);
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(0L, "1 semester", 2020);

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(newSemester);
        when(semesterRepository.getSemesterByDescriptionAndYear("1 semester", 2020))
                .thenReturn(Optional.of(existingSemester));

        assertThrows(EntityAlreadyExistsException.class, () -> semesterService.save(inputDTO));
        verify(semesterRepository, never()).save(any());
    }

    @Test
    void throwIncorrectTimeExceptionIfStartTimeAfterEndTime() {
        Semester semester = createSemester(1L, "1 semester", 2020);
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 3, 10));
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(null, "1 semester", 2020);
        inputDTO.setStartDay(LocalDate.of(2020, 4, 10));
        inputDTO.setEndDay(LocalDate.of(2020, 3, 10));

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(semester);

        assertThrows(IncorrectTimeException.class, () -> semesterService.save(inputDTO));
        verify(semesterRepository, never()).save(any());
    }

    @Test
    void updateSemester() {
        Semester existingSemester = createSemesterWithPeriodsAndDays(1L, "1 semester", 2020);
        Semester updatedSemester = createSemesterWithPeriodsAndDays(1L, "2 semester", 2020);
        updatedSemester.setStartDay(LocalDate.of(2020, 5, 11));
        updatedSemester.setEndDay(LocalDate.of(2020, 6, 22));
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(1L, "2 semester", 2020);
        inputDTO.setStartDay(LocalDate.of(2020, 5, 11));
        inputDTO.setEndDay(LocalDate.of(2020, 6, 22));
        SemesterWithGroupsDTO expectedDTO = createSemesterWithGroupsDTO(1L, "2 semester", 2020);
        expectedDTO.setStartDay(LocalDate.of(2020, 5, 11));
        expectedDTO.setEndDay(LocalDate.of(2020, 6, 22));

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(updatedSemester);
        when(semesterRepository.findById(1L)).thenReturn(Optional.of(existingSemester));
        when(semesterRepository.update(updatedSemester)).thenReturn(updatedSemester);
        when(semesterMapper.semesterToSemesterWithGroupsDTO(updatedSemester)).thenReturn(expectedDTO);

        SemesterWithGroupsDTO result = semesterService.update(inputDTO);

        assertNotNull(result);
        assertEquals("2 semester", result.getDescription());
        assertEquals(LocalDate.of(2020, 5, 11), result.getStartDay());
        assertEquals(LocalDate.of(2020, 6, 22), result.getEndDay());
        verify(semesterRepository).update(updatedSemester);
    }

    @Test
    void throwIncorrectTimeExceptionIfUpdatedStartTimeAfterEndTime() {
        Semester semester = createSemester(1L, "1 semester", 2020);
        semester.setStartDay(LocalDate.of(2020, 3, 10));
        semester.setEndDay(LocalDate.of(2020, 1, 11));
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);
        inputDTO.setStartDay(LocalDate.of(2020, 3, 10));
        inputDTO.setEndDay(LocalDate.of(2020, 1, 11));

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(semester);
        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));

        assertThrows(IncorrectTimeException.class, () -> semesterService.update(inputDTO));
        verify(semesterRepository).findById(1L);
        verify(semesterRepository, never()).update(any());
    }

    @Test
    void throwEntityAlreadyExistsExceptionIfUpdatedDescriptionAlreadyExists() {
        Semester semester = createSemesterWithPeriodsAndDays(1L, "1 semester", 2020);
        Semester anotherSemester = createSemester(2L, "1 semester", 2020);
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(semester);
        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));
        when(semesterRepository.getSemesterByDescriptionAndYear("1 semester", 2020))
                .thenReturn(Optional.of(anotherSemester));

        assertThrows(EntityAlreadyExistsException.class, () -> semesterService.update(inputDTO));
        verify(semesterRepository).findById(1L);
        verify(semesterRepository, never()).update(any());
    }

    @Test
    void throwUsedEntityExceptionIfDaysHaveLessons() {
        // Semester has TUESDAY, WEDNESDAY but schedule has MONDAY, TUESDAY, WEDNESDAY
        // MONDAY is missing in semester days - should throw exception
        Semester semester = createSemester(1L, "1 semester", 2020);
        semester.setDaysOfWeek(new HashSet<>(Set.of(DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY)));
        semester.setPeriods(new HashSet<>(Set.of(createPeriod("1 para"))));
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(semester);
        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));
        when(semesterRepository.getDaysWithLessonsBySemesterId(1L))
                .thenReturn(List.of(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY));

        assertThrows(UsedEntityException.class, () -> semesterService.update(inputDTO));
        verify(semesterRepository, never()).update(any());
    }

    @Test
    void throwUsedEntityExceptionIfPeriodsHaveLessons() {
        // Semester has only firstPeriod but schedule has firstPeriod and secondPeriod
        // secondPeriod is missing - should throw exception
        Period firstPeriod = createPeriod("1 para");
        Period secondPeriod = createPeriod("2 para");
        Semester semester = createSemester(1L, "1 semester", 2020);
        semester.setDaysOfWeek(new HashSet<>(Set.of(DayOfWeek.MONDAY)));
        semester.setPeriods(new HashSet<>(Set.of(firstPeriod)));
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(semester);
        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));
        when(semesterRepository.getPeriodsWithLessonsBySemesterId(1L))
                .thenReturn(List.of(firstPeriod, secondPeriod));

        assertThrows(UsedEntityException.class, () -> semesterService.update(inputDTO));
        verify(semesterRepository, never()).update(any());
    }

    @Test
    void updateSemesterWhenAllDaysWithLessonsArePresent() {
        // All days with lessons are present in semester - should update successfully
        Semester semester = createSemester(1L, "1 semester", 2020);
        semester.setDaysOfWeek(new HashSet<>(Set.of(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY)));
        semester.setPeriods(new HashSet<>(Set.of(createPeriod("1 para"))));
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);
        SemesterWithGroupsDTO expectedDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(semester);
        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));
        when(semesterRepository.getDaysWithLessonsBySemesterId(1L))
                .thenReturn(List.of(DayOfWeek.MONDAY, DayOfWeek.TUESDAY));
        when(semesterRepository.update(semester)).thenReturn(semester);
        when(semesterMapper.semesterToSemesterWithGroupsDTO(semester)).thenReturn(expectedDTO);

        SemesterWithGroupsDTO result = semesterService.update(inputDTO);

        assertNotNull(result);
        verify(semesterRepository).update(semester);
        verify(semesterRepository).getDaysWithLessonsBySemesterId(1L);
    }

    @Test
    void updateSemesterAndSetItAsCurrent() {
        Semester semester = createSemesterWithPeriodsAndDays(1L, "2 semester", 2020);
        semester.setCurrentSemester(true);
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(1L, "2 semester", 2020);
        inputDTO.setCurrentSemester(true);
        SemesterWithGroupsDTO expectedDTO = createSemesterWithGroupsDTO(1L, "2 semester", 2020);
        expectedDTO.setCurrentSemester(true);

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(semester);
        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));
        when(semesterRepository.update(semester)).thenReturn(semester);
        when(semesterMapper.semesterToSemesterWithGroupsDTO(semester)).thenReturn(expectedDTO);

        SemesterWithGroupsDTO result = semesterService.update(inputDTO);

        assertNotNull(result);
        assertTrue(result.isCurrentSemester());
        verify(semesterRepository).updateAllSemesterCurrentToFalse();
        verify(semesterRepository).update(semester);
    }

    @Test
    void updateSemesterAndSetItAsDefault() {
        Semester semester = createSemesterWithPeriodsAndDays(1L, "2 semester", 2020);
        semester.setDefaultSemester(true);
        SemesterWithGroupsDTO inputDTO = createSemesterWithGroupsDTO(1L, "2 semester", 2020);
        inputDTO.setDefaultSemester(true);
        SemesterWithGroupsDTO expectedDTO = createSemesterWithGroupsDTO(1L, "2 semester", 2020);
        expectedDTO.setDefaultSemester(true);

        when(semesterMapper.semesterWithGroupsDTOToSemester(inputDTO)).thenReturn(semester);
        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));
        when(semesterRepository.update(semester)).thenReturn(semester);
        when(semesterMapper.semesterToSemesterWithGroupsDTO(semester)).thenReturn(expectedDTO);

        SemesterWithGroupsDTO result = semesterService.update(inputDTO);

        assertNotNull(result);
        assertTrue(result.isDefaultSemester());
        verify(semesterRepository).updateAllSemesterDefaultToFalse();
        verify(semesterRepository).update(semester);
    }

    @Test
    void getCurrentSemester() {
        Semester semester = createSemester(1L, "1 semester", 2020);
        semester.setCurrentSemester(true);
        SemesterWithGroupsDTO expectedDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);
        expectedDTO.setCurrentSemester(true);

        when(semesterRepository.getCurrentSemester()).thenReturn(Optional.of(semester));
        when(semesterMapper.semesterToSemesterWithGroupsDTO(semester)).thenReturn(expectedDTO);

        SemesterWithGroupsDTO result = semesterService.getCurrentSemester();

        assertNotNull(result);
        assertTrue(result.isCurrentSemester());
        assertEquals(expectedDTO.getId(), result.getId());
        verify(semesterRepository).getCurrentSemester();
    }

    @Test
    void getDefaultSemester() {
        Semester semester = createSemester(1L, "1 semester", 2020);
        semester.setDefaultSemester(true);
        SemesterWithGroupsDTO expectedDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);
        expectedDTO.setDefaultSemester(true);

        when(semesterRepository.getDefaultSemester()).thenReturn(Optional.of(semester));
        when(semesterMapper.semesterToSemesterWithGroupsDTO(semester)).thenReturn(expectedDTO);

        SemesterWithGroupsDTO result = semesterService.getDefaultSemester();

        assertNotNull(result);
        assertTrue(result.isDefaultSemester());
        assertEquals(expectedDTO.getId(), result.getId());
        verify(semesterRepository).getDefaultSemester();
    }

    @Test
    void throwScheduleConflictExceptionIfCurrentSemesterNotFound() {
        when(semesterRepository.getCurrentSemester()).thenReturn(Optional.empty());

        assertThrows(ScheduleConflictException.class, () -> semesterService.getCurrentSemester());
        verify(semesterRepository).getCurrentSemester();
    }

    @Test
    void throwScheduleConflictExceptionIfDefaultSemesterNotFound() {
        when(semesterRepository.getDefaultSemester()).thenReturn(Optional.empty());

        assertThrows(ScheduleConflictException.class, () -> semesterService.getDefaultSemester());
        verify(semesterRepository).getDefaultSemester();
    }

    @Test
    void addGroupsToSemester() {
        Group group1 = createGroup(1L, "Group 1");
        Group group2 = createGroup(2L, "Group 2");
        Semester semester = createSemester(1L, "1 semester", 2020);
        Semester updatedSemester = createSemester(1L, "1 semester", 2020);
        SemesterWithGroupsDTO expectedDTO = createSemesterWithGroupsDTO(1L, "1 semester", 2020);

        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));
        when(groupRepository.getGroupsByGroupIds(List.of(1L, 2L))).thenReturn(List.of(group1, group2));
        when(semesterRepository.update(semester)).thenReturn(updatedSemester);
        when(semesterMapper.semesterToSemesterWithGroupsDTO(updatedSemester)).thenReturn(expectedDTO);

        SemesterWithGroupsDTO result = semesterService.addGroupsToSemester(1L, List.of(1L, 2L));

        assertNotNull(result);
        assertTrue(semester.getGroups().contains(group1));
        assertTrue(semester.getGroups().contains(group2));
        assertEquals(2, semester.getGroups().size());
        verify(semesterRepository).update(semester);
        verify(groupRepository).getGroupsByGroupIds(List.of(1L, 2L));
    }

    @Test
    void deleteSemester() {
        Semester semester = createSemester(1L, "1 semester", 2020);

        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));

        semesterService.delete(1L);

        verify(semesterRepository).findById(1L);
        verify(semesterRepository).delete(semester);
    }

    @Test
    void throwEntityNotFoundExceptionWhenDeleteNonExistentSemester() {
        when(semesterRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> semesterService.delete(999L));
        verify(semesterRepository).findById(999L);
        verify(semesterRepository, never()).delete(any());
    }

    @Test
    void changeCurrentSemester() {
        Semester semester = createSemester(1L, "1 semester", 2020);
        SemesterDTO expectedDTO = createSemesterDTO(1L, "1 semester", 2020);
        expectedDTO.setCurrentSemester(true);

        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));
        when(semesterMapper.semesterToSemesterDTO(semester)).thenReturn(expectedDTO);

        SemesterDTO result = semesterService.changeCurrentSemester(1L);

        assertNotNull(result);
        assertTrue(result.isCurrentSemester());
        verify(semesterRepository).updateAllSemesterCurrentToFalse();
        verify(semesterRepository).setCurrentSemester(1L);
        verify(semesterRepository, times(1)).findById(1L);
    }

    @Test
    void changeDefaultSemester() {
        Semester semester = createSemester(1L, "1 semester", 2020);
        SemesterDTO expectedDTO = createSemesterDTO(1L, "1 semester", 2020);
        expectedDTO.setDefaultSemester(true);

        when(semesterRepository.findById(1L)).thenReturn(Optional.of(semester));
        when(semesterMapper.semesterToSemesterDTO(semester)).thenReturn(expectedDTO);

        SemesterDTO result = semesterService.changeDefaultSemester(1L);

        assertNotNull(result);
        assertTrue(result.isDefaultSemester());
        verify(semesterRepository).updateAllSemesterDefaultToFalse();
        verify(semesterRepository).setDefaultSemester(1L);
        verify(semesterRepository, times(1)).findById(1L);
    }

    @Test
    void getDisabledSemesters() {
        Semester semester1 = createSemester(1L, "1 semester", 2020);
        semester1.setDisable(true);
        Semester semester2 = createSemester(2L, "2 semester", 2020);
        semester2.setDisable(true);
        List<Semester> disabledSemesters = List.of(semester1, semester2);

        SemesterDTO dto1 = createSemesterDTO(1L, "1 semester", 2020);
        dto1.setDisable(true);
        SemesterDTO dto2 = createSemesterDTO(2L, "2 semester", 2020);
        dto2.setDisable(true);
        List<SemesterDTO> expectedDTOs = List.of(dto1, dto2);

        when(semesterRepository.getDisabled()).thenReturn(disabledSemesters);
        when(semesterMapper.semestersToSemesterDTOs(disabledSemesters)).thenReturn(expectedDTOs);

        List<SemesterDTO> result = semesterService.getDisabled();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.get(0).isDisable());
        assertTrue(result.get(1).isDisable());
        verify(semesterRepository).getDisabled();
    }

    @Test
    void getAllSemesters() {
        Semester semester1 = createSemester(1L, "1 semester", 2020);
        Semester semester2 = createSemester(2L, "2 semester", 2020);
        List<Semester> semesters = List.of(semester1, semester2);

        SemesterWithGroupsDTO dto1 = createSemesterWithGroupsDTO(1L, "1 semester", 2020);
        SemesterWithGroupsDTO dto2 = createSemesterWithGroupsDTO(2L, "2 semester", 2020);
        List<SemesterWithGroupsDTO> expectedDTOs = List.of(dto1, dto2);

        when(semesterRepository.getAll()).thenReturn(semesters);
        when(semesterMapper.semestersToSemesterWithGroupsDTOs(semesters)).thenReturn(expectedDTOs);

        List<SemesterWithGroupsDTO> result = semesterService.getAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("1 semester", result.get(0).getDescription());
        assertEquals("2 semester", result.get(1).getDescription());
        verify(semesterRepository).getAll();
    }

    // ==================== Helper methods ====================

    private Semester createSemester(Long id, String description, int year) {
        Semester semester = new Semester();
        semester.setId(id);
        semester.setYear(year);
        semester.setDescription(description);
        semester.setStartDay(LocalDate.of(2020, 4, 10));
        semester.setEndDay(LocalDate.of(2020, 5, 10));
        return semester;
    }

    private Semester createSemesterWithPeriodsAndDays(Long id, String description, int year) {
        Semester semester = createSemester(id, description, year);
        semester.setDaysOfWeek(new HashSet<>(Set.of(DayOfWeek.MONDAY, DayOfWeek.TUESDAY)));
        semester.setPeriods(new HashSet<>(Set.of(
                createPeriod("1 para"),
                createPeriod("2 para"),
                createPeriod("3 para"),
                createPeriod("4 para")
        )));
        return semester;
    }

    private SemesterDTO createSemesterDTO(Long id, String description, int year) {
        SemesterDTO dto = new SemesterDTO();
        dto.setId(id);
        dto.setYear(year);
        dto.setDescription(description);
        dto.setStartDay(LocalDate.of(2020, 4, 10));
        dto.setEndDay(LocalDate.of(2020, 5, 10));
        return dto;
    }

    private SemesterWithGroupsDTO createSemesterWithGroupsDTO(Long id, String description, int year) {
        SemesterWithGroupsDTO dto = new SemesterWithGroupsDTO();
        dto.setId(id);
        dto.setYear(year);
        dto.setDescription(description);
        dto.setStartDay(LocalDate.of(2020, 4, 10));
        dto.setEndDay(LocalDate.of(2020, 5, 10));
        return dto;
    }

    private Period createPeriod(String name) {
        Period period = new Period();
        period.setName(name);
        return period;
    }

    private Group createGroup(Long id, String title) {
        Group group = new Group();
        group.setId(id);
        group.setTitle(title);
        group.setDisable(false);
        return group;
    }
}
