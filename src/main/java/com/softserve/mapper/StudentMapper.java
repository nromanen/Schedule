package com.softserve.mapper;

import com.softserve.dto.StudentDTO;
import com.softserve.dto.StudentImportDTO;
import com.softserve.entity.Student;
import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;
import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface StudentMapper {
    Student convertToEntity(StudentDTO studentDTO);

    StudentDTO convertToDTO(Student student);

    List<StudentDTO> convertToDTOList(List<Student> studentList);

    
    Student studentDTOToStudent(StudentDTO studentDTO);

    Student studentImportDTOToStudent(StudentImportDTO student);

    StudentImportDTO studentToStudentImportDTO(Student registeredStudent1);
}
