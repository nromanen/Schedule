package com.softserve.service.impl;

import com.opencsv.bean.CsvToBeanBuilder;
import com.softserve.entity.Student;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.StudentRepository;
import com.softserve.service.StudentService;
import com.softserve.util.NullAwareBeanUtils;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.beanutils.BeanUtilsBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
        Student student = studentRepository.getById(id);
        if (Objects.isNull(student)) {
            throw new EntityNotFoundException(Student.class, "id", id.toString());
        }
        return student;
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
        return saveToDatabase(object);
    }

    private Student saveToDatabase(Student object) {
        log.info("Enter into save method with entity:{}", object);
        Student foundStudent = getByEmail(object.getEmail());
        if (Objects.nonNull(foundStudent)) {
            throw new FieldAlreadyExistsException(Student.class, "email", object.getEmail());
        }
        return studentRepository.save(object);
    }

    /**
     * Method updates information for an existing Student in Repository
     *
     * @param object Student entity with info to be updated
     * @return updated Student entity
     */
    @SneakyThrows
    @Transactional
    @Override
    public Student update(Student object) {
        log.info("Enter into update method with entity:{}", object);
        BeanUtilsBean beanUtils = new NullAwareBeanUtils();
        Student foundStudent = getById(object.getId());
        beanUtils.copyProperties(foundStudent, object);
        return studentRepository.update(foundStudent);
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
        return studentRepository.delete(getById(object.getId()));
    }

    /**
     * Method finds an existing Student by his email from Repository
     *
     * @param email String email of Student for search
     * @return target Student
     */
    @Transactional(readOnly = true)
    @Override
    public Student getByEmail(String email) {
        log.info("Enter into findByEmail method with email:{}", email);
        return studentRepository.findByEmail(email);
    }

    /**
     * Method finds an existing Student by his userId from Repository
     *
     * @param userId Long userId that Student might has
     * @return target Student
     */
    @Transactional(readOnly = true)
    @Override
    public Student getByUserId(Long userId) {
        log.info("Enter into getByUserId method with UserId {}", userId);
        return studentRepository.findByUserId(userId);
    }

    /**
     * The method used for importing students from csv file.
     * Each line of the file should consist of one or more fields, separated by commas.
     * Each field may or may not be enclosed in double-quotes.
     * First line of the file is a header.
     * All subsequent lines contain data about students, i.e.:
     *
     * "surname","name","patronymic","email"
     * "Romaniuk","Hanna","Stepanivna","romaniuk@gmail.com"
     * "Boichuk","Oleksandr","Ivanovych","boichuk@ukr.net"
     *  etc.
     *
     * @param file file with students data
     * @return list of created students
     * @throws IOException if error happens while creating or deleting file
     */
    @Override
    @Transactional(readOnly = true, propagation = Propagation.NOT_SUPPORTED)
    public List<Student> saveFromFile(MultipartFile file, Long groupId) throws IOException {
        log.info("Enter into saveFromFile of StudentServiceImpl");

        String fileName = String.join("","students_group",
                String.valueOf(groupId),"_",String.valueOf(LocalDateTime.now().getNano()),".csv");

        File csvFile = new File(fileName);
        file.transferTo(csvFile);
        Reader reader = new FileReader(csvFile, StandardCharsets.UTF_8);

        List<Student> students = new ArrayList<>();

        try {
            students = new CsvToBeanBuilder<Student>(reader)
                    .withType(Student.class)
                    .build().parse();
        } catch (RuntimeException e) {
            log.error("Error occurred while parsing file {}", file.getOriginalFilename(), e);
        }

        List<Student> savedStudents = new ArrayList<>();

        for (Student student : students) {
            try {
                student.getGroup().setId(groupId);
                savedStudents.add(saveToDatabase(student));
            } catch (RuntimeException e) {
                log.error("Error occurred while saving student with email {}", student.getEmail(), e);
            }
        }
        reader.close();
        Files.delete(csvFile.toPath());
        return savedStudents;
    }
}
