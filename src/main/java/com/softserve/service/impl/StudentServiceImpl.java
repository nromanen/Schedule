package com.softserve.service.impl;

import com.softserve.entity.Group;
import com.softserve.entity.Student;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.StudentRepository;
import com.softserve.service.GroupService;
import com.softserve.service.StudentService;
import com.softserve.util.NullAwareBeanUtils;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.beanutils.BeanUtilsBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Slf4j
@Transactional
@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final GroupService groupService;

    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository, GroupService groupService) {
        this.studentRepository = studentRepository;
        this.groupService = groupService;
    }

    /**
     * The method used for getting Student by id
     *
     * @param id Identity Student id
     * @return target Student
     * @throws EntityNotFoundException if Student doesn't exist
     */
    @Override
    public Student getById(Long id) {
        log.info("Enter into getById method with id {}", id);
        return studentRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Student.class, "id", id.toString()));
    }

    /**
     * Method gets information about Students from Repository
     *
     * @return List of all Students
     */
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
     */
    @Override
    public Student save(Student object) {
        log.info("Enter into save method with entity:{}", object);
        Student foundStudent = getByEmail(object.getEmail());
        if (Objects.nonNull(foundStudent)) {
            throw new FieldAlreadyExistsException(Student.class, "email", object.getEmail());
        }
        ifGroupExist(object.getGroup().getId());
        return studentRepository.save(object);
    }

    /**
     * Method updates information for an existing Student in Repository
     *
     * @param object Student entity with info to be updated
     * @return updated Student entity
     */
    @SneakyThrows
    @Override
    public Student update(Student object) {
        log.info("Enter into update method with entity:{}", object);
        BeanUtilsBean beanUtils = new NullAwareBeanUtils();
        if (Objects.isNull(object)) {
            throw new NullPointerException("Student for update is null.");
        }
        Student foundStudent = getById(object.getId());
        ifGroupExist(object.getGroup().getId());
        beanUtils.copyProperties(foundStudent, object);
        return studentRepository.update(foundStudent);
    }

    /**
     * Method deletes an existing Student from Repository
     *
     * @param object Student entity to be deleted
     * @return deleted Student entity
     */
    @Override
    public Student delete(Student object) {
        log.info("Enter into delete method with entity:{}", object);
        return studentRepository.delete(object);
    }

    /**
     * Method finds an existing Student by his email from Repository
     *
     * @param email String email of Student for search
     * @return target Student
     */
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
    @Override
    public Student getByUserId(Long userId) {
        log.info("Enter into getByUserId method with UserId {}", userId);
        return studentRepository.findByUserId(userId);
    }

    /*----------*/
    /**
     * Method checks if Student's Group exists
     *
     * @param id Long Student's Group id
     * @throws EntityNotFoundException if Group doesn't exist
     */
    @Override
    public void ifGroupExist(Long id) {
        log.info("Enter into ifGroupExist method with GroupId {}", id);
        if (!groupService.isExistsWithId(id)) {
            throw new EntityNotFoundException(Group.class, "id", id.toString());
        }
    }
}
