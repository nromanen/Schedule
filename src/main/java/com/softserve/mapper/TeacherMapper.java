package com.softserve.mapper;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherWithUserDTO;
import com.softserve.dto.TeacherWishDTO;
import com.softserve.entity.Teacher;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TeacherMapper {
    TeacherDTO teacherToTeacherDTO(Teacher teacher);
    Teacher teacherDTOToTeacher(TeacherDTO teacherDTO);

    TeacherWithUserDTO toTeacherWithUserDTO(Teacher teacher);


    TeacherWishDTO toTeacherWithWishesDTOs(Teacher teacher);

    List<TeacherWishDTO> toTeacherWithWishesDTOs(List<Teacher> teachers);
    List<TeacherDTO> teachersToTeacherDTOs(List<Teacher> teachers);
}
