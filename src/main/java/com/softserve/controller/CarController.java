package com.softserve.controller;

import com.softserve.service.CarService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Api(tags = "Car API")
public class CarController {

    final private CarService carServiceImpl;

    @Autowired
    public CarController(CarService carServiceImpl) {
        this.carServiceImpl = carServiceImpl;
    }


    @GetMapping("/car")
    @ApiOperation(value = "Get the list of all cars")
    public ResponseEntity<List<Car>> list() {
        List<Car> cars = carServiceImpl.getAll();
        return ResponseEntity.ok().body(cars);
    }

    @GetMapping("/car/{id}")
    @ApiOperation(value = "Get car info by id")
    // @ApiImplicitParam(name = "id", value = "Car ID", required = true, dataType = "long", paramType = "query")
    public ResponseEntity<Car> get(@PathVariable("id") long id) {
        Car car = carServiceImpl.getById(id).get();
        return ResponseEntity.ok().body(car);
    }

    @PostMapping("/car")
    @ApiOperation(value = "Create new car")
    public ResponseEntity<?> save(@RequestBody Car car) {
        long id = carServiceImpl.save(car).getId();
        return ResponseEntity.ok().body("New Car has been saved with ID:" + id);
    }

    @PutMapping("/car/{id}")
    @ApiOperation(value = "Update existing car by id")
    public ResponseEntity<?> update(@PathVariable("id") long id, @RequestBody Car car) {
        carServiceImpl.update(car);
        return ResponseEntity.ok().body("Car has been updated successfully.");
    }

    @DeleteMapping("/car/{id}")
    @ApiOperation(value = "Delete car by id")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        carServiceImpl.delete(carServiceImpl.getById(id).get());
        return ResponseEntity.ok().body("Car has been deleted successfully.");
    }
}
