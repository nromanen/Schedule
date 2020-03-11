package com.softserve.service.impl;


import com.softserve.entity.Employee;
import com.softserve.repository.EmployeeRepository;
import com.softserve.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public Optional<Employee> getById(Long id) {
        return employeeRepository.findById(id);
    }

    @Override
    public List<Employee> getAll() {
        return employeeRepository.getAll();
    }

    @Override
    public Employee save(Employee object) {
        return employeeRepository.save(object);
    }

    @Override
    public Employee update(Employee object) {
        return employeeRepository.update(object);
    }

    @Override
    public Employee delete(Employee object) {
        return employeeRepository.delete(object);
    }
}