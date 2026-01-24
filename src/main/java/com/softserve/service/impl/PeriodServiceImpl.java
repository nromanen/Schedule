package com.softserve.service.impl;

import com.softserve.dto.AddPeriodDTO;
import com.softserve.dto.PeriodDTO;
import com.softserve.entity.Period;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.exception.IncorrectTimeException;
import com.softserve.exception.PeriodConflictException;
import com.softserve.mapper.PeriodMapper;
import com.softserve.repository.PeriodRepository;
import com.softserve.service.PeriodService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class PeriodServiceImpl implements PeriodService {

    private final PeriodRepository periodRepository;
    private final PeriodMapper periodMapper;

    @Override
    @Transactional(readOnly = true)
    public PeriodDTO getById(Long id) {
        log.info("Getting period by id: {}", id);
        Period period = findPeriodById(id);
        return periodMapper.convertToDto(period);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("allPeriods")
    public List<PeriodDTO> getAll() {
        log.info("Getting all periods");
        List<Period> periods = periodRepository.getAll();
        return periodMapper.convertToDtoList(periods);
    }

    @Override
    @CacheEvict(value = "allPeriods", allEntries = true)
    public PeriodDTO save(AddPeriodDTO addPeriodDTO) {
        log.info("Saving period: {}", addPeriodDTO);

        validateTime(addPeriodDTO.getStartTime(), addPeriodDTO.getEndTime());
        validateNameUniqueness(addPeriodDTO.getName(), null);

        Period newPeriod = periodMapper.convertToEntity(addPeriodDTO);
        List<Period> existingPeriods = periodRepository.getAll();

        validateNoConflicts(existingPeriods, newPeriod);

        Period saved = periodRepository.save(newPeriod);
        return periodMapper.convertToDto(saved);
    }

    @Override
    @CacheEvict(value = "allPeriods", allEntries = true)
    public List<PeriodDTO> saveAll(List<AddPeriodDTO> addPeriodDTOs) {
        log.info("Saving periods: {}", addPeriodDTOs);

        addPeriodDTOs.forEach(dto -> validateTime(dto.getStartTime(), dto.getEndTime()));

        List<Period> existingPeriods = periodRepository.getAll();
        List<Period> newPeriods = periodMapper.convertToEntityList(addPeriodDTOs);

        validateNoConflictsInBatch(existingPeriods, newPeriods);

        List<Period> savedPeriods = newPeriods.stream()
                .map(periodRepository::save)
                .toList();

        return periodMapper.convertToDtoList(savedPeriods);
    }

    @Override
    @CacheEvict(value = "allPeriods", allEntries = true)
    public PeriodDTO update(PeriodDTO periodDTO) {
        log.info("Updating period: {}", periodDTO);

        validateTime(periodDTO.getStartTime(), periodDTO.getEndTime());
        findPeriodById(periodDTO.getId());
        validateNameUniqueness(periodDTO.getName(), periodDTO.getId());

        Period periodToUpdate = periodMapper.convertToEntity(periodDTO);
        List<Period> existingPeriods = periodRepository.getAll();

        validateNoConflicts(existingPeriods, periodToUpdate);

        Period updated = periodRepository.update(periodToUpdate);
        return periodMapper.convertToDto(updated);
    }

    @Override
    @CacheEvict(value = "allPeriods", allEntries = true)
    public PeriodDTO deleteById(Long id) {
        log.info("Deleting period by id: {}", id);
        Period period = findPeriodById(id);
        Period deleted = periodRepository.delete(period);
        return periodMapper.convertToDto(deleted);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PeriodDTO> getFirstFourPeriods() {
        log.info("Getting first four periods");
        List<Period> periods = periodRepository.getFistFourPeriods();
        return periodMapper.convertToDtoList(periods);
    }

    // ==================== Private Helper Methods ====================

    private Period findPeriodById(Long id) {
        return periodRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Period.class, "id", id.toString()));
    }

    private void validateTime(LocalTime startTime, LocalTime endTime) {
        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new IncorrectTimeException("Start time must be before end time");
        }
    }

    private void validateNameUniqueness(String name, Long excludeId) {
        periodRepository.findByName(name).ifPresent(existing -> {
            if (!Objects.equals(existing.getId(), excludeId)) {
                throw new FieldAlreadyExistsException(Period.class, "name", name);
            }
        });
    }

    private void validateNoConflicts(List<Period> existingPeriods, Period newPeriod) {
        boolean hasConflict = existingPeriods.stream()
                .filter(existing -> !Objects.equals(existing.getId(), newPeriod.getId()))
                .anyMatch(existing -> hasTimeConflict(newPeriod, existing));

        if (hasConflict) {
            throw new PeriodConflictException("Period conflicts with existing periods");
        }
    }

    private void validateNoConflictsInBatch(List<Period> existingPeriods, List<Period> newPeriods) {
        for (Period newPeriod : newPeriods) {
            validateNoConflicts(existingPeriods, newPeriod);

            boolean hasInternalConflict = newPeriods.stream()
                    .filter(other -> other != newPeriod)
                    .anyMatch(other -> hasTimeConflict(newPeriod, other));

            if (hasInternalConflict) {
                throw new PeriodConflictException("Periods in the batch conflict with each other");
            }
        }
    }

    private boolean hasTimeConflict(Period period1, Period period2) {
        return isOverlapping(period1, period2) || isAdjacent(period1, period2);
    }

    private boolean isOverlapping(Period period1, Period period2) {
        return period1.getStartTime().isBefore(period2.getEndTime())
                && period1.getEndTime().isAfter(period2.getStartTime());
    }

    private boolean isAdjacent(Period period1, Period period2) {
        return period1.getStartTime().equals(period2.getEndTime())
                || period1.getEndTime().equals(period2.getStartTime());
    }
}
