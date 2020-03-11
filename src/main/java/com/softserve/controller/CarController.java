package com.softserve.controller;

import com.softserve.entity.Car;
import com.softserve.service.impl.CarServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CarController {

    final CarServiceImpl carServiceImpl;

    @Autowired
    public CarController(CarServiceImpl carServiceImpl) {
        this.carServiceImpl = carServiceImpl;
    }


    @GetMapping("/car")
    public ResponseEntity<List<Car>> list() {
        List<Car> cars = carServiceImpl.getAll();
        return ResponseEntity.ok().body(cars);
    }

    @GetMapping("/car/{id}")
    // @ApiImplicitParam(name = "id", value = "Car ID", required = true, dataType = "long", paramType = "query")
    public ResponseEntity<Car> get(@PathVariable("id") long id) {
        Car car = carServiceImpl.getById(id).get();
        return ResponseEntity.ok().body(car);
    }

    @PostMapping("/car")
    public ResponseEntity<?> save(@RequestBody Car car) {
        long id = carServiceImpl.save(car).getId();
        return ResponseEntity.ok().body("New Car has been saved with ID:" + id);
    }

    @PutMapping("/car/{id}")
    public ResponseEntity<?> update(@PathVariable("id") long id, @RequestBody Car car) {
        carServiceImpl.update(car);
        return ResponseEntity.ok().body("Car has been updated successfully.");
    }

    @DeleteMapping("/car/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        carServiceImpl.delete(carServiceImpl.getById(id).get());
        return ResponseEntity.ok().body("Car has been deleted successfully.");
    }
}
