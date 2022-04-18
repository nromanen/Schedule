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
    @Mapping(source = "semester.id", target = "semesterId")
    public abstract LessonInfoDTO lessonToLessonInfoDTO(Lesson lesson);

    @Mapping(target = "semester.id", source = "semesterId")
    @Mapping(target = "teacher.position", ignore = true)
    @Mapping(target = "teacher.department", ignore = true)
    @Mapping(target = "teacher.disable", ignore = true)
    @Mapping(target = "teacher.userId", ignore = true)
    @Mapping(target = "group.students", ignore = true)
    @Mapping(target = "group.sortingOrder", ignore = true)
    public abstract Lesson lessonInfoDTOToLesson(LessonInfoDTO lessonInfoDTO);

    @Mapping(source = "semester.id", target = "semesterId")
    public abstract LessonDTO lessonToLessonDTO(Lesson lesson);

    @Mapping(target = "semester.groups", ignore = true)
    @Mapping(target = "grouped", ignore = true)
    @Mapping(target = "group.students", ignore = true)
    @Mapping(target = "group.sortingOrder", ignore = true)
    @Mapping(target = "teacher.position", ignore = true)
    @Mapping(target = "teacher.department", ignore = true)
    @Mapping(target = "teacher.disable", ignore = true)
    @Mapping(target = "teacher.userId", ignore = true)
    public abstract Lesson lessonDTOToLesson(LessonDTO lessonDTO);

    public List<Lesson> lessonForGroupsDTOToLessons(LessonForGroupsDTO lessonForGroupsDTO) {
        if (lessonForGroupsDTO == null || lessonForGroupsDTO.getGroups() == null) {
            return new ArrayList<>();
        }
        List<Lesson> lessons = new ArrayList<>();
        lessonForGroupsDTO.getGroups().forEach(group -> {
            LessonInfoDTO lessonInfoDTO = lessonForGroupsDTOToLessonInfoDTO(lessonForGroupsDTO);
            lessonInfoDTO.setGroup(group);
            lessons.add(lessonInfoDTOToLesson(lessonInfoDTO));
        });
        return lessons;
    }

    public abstract List<LessonInfoDTO> lessonsToLessonInfoDTOs(List<Lesson> lessons);

    public abstract List<LessonDTO> lessonsToLessonDTOs(List<Lesson> lessons);

    @Mapping(target = "group", ignore = true)
    public abstract LessonInfoDTO lessonForGroupsDTOToLessonInfoDTO(LessonForGroupsDTO lessonForGroupsDTO);

    @Mapping(source = "semesterId", target = "semester.id")
    @Mapping(source = "teacherId", target = "teacher.id")
    @Mapping(source = "linkToMeeting", target = "linkToMeeting")
    @Mapping(source = "subjectId", target = "subject.id")
    @Mapping(source = "lessonType", target = "lessonType")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "hours", ignore = true)
    @Mapping(target = "subjectForSite", ignore = true)
    @Mapping(target = "group", ignore = true)
    @Mapping(target = "grouped", ignore = true)
    public abstract Lesson lessonWithLinkDTOToLesson(LessonWithLinkDTO lessonWithLinkDTO);
}
