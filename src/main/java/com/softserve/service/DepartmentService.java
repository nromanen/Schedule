package com.softserve.service;

import com.softserve.dto.DepartmentDTO;
import com.softserve.dto.TeacherDTO;

import java.util.List;

public interface DepartmentService {


    /**
     * Retrieves a department by the given id.
     *
     * @param id the id of the department
     * @return the department DTO with the given id
     */
    DepartmentDTO getById(Long id);

    /**
     * Returns all departments.
     *
     * @return the list of department DTOs
     */
    List<DepartmentDTO> getAll();

    /**
     * Saves a new department.
     *
     * @param departmentDTO the department DTO to be saved
     * @return the saved department DTO
     */
    DepartmentDTO save(DepartmentDTO departmentDTO);

    /**
     * Updates an existing department.
     *
     * @param departmentDTO the department DTO to be updated
     * @return the updated department DTO
     */
    DepartmentDTO update(DepartmentDTO departmentDTO);

    /**
     * Deletes a department by id.
     *
     * @param id the id of the department to be deleted
     * @return the deleted department DTO
     */
    DepartmentDTO delete(Long id);

    /**
     * Returns all disabled departments.
     *
     * @return the list of disabled department DTOs
     */
    List<DepartmentDTO> getDisabled();

    /**
     * Returns all teachers in the department.
     *
     * @param departmentId the id of the department
     * @return the list of teacher DTOs
     */
    List<TeacherDTO> getAllTeachers(Long departmentId);
}
