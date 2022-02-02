package com.softserve.mapper;

import com.softserve.dto.TeacherNameDTO;
import com.softserve.entity.Teacher;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TeacherNameMapper {
    TeacherNameDTO teacherDTOToTeacher(Teacher teacher);
    Teacher teacherToTeacherDTO(TeacherNameDTO teacherNameDTO);
}
