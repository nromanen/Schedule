package com.softserve.service.mapper;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherMapperWishDTO;
import com.softserve.dto.TeacherWishDTO;
import com.softserve.entity.Teacher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TeacherMapper {
    TeacherDTO teacherToTeacherDTO(Teacher teacher);
    Teacher teacherDTOToTeacher(TeacherDTO teacherDTO);


    TeacherWishDTO toTeacherWithWishesDTOs(Teacher teacher);

    List<TeacherMapperWishDTO> toTeacherWithWishesDTOs(List<Teacher> teachers);
    List<TeacherDTO> teachersToTeacherDTOs(List<Teacher> teachers);
}
