package com.softserve.service.mapper;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherWishDTO;
import com.softserve.entity.Teacher;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TeacherMapper {
    TeacherDTO teacherToTeacherDTO(Teacher teacher);
    Teacher teacherDTOToTeacher(TeacherDTO teacherDTO);


    TeacherWishDTO toTeacherWithWishesDTOs(Teacher teacher);

    List<TeacherWishDTO> toTeacherWithWishesDTOs(List<Teacher> teachers);
    List<TeacherDTO> teachersToTeacherDTOs(List<Teacher> teachers);
}
