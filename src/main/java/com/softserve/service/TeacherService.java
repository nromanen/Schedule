package com.softserve.service;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import com.softserve.dto.TeacherImportDTO;
import com.softserve.entity.Teacher;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldNullException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TeacherService extends BasicService<Teacher, Long> {

    /**
     * Method save information for teacher in Repository and register user if email exists
     *
     * @param teacherDTO TeacherDTO instance
     * @return saved Teacher entity
     */
    Teacher save(TeacherDTO teacherDTO);

    /**
     * Method updates information for an existing teacher in Repository and register user if email was added
     *
     * @param teacherForUpdateDTO TeacherForUpdateDTO instance with info to be updated
     * @return updated Teacher entity
     */
    Teacher update(TeacherForUpdateDTO teacherForUpdateDTO);

    /**
     * The method used for join Teacher and User
     *
     * @param teacherId Long teacherId used to find Teacher by it
     * @param userId    Long userId used to find User by it
     * @return Teacher entity
     * @throws EntityAlreadyExistsException when user already exist in some teacher/manager or teacher contains some userId
     */
    Teacher joinTeacherWithUser(Long teacherId, Long userId);

    /**
     * The method used for getting all disabled teachers
     *
     * @return list of disabled teachers
     */
    List<Teacher> getDisabled();

    /**
     * The method used for getting teacher by userId
     *
     * @param userId Identity user id
     * @return Teacher entity
     * @throws EntityNotFoundException if teacher doesn't exist
     * @throws FieldNullException      if userId is null
     */
    Teacher findByUserId(Long userId);

    /**
     * The method used for getting list of teachers from database, that don't registered in system
     *
     * @return list of entities User
     */
    List<Teacher> getAllTeacherWithoutUser();

    /**
     * Each line of the file should consist of five fields, separated by commas without spaceBar.
     * First line of the file is a header.
     * All subsequent lines contain data about teachers.
     * <p>
     * name,surname,patronymic,position,email
     * Test1,Test1,Test1,test1,test1@gmail.com
     * Test2,Test2,Test2,test2,test2@gmail.com
     * etc.
     *
     * @param file file with teachers data
     * @return list of created teachers.
     */
    List<TeacherImportDTO> saveFromFile(MultipartFile file, Long departmentId);

    TeacherImportDTO saveTeacher(Long departmentId, TeacherImportDTO teacher);
}

