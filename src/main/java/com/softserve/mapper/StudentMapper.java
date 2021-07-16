package com.softserve.mapper;

import com.softserve.dto.StudentDTO;
import com.softserve.entity.Student;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    StudentDTO convertToDTO(Student student);
    Student convertToEntity(StudentDTO studentDTO);


    List<StudentDTO> convertToDTOList(List<Student> studentList);
    List<Student> convertToEntityList(List<StudentDTO> studentDTOList);
}
