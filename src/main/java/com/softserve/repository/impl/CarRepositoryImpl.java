package com.softserve.repository.impl;


import com.softserve.repository.CarRepository;
import org.springframework.stereotype.Repository;


@Repository
public class CarRepositoryImpl extends BasicRepositoryImpl<Car, Long> implements CarRepository {
}
