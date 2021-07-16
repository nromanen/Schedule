package com.softserve.controller;

import com.softserve.dto.DepartmentDTO;
import com.softserve.entity.Department;
import com.softserve.mapper.DepartmentMapper;
import com.softserve.service.DepartmentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/departments")
@Api(tags = "Department API")
@Slf4j
public class DepartmentController {
    private final DepartmentService service;
    private final DepartmentMapper mapper;

    @GetMapping
    @ApiOperation(value = "Get the list of all departments")
    public ResponseEntity<List<DepartmentDTO>> list() {
        log.info("In list ()");
        List<Department> departments = service.getAll();
        return ResponseEntity.status(HttpStatus.OK)
                .body(mapper.departmentsToDepartmentDTOs(departments));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get departmentDTO info by id")
    public ResponseEntity<DepartmentDTO> get(@PathVariable("id") long id) {
        log.info("In get(id = [{}])", id);
        Department department = service.getById(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(mapper.departmentToDepartmentDTO(department));
    }

    @PostMapping
    @ApiOperation(value = "Create new department")
    public ResponseEntity<DepartmentDTO> save(@RequestBody DepartmentDTO departmentDTO) {
        log.info("In save (departmentDTO = [{}])", departmentDTO);
        Department department = service.save(mapper.departmentDTOToDepartment(departmentDTO));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapper.departmentToDepartmentDTO(department));
    }

    @PutMapping
    @ApiOperation(value = "Update existing department")
    public ResponseEntity<DepartmentDTO> update(@RequestBody DepartmentDTO departmentDTO) {
        log.info("In update (departmentDTO = [{}])", departmentDTO);
        Department department = service.update(mapper.departmentDTOToDepartment(departmentDTO));
        return ResponseEntity.status(HttpStatus.OK)
                .body(mapper.departmentToDepartmentDTO(department));
    }

    @DeleteMapping("{id}")
    @ApiOperation(value = "Delete department by id")
    public ResponseEntity<DepartmentDTO> delete(@PathVariable("id") long id) {
        log.info("In delete (id =[{}]", id);
        Department department = service.delete(service.getById(id));
        return ResponseEntity.status(HttpStatus.OK)
                .body(mapper.departmentToDepartmentDTO(department));
    }

    @GetMapping("/disabled")
    @ApiOperation(value = "Get the list of disabled departments")
    public ResponseEntity<List<DepartmentDTO>> getDisabled() {
        log.info("Enter into getDisabled");
        List<Department> departments = service.getDisabled();
        return ResponseEntity.status(HttpStatus.OK)
                .body(mapper.departmentsToDepartmentDTOs(departments));
    }
}