package com.softserve.repository;

import com.softserve.entity.Department;

public interface DepartmentRepository extends BasicRepository<Department,
                                                              Long> {
    boolean doesNameExist(String name);

    boolean doesNameExistIgnoringId(String name, Long id);
}
