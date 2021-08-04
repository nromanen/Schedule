package com.softserve.mapper;

import com.softserve.dto.TeacherForUpdateDTO;
import org.apache.commons.lang3.StringUtils;
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
    TeacherForUpdateDTO teacherToTeacherForUpdateDTO(Teacher teacher);
    Teacher teacherForUpdateDTOToTeacher(TeacherForUpdateDTO teacherForUpdateDTO);

    TeacherWithUserDTO toTeacherWithUserDTO(Teacher teacher);

    TeacherWishDTO toTeacherWithWishesDTOs(Teacher teacher);

    List<TeacherWishDTO> toTeacherWithWishesDTOs(List<Teacher> teachers);
    List<TeacherDTO> teachersToTeacherDTOs(List<Teacher> teachers);

    static String teacherDTOToTeacherForSite(TeacherDTO teacherDTO) {
        return StringUtils.join(
                teacherDTO.getPosition()
                , " "
                , teacherDTO.getSurname()
                , " "
                , teacherDTO.getName().charAt(0)
                , ". "
                , teacherDTO.getPatronymic().charAt(0)
                , "."
        );
    }
}
