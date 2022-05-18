package com.softserve.repository;

import com.softserve.entity.Department;
import com.softserve.entity.Teacher;

import java.util.List;

public interface DepartmentRepository extends BasicRepository<Department, Long> {

    /**
     * The method used for finding out if name exists
     *
     * @param name String name used to find Department
     * @return boolean : if exists - true, else - false
     */
    boolean isExistsByName(String name);

    /**
     * The method used for finding out if name exists ignoring id
     *
     * @param name String name used to find Department
     * @param id   Long id
     * @return boolean : if exists - true, else - false
     */
    boolean isExistsByNameIgnoringId(String name, Long id);

    /**
     * The method used for getting all teachers from the Department
     *
     * @param departmentId id of the department
     * @return list of teachers
     */
    List<Teacher> getAllTeachers(Long departmentId);
}
