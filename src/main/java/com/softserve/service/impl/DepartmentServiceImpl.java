package com.softserve.service.impl;

import com.softserve.entity.Department;
import com.softserve.entity.Teacher;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.DepartmentRepository;
import com.softserve.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository repository;

    /**
     * The method returns information from Repository for particular department with id parameter
     *
     * @param id Identity number of the department
     * @return Department entity
     */
    @Override
    public Department getById(Long id) {
        log.info("In getById(id = [{}])", id);
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Department.class, "id", id.toString()));
    }

    /**
     * The method returns information about all departments from Repository
     *
     * @return List of all departments
     */
    @Override
    public List<Department> getAll() {
        log.info("In getAll()");
        return repository.getAll();
    }

    /**
     * The method saves new department to Repository
     *
     * @param object Department entity with info to be saved
     * @return saved Department entity
     */
    @Override
    public Department save(Department object) {
        log.info("In save(entity = [{}]", object);
        checkNameForUniqueness(object);
        return repository.save(object);
    }

    /**
     * The method updates information for an existing department in  Repository
     *
     * @param object Department entity with info to be updated
     * @return updated Department entity
     */
    @Override
    public Department update(Department object) {
        log.info("In update(entity = [{}]", object);
        checkNameForUniquenessIgnoringId(object);
        return repository.update(object);
    }

    /**
     * The method deletes an existing department from Repository
     *
     * @param object Department entity to be deleted
     * @return deleted Department entity
     */
    @Override
    public Department delete(Department object) {
        log.info("In delete(entity = [{}])", object);
        return repository.delete(object);
    }

    /**
     * The method returns all disabled departments
     *
     * @return list of disabled departments
     */
    @Override
    public List<Department> getDisabled() {
        log.info("Enter into getAll of getDisabled");
        return repository.getDisabled();
    }

    /**
     * The method returns all teachers from the Department
     *
     * @param departmentId id of the department
     * @return list of teachers
     */
    @Override
    public List<Teacher> getAllTeachers(Long departmentId) {
        log.info("Enter into getAllTeachers with department id {}", departmentId);
        return repository.getAllTeachers(departmentId);
    }

    private void checkNameForUniqueness(Department object) {
        if (repository.isExistsByName(object.getName())) {
            throw new FieldAlreadyExistsException(Department.class, "name", object.getName());
        }
    }

    private void checkNameForUniquenessIgnoringId(Department object) {
        if (repository.isExistsByNameIgnoringId(object.getName(), object.getId())) {
            throw new FieldAlreadyExistsException(Department.class, "name", object.getName());
        }
    }
}
