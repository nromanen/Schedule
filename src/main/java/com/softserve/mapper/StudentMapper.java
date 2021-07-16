package com.softserve.mapper;

import com.softserve.dto.StudentDTO;
import com.softserve.entity.Student;
import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface StudentMapper {
    StudentDTO convertToDTO(Student student);
    Student convertToEntity(StudentDTO studentDTO);


    List<StudentDTO> convertToDTOList(List<Student> studentList);
    List<Student> convertToEntityList(List<StudentDTO> studentDTOList);
}
