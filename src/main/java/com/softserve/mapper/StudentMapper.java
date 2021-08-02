package com.softserve.mapper;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.StudentDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Student;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface StudentMapper {

    @Mapping(target = "group", source = "group", qualifiedByName = "toGroupDto")
    StudentDTO convertToDTO(Student student);

    Student convertToEntity(StudentDTO studentDTO);

    List<StudentDTO> convertToDTOList(List<Student> studentList);

    List<Student> convertToEntityList(List<StudentDTO> studentDTOList);

    @Named("toGroupDto")
    default GroupDTO toGroupDto(Group group) {
        return GroupDTO.builder()
                .id(group.getId())
                .title(group.getTitle())
//                .students(List.of())
                .build();
    }

}
