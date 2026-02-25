package com.softserve.service;

import com.softserve.dto.AddPeriodDTO;
import com.softserve.dto.PeriodDTO;
import com.softserve.entity.Period;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.exception.IncorrectTimeException;
import com.softserve.exception.PeriodConflictException;
import com.softserve.mapper.PeriodMapper;
import com.softserve.repository.PeriodRepository;
import com.softserve.service.impl.PeriodServiceImpl;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@Tag("unit")
@ExtendWith(MockitoExtension.class)
class PeriodServiceTest {

    @Mock
    private PeriodRepository periodRepository;

    @Mock
    private PeriodMapper periodMapper;

    @InjectMocks
    private PeriodServiceImpl periodService;

    @Test
    void getPeriodById() {
        Period period = createPeriod(1L, "Some period", "03:00", "04:00");
        PeriodDTO expectedDTO = createPeriodDTO(1L, "Some period", "03:00", "04:00");

        when(periodRepository.findById(1L)).thenReturn(Optional.of(period));
        when(periodMapper.convertToDto(period)).thenReturn(expectedDTO);

        PeriodDTO result = periodService.getById(1L);

        assertNotNull(result);
        assertEquals(expectedDTO.getId(), result.getId());
        assertEquals(expectedDTO.getName(), result.getName());
        verify(periodRepository).findById(1L);
        verify(periodMapper).convertToDto(period);
    }

    @Test
    void throwEntityNotFoundExceptionIfPeriodNotFoundById() {
        when(periodRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> periodService.getById(2L));
        verify(periodRepository).findById(2L);
    }

    @Test
    void savePeriodSuccessfully() {
        Period period = createPeriod(1L, "Some period", "03:00", "04:00");
        Period existingPeriod = createPeriod(2L, "Another period", "05:00", "06:00");
        AddPeriodDTO inputDTO = createAddPeriodDTO("Some period", "03:00", "04:00");
        PeriodDTO expectedDTO = createPeriodDTO(1L, "Some period", "03:00", "04:00");
        List<Period> periodList = new ArrayList<>(List.of(existingPeriod));

        when(periodMapper.convertToEntity(inputDTO)).thenReturn(period);
        when(periodRepository.getAll()).thenReturn(periodList);
        when(periodRepository.save(period)).thenReturn(period);
        when(periodMapper.convertToDto(period)).thenReturn(expectedDTO);

        PeriodDTO result = periodService.save(inputDTO);

        assertNotNull(result);
        assertEquals(expectedDTO.getName(), result.getName());
        verify(periodRepository).getAll();
        verify(periodRepository).save(period);
    }

    @Test
    void throwIncorrectTimeExceptionIfSavePeriodBeginsAfterItsEnd() {
        Period period = createPeriod(1L, "Some period", "05:00", "04:00");
        AddPeriodDTO inputDTO = createAddPeriodDTO("Some period", "05:00", "04:00");

        assertThrows(IncorrectTimeException.class, () -> periodService.save(inputDTO));
        verify(periodRepository, never()).save(any());
    }

    @Test
    void throwFieldAlreadyExistsExceptionIfSavePeriodWithExistingName() {
        Period period = createPeriod(1L, "Some period", "01:00", "02:00");
        Period existingPeriod = createPeriod(2L, "Some period", "03:00", "04:00");
        AddPeriodDTO inputDTO = createAddPeriodDTO("Some period", "01:00", "02:00");
        List<Period> periodList = new ArrayList<>(List.of(existingPeriod));

        when(periodRepository.findByName(anyString())).thenReturn(Optional.of(period));

        assertThrows(FieldAlreadyExistsException.class, () -> periodService.save(inputDTO));
        verify(periodRepository, never()).save(any());
    }

    @Test
    void throwPeriodConflictExceptionIfSavedPeriodIntersectsWithOtherPeriods() {
        Period period = createPeriod(1L, "Some period", "01:00", "02:00");
        Period existingPeriod = createPeriod(2L, "Some period", "02:00", "03:00");
        AddPeriodDTO inputDTO = createAddPeriodDTO("Some period", "01:00", "02:00");
        List<Period> periodList = new ArrayList<>(List.of(existingPeriod));

        when(periodMapper.convertToEntity(inputDTO)).thenReturn(period);
        when(periodRepository.getAll()).thenReturn(periodList);

        assertThrows(PeriodConflictException.class, () -> periodService.save(inputDTO));
        verify(periodRepository).getAll();
        verify(periodRepository, never()).save(any());
    }

    @Test
    void updatePeriodSuccessfully() {
        Period period = createPeriod(1L, "Some period", "03:00", "04:00");
        Period existingPeriod = createPeriod(2L, "Another period", "06:00", "07:00");
        PeriodDTO inputDTO = createPeriodDTO(1L, "Some period", "03:00", "04:00");
        List<Period> periodList = new ArrayList<>(List.of(period, existingPeriod));

        when(periodMapper.convertToEntity(inputDTO)).thenReturn(period);
        when(periodRepository.getAll()).thenReturn(periodList);
        when(periodRepository.findByName(period.getName())).thenReturn(Optional.of(period));
        when(periodRepository.update(any(Period.class))).thenReturn(period);
        when(periodMapper.convertToDto(period)).thenReturn(inputDTO);

        PeriodDTO result = periodService.update(inputDTO);

        assertNotNull(result);
        assertEquals(inputDTO.getId(), result.getId());
        assertEquals(inputDTO.getName(), result.getName());
        verify(periodRepository).getAll();
        verify(periodRepository).update(period);
    }

    @Test
    void throwFieldAlreadyExistsExceptionIfUpdatedPeriodNameAlreadyExists() {
        Period period = createPeriod(1L, "Some period", "03:00", "04:00");
        Period existingPeriod = createPeriod(2L, "Some period", "06:00", "07:00");
        PeriodDTO inputDTO = createPeriodDTO(1L, "Some period", "03:00", "04:00");
        List<Period> periodList = new ArrayList<>(List.of(period, existingPeriod));

        when(periodRepository.getAll()).thenReturn(periodList);
        when(periodRepository.findByName("Some period")).thenReturn(Optional.of(existingPeriod));

        assertThrows(FieldAlreadyExistsException.class, () -> periodService.update(inputDTO));
        verify(periodRepository, never()).update(any());
    }

    @Test
    void throwIncorrectTimeExceptionIfUpdatedPeriodBeginsAfterItsEnd() {
        Period period = createPeriod(1L, "Some period", "05:00", "04:00");
        PeriodDTO inputDTO = createPeriodDTO(1L, "Some period", "05:00", "04:00");

        assertThrows(IncorrectTimeException.class, () -> periodService.update(inputDTO));
        verify(periodRepository, never()).update(any());
    }

    @Test
    void throwPeriodConflictExceptionIfUpdatedPeriodIntersectsWithOther() {
        Period period = createPeriod(1L, "Some period", "02:00", "03:30");
        Period existingPeriod = createPeriod(2L, "Another period", "03:00", "04:00");
        PeriodDTO inputDTO = createPeriodDTO(1L, "Some period", "02:00", "03:30");
        List<Period> periodList = new ArrayList<>(List.of(period, existingPeriod));

        when(periodMapper.convertToEntity(inputDTO)).thenReturn(period);
        when(periodRepository.getAll()).thenReturn(periodList);
        when(periodRepository.findByName("Some period")).thenReturn(Optional.of(period));

        assertThrows(PeriodConflictException.class, () -> periodService.update(inputDTO));
        verify(periodRepository).getAll();
        verify(periodRepository, never()).update(any());
    }

    // ==================== Helper methods ====================

    private Period createPeriod(Long id, String name, String startTime, String endTime) {
        Period period = new Period();
        period.setId(id);
        period.setName(name);
        period.setStartTime(LocalTime.parse(startTime));
        period.setEndTime(LocalTime.parse(endTime));
        return period;
    }

    private PeriodDTO createPeriodDTO(Long id, String name, String startTime, String endTime) {
        PeriodDTO dto = new PeriodDTO();
        dto.setId(id);
        dto.setName(name);
        dto.setStartTime(LocalTime.parse(startTime));
        dto.setEndTime(LocalTime.parse(endTime));
        return dto;
    }

    private AddPeriodDTO createAddPeriodDTO(String name, String startTime, String endTime) {
        AddPeriodDTO dto = new AddPeriodDTO();
        dto.setName(name);
        dto.setStartTime(LocalTime.parse(startTime));
        dto.setEndTime(LocalTime.parse(endTime));
        return dto;
    }
}
