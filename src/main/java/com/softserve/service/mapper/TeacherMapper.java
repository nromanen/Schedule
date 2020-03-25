package com.softserve.service.mapper;

import com.softserve.dto.TeacherDTO;
import com.softserve.entity.Teacher;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TeacherMapper {
    TeacherDTO teacherToTeacherDTO(Teacher group);
    Teacher teacherDTOToTeacher(TeacherDTO teacherDTO);

    List<TeacherDTO> teachersToTeacherDTOs(List<Teacher> teachers);

}
