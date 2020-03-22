package com.softserve.service.mapper;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.LessonInfoDTO;
import com.softserve.dto.SubjectDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Lesson;
import com.softserve.entity.Subject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LessonInfoMapper {

//    @Mapping(target = "group", source = "group")
//    @Mapping(target = "subject", source = "subject")
//    @Mapping(target = "teacher", source = "teacher")
    LessonInfoDTO lessonToLessonInfoDTO(Lesson lesson);
    Lesson LessonInfoDTOToLesson(LessonInfoDTO lessonInfoDTO);

    List<LessonInfoDTO> lessonsToLessonInfoDTOs(List<Lesson> lessons);

}
