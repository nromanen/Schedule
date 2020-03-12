package com.softserve.repository.impl;


import com.softserve.entity.Car;
import com.softserve.repository.CarRepository;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;


@Repository
public class CarRepositoryImpl extends BasicRepositoryImpl<Car, Long> implements CarRepository {
}
