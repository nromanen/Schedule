package com.softserve.mapper;

import com.softserve.dto.LessonInfoDTO;
import com.softserve.entity.Lesson;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LessonInfoMapper {
    LessonInfoDTO lessonToLessonInfoDTO(Lesson lesson);
    Lesson lessonInfoDTOToLesson(LessonInfoDTO lessonInfoDTO);

    List<LessonInfoDTO> lessonsToLessonInfoDTOs(List<Lesson> lessons);

}
