package com.softserve.service;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import com.softserve.dto.TeacherImportDTO;
import com.softserve.dto.UserDataDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TeacherService {

    /**
     * Retrieves a teacher by its ID.
     *
     * @param id the ID of the teacher
     * @return the teacher DTO
     * @throws com.softserve.exception.EntityNotFoundException if teacher not found
     */
    TeacherDTO getById(Long id);

    /**
     * Returns all teachers.
     *
     * @return the list of teacher DTOs
     */
    List<TeacherDTO> getAll();

    /**
     * Saves a new teacher and registers user if email exists.
     *
     * @param teacherDTO the teacher DTO to save
     * @return the saved teacher DTO
     */
    TeacherDTO save(TeacherDTO teacherDTO);

    /**
     * Updates an existing teacher and registers user if email was added.
     *
     * @param teacherForUpdateDTO the teacher with info to be updated
     * @return the updated teacher DTO
     */
    TeacherForUpdateDTO update(TeacherForUpdateDTO teacherForUpdateDTO);

    /**
     * Deletes a teacher by its ID.
     *
     * @param id the ID of the teacher to delete
     * @throws com.softserve.exception.EntityNotFoundException if teacher not found
     */
    void deleteById(Long id);

    /**
     * Returns all disabled teachers.
     *
     * @return the list of disabled teacher DTOs
     */
    List<TeacherDTO> getDisabled();

    /**
     * Returns all teachers that don't have registered user.
     *
     * @return the list of teacher DTOs without registered user
     */
    List<TeacherDTO> getAllTeacherWithoutUser();

    /**
     * Imports teachers from file and saves in the repository.
     *
     * @param file         the file with teachers data
     * @param departmentId the id of the department
     * @return the list of imported teachers with status
     */
    List<TeacherImportDTO> saveFromFile(MultipartFile file, Long departmentId);

    /**
     * Saves given teacher with given department id.
     *
     * @param departmentId the id of the department
     * @param teacher      the teacher import DTO
     * @return the saved teacher import DTO
     */
    TeacherImportDTO saveTeacher(Long departmentId, TeacherImportDTO teacher);

    /**
     * Removes user association from teacher by user id.
     *
     * @param userId the id of the user
     * @throws com.softserve.exception.EntityNotFoundException if teacher not found
     */
    void removeUserFromTeacher(Long userId);

    /**
     * Returns user data for teacher by user id.
     *
     * @param userId the id of the user
     * @return the user data DTO or null if teacher not found
     */
    UserDataDTO getUserDataByUserId(Long userId);
}
