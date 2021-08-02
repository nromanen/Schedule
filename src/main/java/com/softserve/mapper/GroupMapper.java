package com.softserve.mapper;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.GroupForUpdateDTO;
import com.softserve.entity.Group;
import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface GroupMapper {

//    @Mapping(target = "students", source = "students", qualifiedByName = "toStudentsDto")
    GroupDTO groupToGroupDTO(Group group);
    Group groupDTOToGroup(GroupDTO groupDTO);
    GroupForUpdateDTO groupToGroupForUpdateDTO(Group group);
    Group groupForUpdateDTOToGroup(GroupForUpdateDTO groupForUpdateDTO);


    List<GroupDTO> convertListToDtoList(List<Group> groups);

//    @Named("toStudentsDto")
//    default List<StudentDTO> toStudentsDto(List<Student> studentList) {
//        return studentList.stream().map(this::toStudentDto).collect(Collectors.toList());
//    }

//    default StudentDTO toStudentDto(Student student) {
//        return StudentDTO.builder()
//                .id(student.getId())
//                .email(student.getEmail())
//                .name(student.getName())
//                .surname(student.getSurname())
//                .patronymic(student.getPatronymic())
//                .userId(student.getUserId())
//                .build();
//    }

}
