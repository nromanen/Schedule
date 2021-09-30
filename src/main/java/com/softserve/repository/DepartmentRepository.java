package com.softserve.repository;

import com.softserve.entity.Department;
import com.softserve.entity.Teacher;

import java.util.List;

public interface DepartmentRepository extends BasicRepository<Department, Long> {
    boolean isExistsByName(String name);

    boolean isExistsByNameIgnoringId(String name, Long id);

    List<Teacher> getAllTeachers(Long departmentId);
}
