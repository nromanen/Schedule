package com.softserve.repository.impl;

import com.softserve.repository.EmployeeRepository;
import org.springframework.stereotype.Repository;


@Repository
public class EmployeeRepositoryImpl extends BasicRepositoryImpl<Employee, Long> implements EmployeeRepository {
}
