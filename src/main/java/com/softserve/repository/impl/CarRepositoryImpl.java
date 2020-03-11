package com.softserve.repository.impl;


import com.softserve.entity.Car;
import com.softserve.repository.CarRepository;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class CarRepositoryImpl extends BasicRepositoryImpl<Car, Long> implements CarRepository {

    public CarRepositoryImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }
}
