package com.softserve.repository;

import com.softserve.entity.Department;

public interface DepartmentRepository extends BasicRepository<Department, Long> {
    boolean isNameExists(String name);

    boolean isNameExistsIgnoringId(String name, Long id);
}
