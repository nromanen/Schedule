package com.softserve.service;

import com.softserve.entity.Department;
import com.softserve.entity.Teacher;

import java.util.List;

public interface DepartmentService extends BasicService<Department, Long> {

    /**
     * The method returns all disabled departments
     *
     * @return list of disabled departments
     */
    List<Department> getDisabled();

    /**
     * The method returns all teachers from the Department
     *
     * @param departmentId id of the department
     * @return list of teachers
     */
    List<Teacher> getAllTeachers(Long departmentId);
}
