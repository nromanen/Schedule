package com.softserve.service.mapper;

import com.softserve.dto.AddWishesDTO;
import com.softserve.dto.TeacherWishesDTO;
import com.softserve.dto.WishesWithTeacherDTO;
import com.softserve.entity.TeacherWishes;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TeacherWishesMapper {
    TeacherWishesDTO teacherWishesToTeacherWishesDTO(TeacherWishes teacherWishes);
    TeacherWishes teacherWishesDTOToTeacherWishes(TeacherWishesDTO teacherWishesDTO);

    TeacherWishes addTeacherWishesDTOToTeacherWishes(AddWishesDTO addWishesDTO);

    List<WishesWithTeacherDTO> teacherWishesDTOsToTeacherWishes(List<TeacherWishes> teacherWishes);




}
