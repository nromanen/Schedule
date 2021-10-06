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

    public abstract Lesson lessonInfoDTOToLesson(LessonInfoDTO lessonInfoDTO);

    public List<Lesson> lessonForGroupsDTOToLessons(LessonForGroupsDTO lessonForGroupsDTO) {
        if (lessonForGroupsDTO == null) {
            return new ArrayList<>();
        }
        List<Lesson> lessons = new ArrayList<>();
        lessonForGroupsDTO.getGroups().forEach(group -> {
            LessonInfoDTO lessonInfoDTO = new LessonInfoDTO();
            lessonInfoDTO.setId(lessonForGroupsDTO.getId());
            lessonInfoDTO.setHours(lessonForGroupsDTO.getHours());
            lessonInfoDTO.setSemester(lessonForGroupsDTO.getSemester());
            lessonInfoDTO.setLinkToMeeting(lessonForGroupsDTO.getLinkToMeeting());
            lessonInfoDTO.setSubjectForSite(lessonForGroupsDTO.getSubjectForSite());
            lessonInfoDTO.setLessonType(lessonForGroupsDTO.getLessonType());
            lessonInfoDTO.setSubject(lessonForGroupsDTO.getSubject());
            lessonInfoDTO.setGroup(group);
            lessonInfoDTO.setTeacher(lessonForGroupsDTO.getTeacher());
            lessonInfoDTO.setGrouped(lessonForGroupsDTO.isGrouped());
            lessons.add(lessonInfoDTOToLesson(lessonInfoDTO));
        });
        return lessons;
    }

    public abstract List<LessonInfoDTO> lessonsToLessonInfoDTOs(List<Lesson> lessons);

    public abstract List<LessonDTO> lessonsToLessonDTOs(List<Lesson> lessons);

    @Mapping(source = "semesterId", target = "semester.id")
    @Mapping(source = "teacherId", target = "teacher.id")
    @Mapping(source = "linkToMeeting", target = "linkToMeeting")
    @Mapping(source = "subjectId", target = "subject.id")
    @Mapping(source = "lessonType", target = "lessonType")
    public abstract Lesson lessonWithLinkDTOToLesson(LessonWithLinkDTO lessonWithLinkDTO);
}
