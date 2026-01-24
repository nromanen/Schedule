package com.softserve.service;

import com.softserve.dto.SubjectDTO;
import com.softserve.dto.SubjectNameWithTypesDTO;

import java.util.List;

public interface SubjectService {

    /**
     * Retrieves a subject by its ID.
     *
     * @param id the ID of the subject
     * @return the subject DTO
     * @throws com.softserve.exception.EntityNotFoundException if subject not found
     */
    SubjectDTO getById(Long id);

    /**
     * Returns all subjects.
     *
     * @return the list of subject DTOs
     */
    List<SubjectDTO> getAll();

    /**
     * Saves a new subject.
     *
     * @param subjectDTO the subject DTO to save
     * @return the saved subject DTO
     * @throws com.softserve.exception.FieldAlreadyExistsException if subject with given name already exists
     */
    SubjectDTO save(SubjectDTO subjectDTO);

    /**
     * Updates an existing subject.
     *
     * @param subjectDTO the subject DTO to update
     * @return the updated subject DTO
     * @throws com.softserve.exception.EntityNotFoundException     if subject not found
     * @throws com.softserve.exception.FieldAlreadyExistsException if subject with given name already exists
     */
    SubjectDTO update(SubjectDTO subjectDTO);

    /**
     * Deletes a subject by its ID.
     *
     * @param id the ID of the subject to delete
     * @throws com.softserve.exception.EntityNotFoundException if subject not found
     */
    void deleteById(Long id);

    /**
     * Returns all disabled subjects.
     *
     * @return the list of disabled subject DTOs
     */
    List<SubjectDTO> getDisabled();

    /**
     * Returns all subjects with their types for the given semester and teacher.
     *
     * @param semesterId the id of the semester
     * @param teacherId  the id of the teacher
     * @return the list of subjects with their types
     */
    List<SubjectNameWithTypesDTO> getSubjectsWithTypes(Long semesterId, Long teacherId);
}
