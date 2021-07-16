package com.softserve.service;

import com.softserve.entity.Department;

import java.util.List;

public interface DepartmentService extends BasicService<Department, Long> {
    List<Department> getDisabled();
}
