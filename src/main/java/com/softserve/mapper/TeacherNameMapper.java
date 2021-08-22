package com.softserve.mapper;

import com.softserve.dto.TeacherDTO;
import com.softserve.entity.Teacher;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TeacherNameMapper {
    TeacherDTO teacherDTOToTeacher(Teacher teacher);
    Teacher teacherToTeacherDTO(TeacherDTO teacherNameDTO);
}
