package com.softserve.controller;

import com.softserve.dto.StudentDTO;
import com.softserve.dto.StudentForUpdateListDTO;
import com.softserve.dto.StudentWithoutGroupDTO;
import com.softserve.entity.Student;
import com.softserve.mapper.StudentMapper;
import com.softserve.service.StudentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@Api(tags = "Student API")
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;
    private final StudentMapper studentMapper;

    @Autowired
    public StudentController(StudentService studentService, StudentMapper studentMapper) {
        this.studentService = studentService;
        this.studentMapper = studentMapper;
    }

    @GetMapping
    @ApiOperation(value = "Get list of all students")
    public ResponseEntity<List<StudentDTO>> getAll() {
        log.info("Enter into getAll of StudentController");
        return ResponseEntity.status(HttpStatus.OK).body(studentMapper.convertToDTOList(studentService.getAll()));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get student by id")
    public ResponseEntity<StudentDTO> getById(@PathVariable("id") long id) {
        log.info("Enter into getById of StudentController with id {} ", id);
        return ResponseEntity.status(HttpStatus.OK).body(studentMapper.convertToDTO(studentService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    @ApiOperation(value = "Create new student")
    public ResponseEntity<StudentDTO> save(@RequestBody StudentDTO studentDTO) {
        log.info("Enter into save of StudentController with studentDTO = [{}] ", studentDTO);
        Student savedStudent = studentService.save(studentMapper.convertToEntity(studentDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(studentMapper.convertToDTO(savedStudent));
    }

    @PutMapping
    @PreAuthorize("hasRole('MANAGER')")
    @ApiOperation(value = "Update existing student")
    public ResponseEntity<StudentDTO> update(@RequestBody StudentDTO studentDTO) {
        log.info("Enter into update of StudentController with studentDTO = [{}] ", studentDTO);
        Student updatedStudent = studentService.update(studentMapper.convertToEntity(studentDTO));
        return ResponseEntity.status(HttpStatus.OK).body(studentMapper.convertToDTO(updatedStudent));
    }

    @PutMapping("/move-to-group")
    @PreAuthorize("hasRole('MANAGER')")
    @ApiOperation(value = "Update List of students")
    public ResponseEntity<List<StudentDTO>> updateList(@RequestBody StudentForUpdateListDTO studentsForUpdateDTO) {
        log.info("Enter into update of StudentController with studentDTO = [{}] ", studentsForUpdateDTO);
        studentService.updateStudentList(studentsForUpdateDTO);
        List<StudentDTO> updatedStudents = new ArrayList<>();
        for (StudentWithoutGroupDTO students : studentsForUpdateDTO.getStudentsWithoutGroupDTOList()) {
            updatedStudents.add(studentMapper.convertToDTO(studentService.getById(students.getId())));
        }
        return ResponseEntity.status(HttpStatus.OK).body(updatedStudents);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    @ApiOperation(value = "Delete student by id")
    public ResponseEntity<Void> delete(@PathVariable("id") long id){
        log.info("Enter into delete of StudentController with id {} ", id);
        studentService.delete(studentService.getById(id));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/import")
    @ApiOperation(value = "import students from file to database")
    public ResponseEntity<List<StudentDTO>> importFromCsv(@ApiParam(value = "csv or txt format is required")
            @RequestParam("file") MultipartFile file, @RequestParam Long groupId) {
        return ResponseEntity.ok(studentMapper.convertToDTOList(studentService.saveFromFile(file, groupId)
                .getNow(new ArrayList<>())));
    }
}
