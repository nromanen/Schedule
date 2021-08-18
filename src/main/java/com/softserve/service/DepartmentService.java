package com.softserve.service;

import com.softserve.entity.Department;
import com.softserve.entity.Teacher;

import java.util.List;

public interface DepartmentService extends BasicService<Department, Long> {
    List<Department> getDisabled();
    List<Teacher> getAllTeachers(Long departmentId);
}
