package com.softserve.service.mapper;

import com.softserve.dto.TeacherNameDTO;
import com.softserve.entity.Teacher;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TeacherNameMapper {

    TeacherNameDTO teacherNameToTeacherDTO(Teacher teacher);
    Teacher teacherDTOToTeacherName(TeacherNameDTO teacherNameDTO);
}
