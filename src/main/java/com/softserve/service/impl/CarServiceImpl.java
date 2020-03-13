package com.softserve.service.impl;

import com.softserve.repository.CarRepository;
import com.softserve.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class CarServiceImpl implements CarService {


    private final CarRepository carRepository;

    @Autowired
    public CarServiceImpl(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @Override
    public Optional<Car> getById(Long id) {
        return carRepository.findById(id);
    }

    @Override
    public List<Car> getAll() {
        return carRepository.getAll();
    }

    @Override
    public Car save(Car object) {
        return carRepository.save(object);
    }

    @Override
    public Car update(Car object) {
        return carRepository.update(object);
    }

    @Override
    public Car delete(Car object) {
        return carRepository.delete(object);
    }
}
