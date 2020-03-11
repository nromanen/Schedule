package com.softserve.controller;


import com.softserve.entity.Employee;
import com.softserve.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/employee")
public class EmployeeController {

    private final EmployeeService employeeServiceImpl;

    @Autowired
    public EmployeeController(EmployeeService employeeServiceImpl) {
        this.employeeServiceImpl = employeeServiceImpl;
    }


    @GetMapping
    public ResponseEntity<?> list() {
        List<Employee> employees = employeeServiceImpl.getAll();
        return ResponseEntity.ok().body(employees);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable("id") long id) {
        Employee employee = employeeServiceImpl.getById(id).get();
        return ResponseEntity.ok().body(employee);
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody Employee employee) {
        long id = employeeServiceImpl.save(employee).getId();
        return ResponseEntity.ok().body("New Employee has been saved with ID:" + id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable("id") long id, @RequestBody Employee employee) {
        employeeServiceImpl.update(employee);
        return ResponseEntity.ok().body("Employee has been updated successfully.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        employeeServiceImpl.delete(employeeServiceImpl.getById(id).get());
        return ResponseEntity.ok().body("Employee has been deleted successfully.");
    }
}
