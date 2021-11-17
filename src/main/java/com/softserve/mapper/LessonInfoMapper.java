package com.softserve.mapper;

import com.softserve.dto.LessonDTO;
import com.softserve.dto.LessonForGroupsDTO;
import com.softserve.dto.LessonInfoDTO;
import com.softserve.dto.LessonWithLinkDTO;
import com.softserve.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public abstract class LessonInfoMapper {
    public abstract LessonInfoDTO lessonToLessonInfoDTO(Lesson lesson);

    @Mapping(target = "semester.id", source = "semesterId")
    public abstract Lesson lessonInfoDTOToLesson(LessonInfoDTO lessonInfoDTO);

    public List<Lesson> lessonForGroupsDTOToLessons(LessonForGroupsDTO lessonForGroupsDTO) {
        if (lessonForGroupsDTO == null) {
            return new ArrayList<>();
        }
        List<Lesson> lessons = new ArrayList<>();
        lessonForGroupsDTO.getGroups().forEach(group -> {
            LessonInfoDTO lessonInfoDTO = lessonInfoDTOToLessonForGroupsDTO(lessonForGroupsDTO);
            lessons.add(lessonInfoDTOToLesson(lessonInfoDTO));
        });
        return lessons;
    }

    public abstract List<LessonInfoDTO> lessonsToLessonInfoDTOs(List<Lesson> lessons);

    public abstract List<LessonDTO> lessonsToLessonDTOs(List<Lesson> lessons);

    public abstract LessonInfoDTO lessonInfoDTOToLessonForGroupsDTO(LessonForGroupsDTO lessonForGroupsDTO);

    @Mapping(source = "semesterId", target = "semester.id")
    @Mapping(source = "teacherId", target = "teacher.id")
    @Mapping(source = "linkToMeeting", target = "linkToMeeting")
    @Mapping(source = "subjectId", target = "subject.id")
    @Mapping(source = "lessonType", target = "lessonType")
    public abstract Lesson lessonWithLinkDTOToLesson(LessonWithLinkDTO lessonWithLinkDTO);
}
