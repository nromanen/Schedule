package com.softserve.repository.impl;

import com.softserve.entity.Employee;
import com.softserve.repository.EmployeeRepository;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class EmployeeRepositoryImpl extends BasicRepositoryImpl<Employee, Long> implements EmployeeRepository {
    public EmployeeRepositoryImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }
}
