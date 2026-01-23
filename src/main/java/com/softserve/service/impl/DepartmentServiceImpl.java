package com.softserve.service.impl;

import com.softserve.dto.DepartmentDTO;
import com.softserve.dto.TeacherDTO;
import com.softserve.entity.Department;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.mapper.DepartmentMapper;
import com.softserve.mapper.TeacherMapper;
import com.softserve.repository.DepartmentRepository;
import com.softserve.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository repository;
    private final DepartmentMapper departmentMapper;
    private final TeacherMapper teacherMapper;

    @Override
    public DepartmentDTO getById(Long id) {
        log.info("In getById(id = [{}])", id);
        Department department = findDepartmentById(id);
        return departmentMapper.departmentToDepartmentDTO(department);
    }

    @Override
    public List<DepartmentDTO> getAll() {
        log.info("In getAll()");
        return departmentMapper.departmentsToDepartmentDTOs(repository.getAll());
    }

    @Override
    @Transactional
    public DepartmentDTO save(DepartmentDTO departmentDTO) {
        log.info("In save(departmentDTO = [{}])", departmentDTO);
        Department department = departmentMapper.departmentDTOToDepartment(departmentDTO);
        checkNameForUniqueness(department.getName());
        Department savedDepartment = repository.save(department);
        return departmentMapper.departmentToDepartmentDTO(savedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDTO update(DepartmentDTO departmentDTO) {
        log.info("In update(departmentDTO = [{}])", departmentDTO);
        Department department = departmentMapper.departmentDTOToDepartment(departmentDTO);
        checkNameForUniquenessIgnoringId(department.getName(), department.getId());
        Department updatedDepartment = repository.update(department);
        return departmentMapper.departmentToDepartmentDTO(updatedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDTO delete(Long id) {
        log.info("In delete(id = [{}])", id);
        Department department = findDepartmentById(id);
        Department deletedDepartment = repository.delete(department);
        return departmentMapper.departmentToDepartmentDTO(deletedDepartment);
    }

    @Override
    public List<DepartmentDTO> getDisabled() {
        log.info("In getDisabled()");
        return departmentMapper.departmentsToDepartmentDTOs(repository.getDisabled());
    }

    @Override
    public List<TeacherDTO> getAllTeachers(Long departmentId) {
        log.info("In getAllTeachers(departmentId = [{}])", departmentId);
        return teacherMapper.teachersToTeacherDTOs(repository.getAllTeachers(departmentId));
    }

    private Department findDepartmentById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Department.class, "id", id.toString()));
    }

    private void checkNameForUniqueness(String name) {
        if (repository.isExistsByName(name)) {
            throw new FieldAlreadyExistsException(Department.class, "name", name);
        }
    }

    private void checkNameForUniquenessIgnoringId(String name, Long id) {
        if (repository.isExistsByNameIgnoringId(name, id)) {
            throw new FieldAlreadyExistsException(Department.class, "name", name);
        }
    }
}
