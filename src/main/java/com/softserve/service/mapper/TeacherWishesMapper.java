package com.softserve.service.mapper;

import com.softserve.dto.AddWishesDTO;
import com.softserve.dto.TeacherWishesDTO;
import com.softserve.entity.TeacherWishes;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TeacherWishesMapper {
    TeacherWishesDTO teacherWishesToTeacherWishesDTO(TeacherWishes teacherWishes);
    TeacherWishes teacherWishesDTOToTeacherWishes(TeacherWishesDTO teacherWishesDTO);

    TeacherWishes addTeacherWishesDTOToTeacherWishes(AddWishesDTO addWishesDTO);

}
