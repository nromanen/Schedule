package com.softserve.service;

import com.softserve.dto.AddPeriodDTO;
import com.softserve.dto.PeriodDTO;

import java.util.List;

/**
 * Service interface for managing periods.
 */
public interface PeriodService {

    /**
     * Retrieves a period by its ID.
     *
     * @param id the ID of the period
     * @return the period DTO
     * @throws com.softserve.exception.EntityNotFoundException if period not found
     */
    PeriodDTO getById(Long id);

    /**
     * Returns all periods.
     *
     * @return the list of period DTOs
     */
    List<PeriodDTO> getAll();

    /**
     * Saves a new period.
     *
     * @param addPeriodDTO the period data to save
     * @return the saved period DTO
     * @throws com.softserve.exception.IncorrectTimeException      if the start time is after or equal to end time
     * @throws com.softserve.exception.PeriodConflictException     if period conflicts with existing periods
     * @throws com.softserve.exception.FieldAlreadyExistsException if period name already exists
     */
    PeriodDTO save(AddPeriodDTO addPeriodDTO);

    /**
     * Saves a list of periods.
     *
     * @param addPeriodDTOs the list of period data to save
     * @return the list of saved period DTOs
     * @throws com.softserve.exception.IncorrectTimeException  if any period has invalid time
     * @throws com.softserve.exception.PeriodConflictException if any period conflicts with others
     */
    List<PeriodDTO> saveAll(List<AddPeriodDTO> addPeriodDTOs);

    /**
     * Updates an existing period.
     *
     * @param periodDTO the period DTO to update
     * @return the updated period DTO
     * @throws com.softserve.exception.EntityNotFoundException     if period not found
     * @throws com.softserve.exception.IncorrectTimeException      if the start time is after or equal to end time
     * @throws com.softserve.exception.PeriodConflictException     if period conflicts with existing periods
     * @throws com.softserve.exception.FieldAlreadyExistsException if period name already exists
     */
    PeriodDTO update(PeriodDTO periodDTO);

    /**
     * Deletes a period by its ID.
     *
     * @param id the ID of the period to delete
     * @return the deleted period DTO
     * @throws com.softserve.exception.EntityNotFoundException if period not found
     * @throws com.softserve.exception.DeleteDisabledException if period has references
     */
    PeriodDTO deleteById(Long id);

    /**
     * Returns the first four periods.
     *
     * @return the list of first four period DTOs
     */
    List<PeriodDTO> getFirstFourPeriods();
}
