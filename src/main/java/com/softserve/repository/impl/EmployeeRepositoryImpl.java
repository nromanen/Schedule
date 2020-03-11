package com.softserve.repository.impl;

import com.softserve.entity.Employee;
import com.softserve.repository.EmployeeRepository;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;


@Repository
public class EmployeeRepositoryImpl extends BasicRepositoryImpl<Employee, Long> implements EmployeeRepository {

    public EmployeeRepositoryImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }
}
