package com.softserve.mapper;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.StudentDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Student;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface GroupMapper {

    @Mapping(target = "students", source = "students", qualifiedByName = "toStudentsDto")
    GroupDTO convertToDto(Group group);
    Group convertToEntity(GroupDTO groupDTO);

    List<GroupDTO> convertListToDtoList(List<Group> groups);

    @Named("toStudentsDto")
    default List<StudentDTO> toStudentsDto(List<Student> studentList) {
        return studentList.stream().map(this::toStudentDto).collect(Collectors.toList());
    }

    default StudentDTO toStudentDto(Student student) {
        return StudentDTO.builder()
                .id(student.getId())
                .email(student.getEmail())
                .name(student.getName())
                .surname(student.getSurname())
                .patronymic(student.getPatronymic())
                .userId(student.getUserId())
                .build();
    }

}
