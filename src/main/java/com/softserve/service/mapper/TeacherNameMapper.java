package com.softserve.service.mapper;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.TeacherNameDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Lesson;
import com.softserve.entity.Teacher;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TeacherNameMapper {


   // @Mapping(target = "teacher", expression = "java(teacher.getName())")
    TeacherNameDTO teacherNameToTeacherDTO(Teacher teacher);

    Teacher teacherDTOToTeacherName(TeacherNameDTO teacherNameDTO);


}
