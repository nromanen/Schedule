package com.softserve.service;

import com.softserve.dto.StudentDTO;
import com.softserve.dto.StudentImportDTO;
import com.softserve.entity.Student;
import com.softserve.exception.FieldAlreadyExistsException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface StudentService extends BasicService<Student, Long> {

    /**
     * Method save information for student in Repository and register user if email exists
     *
     * @param studentDTO StudentDTO instance
     * @return saved Student entity
     */
    Student save(StudentDTO studentDTO);

    /**
     * Method updates information for an existing Student in Repository
     *
     * @param studentDTO Student entity with info to be updated
     * @return updated Student entity
     * @throws FieldAlreadyExistsException if Student with input email already exists
     */
    Student update(StudentDTO studentDTO);

    /**
     * This asynchronous method used for importing students from csv file.
     * Each line of the file should consist of four fields, separated by commas.
     * Each field may or may not be enclosed in double-quotes.
     * First line of the file is a header.
     * All subsequent lines contain data about students.
     * <p>
     * "surname","name","patronymic","email"
     * "Romanian","Hanna","Stepanov","romaniuk@gmail.com"
     * "Bochum","Oleksandr","Ivanov","boichuk@ukr.net"
     * etc.
     * <p>
     * The method is not transactional in order to prevent interruptions while saving a student
     *
     * @param file file with students data
     * @return list of created students.
     * If the student in the returned list have a non-null value of the group title then he already existed.
     * If the student in the returned list have a null value of the group title then he saved as a new student.
     * If the student in the returned list have a null value of the group then he didn't pass a validation.
     */
    CompletableFuture<List<StudentImportDTO>> saveFromFile(MultipartFile file, Long groupId);

}
