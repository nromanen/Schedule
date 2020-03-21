package com.softserve.service.mapper;

import com.softserve.dto.TeacherDTO;
import com.softserve.entity.Teacher;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TeacherMapper {
    TeacherDTO toTeacherDTO(Teacher teacher);

    List<TeacherDTO> toTeacherDTOs(List<Teacher> teachers);
    Teacher toTeacher(TeacherDTO teacherDTO);

}
