package com.softserve.service.impl;

import com.softserve.entity.Student;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.StudentRepository;
import com.softserve.service.StudentService;
import com.softserve.util.AsyncTasks;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintViolationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;

    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * The method used for getting Student by id
     *
     * @param id Identity Student id
     * @return target Student
     * @throws EntityNotFoundException if Student with id doesn't exist
     */
    @Transactional(readOnly = true)
    @Override
    public Student getById(Long id) {
        log.info("Enter into getById method with id {}", id);
        return studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Student.class, "id", id.toString()));
    }

    /**
     * Method gets information about Students from Repository
     *
     * @return List of all Students
     */
    @Transactional(readOnly = true)
    @Override
    public List<Student> getAll() {
        log.info("Enter into getAll method with no input params");
        return studentRepository.getAll();
    }

    /**
     * Method creates new Student in Repository
     *
     * @param object Student entity with info to be created
     * @return created Student entity
     * @throws FieldAlreadyExistsException if Student with input email already exists
     */
    @Transactional
    @Override
    public Student save(Student object) {
        log.info("Enter into save method with entity:{}", object);
        checkEmailForUniqueness(object.getEmail());
        return studentRepository.save(object);
    }

    /**
     * Method updates information for an existing Student in Repository
     *
     * @param object Student entity with info to be updated
     * @return updated Student entity
     * @throws FieldAlreadyExistsException if Student with input email already exists
     */
    @SneakyThrows
    @Transactional
    @Override
    public Student update(Student object) {
        log.info("Enter into update method with entity:{}", object);
        checkEmailForUniquenessIgnoringId(object.getEmail(), object.getId());
        return studentRepository.update(object);
    }

    /**
     * Method deletes an existing Student from Repository
     *
     * @param object Student entity to be deleted
     * @return deleted Student entity
     */
    @Transactional
    @Override
    public Student delete(Student object) {
        log.info("Enter into delete method with entity:{}", object);
        return studentRepository.delete(object);
    }

    /**
     * The method used for importing students from csv file.
     * Each line of the file should consist of four fields, separated by commas.
     * Each field may or may not be enclosed in double-quotes.
     * First line of the file is a header.
     * All subsequent lines contain data about students.
     * <p>
     * "surname","name","patronymic","email"
     * "Romaniuk","Hanna","Stepanivna","romaniuk@gmail.com"
     * "Boichuk","Oleksandr","Ivanovych","boichuk@ukr.net"
     * etc.
     * <p>
     * The method is not transactional in order to prevent interruptions while saving a student
     *
     * @param file file with students data
     * @return list of created students.
     * If the student in the returned list have a non-null value of the group title then he already existed.
     * If the student in the returned list have a null value of the group title then he saved as a new student.
     * If the student in the returned list have a null value of the group then he didn't pass a validation.
     * @throws IOException if error happens while creating or deleting file
     */
    @Override
    @Transactional(readOnly = true, propagation = Propagation.NOT_SUPPORTED)
    public List<Student> saveFromFile(MultipartFile file, Long groupId) throws IOException {
        log.info("Enter into saveFromFile of StudentServiceImpl");

        List<Student> students = AsyncTasks.getStudentsFromFile(file);

        List<Student> savedStudents = new ArrayList<>();

        for (Student student : students) {
            try {
                Optional<Student> studentOptional = studentRepository.findByEmail(student.getEmail());
                if (studentOptional.isEmpty()) {
                    student.getGroup().setId(groupId);
                    savedStudents.add(studentRepository.save(student));
                } else {
                    savedStudents.add(studentOptional.get());
                    log.error("Error occurred while saving student", new FieldAlreadyExistsException(Student.class, "email", student.getEmail()));
                }
            } catch (ConstraintViolationException e) {
                log.error("Error occurred while saving student with email {}", student.getEmail(), e);
                student.setGroup(null);
                savedStudents.add(student);
            }
        }
        return savedStudents;
    }

    private void checkEmailForUniqueness(String email) {
        if(studentRepository.isExistsByEmail(email)) {
            throw new FieldAlreadyExistsException(Student.class, "email", email);
        }
    }

    private void checkEmailForUniquenessIgnoringId(String email, Long id) {
        if(studentRepository.isExistsByEmailIgnoringId(email, id)) {
            throw new FieldAlreadyExistsException(Student.class, "email", email);
        }
    }

}