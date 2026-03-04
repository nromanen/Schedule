package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.assertions.CustomMockMvcAssertions;
import com.softserve.dto.*;
import com.softserve.entity.enums.LessonType;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.service.GroupService;
import com.softserve.service.LessonService;
import com.softserve.service.SubjectService;
import com.softserve.service.TeacherService;
import org.assertj.core.api.SoftAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

import static com.softserve.entity.enums.LessonType.LABORATORY;
import static com.softserve.entity.enums.LessonType.LECTURE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Tag("integration")
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "MANAGER")
@Sql(value = "classpath:create-lessons-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class LessonsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private LessonService lessonService;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private GroupService groupService;

    private CustomMockMvcAssertions assertions;

    private TeacherBaseDTO teacherDTO;
    private SubjectDTO subjectDTO;
    private GroupDTO groupDTO;

    @BeforeEach
    void setup() {
        assertions = new CustomMockMvcAssertions(mockMvc, objectMapper, "/lessons");

        teacherDTO = new TeacherBaseDTO();
        teacherDTO.setId(5L);

        subjectDTO = new SubjectDTO();
        subjectDTO.setId(4L);

        groupDTO = new GroupDTO();
        groupDTO.setId(4L);
    }

    @Test
    void getAllLessons() throws Exception {
        mockMvc.perform(get("/lessons").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void getLessonById() throws Exception {
        mockMvc.perform(get("/lessons/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(4));
    }

    @Test
    @WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "USER")
    void returnForbiddenIfAuthenticatedUserRoleIsNotManager() throws Exception {
        mockMvc.perform(get("/lessons/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAllLessonsTypes() throws Exception {
        mockMvc.perform(get("/lessons/types").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void saveLessonsIfLessonDoesNotExist() throws Exception {
        LessonInfoDTO lessonDTO = buildLessonInfoDTO(null, 1, "", "", LABORATORY, teacherDTO, subjectDTO, groupDTO);

        mockMvc.perform(post("/lessons")
                        .content(objectMapper.writeValueAsString(lessonDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    void updateNonGroupedLesson() throws Exception {
        SubjectDTO subject = subjectService.getById(6L);
        GroupDTO group = groupService.getById(4L);
        LessonInfoDTO lessonDTO = buildLessonInfoDTO(5L, 2,
                "https://softserveinc.zoom.us/j/93198369163?pwd=Rk1GU281cDFtK1FCK3pJWXphRkJrQT09",
                "History updated", LECTURE, teacherDTO, subject, group);

        mockMvc.perform(put("/lessons")
                        .content(objectMapper.writeValueAsString(lessonDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5L))
                .andExpect(jsonPath("$.hours").value(2))
                .andExpect(jsonPath("$.subjectForSite").value("History updated"))
                .andExpect(jsonPath("$.lessonType").value(LECTURE.toString()));
    }

    @Test
    void updateForGroupedLesson() throws Exception {
        LessonInfoDTO lessonDTO = buildLessonInfoDTO(13L, 2,
                "https://softserveinc.zoom.us/j/93198369163?pwd=Rk1GU281cDFtK1FCK3pJWXphRkJrQT09",
                "Biology 3", LABORATORY, teacherDTO, subjectDTO, groupDTO);
        lessonDTO.setGrouped(true);

        mockMvc.perform(put("/lessons")
                        .content(objectMapper.writeValueAsString(lessonDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(13L))
                .andExpect(jsonPath("$.hours").value(2))
                .andExpect(jsonPath("$.subjectForSite").value("Biology 3"))
                .andExpect(jsonPath("$.lessonType").value(LABORATORY.toString()))
                .andExpect(jsonPath("$.grouped").value(true));

        LessonInfoDTO groupedLesson = lessonService.getById(14L);

        SoftAssertions softAssertions = new SoftAssertions();
        softAssertions.assertThat(groupedLesson)
                .usingRecursiveComparison()
                .comparingOnlyFields("hours", "linkToMeeting", "subjectForSite", "lessonType", "grouped")
                .isEqualTo(lessonDTO);
        softAssertions.assertThat(groupedLesson.getTeacher().getId()).isEqualTo(teacherDTO.getId());
        softAssertions.assertThat(groupedLesson.getSubject().getId()).isEqualTo(subjectDTO.getId());
        softAssertions.assertThat(groupedLesson.getGroup().getId()).isNotEqualTo(groupDTO.getId());
        softAssertions.assertAll();
    }

    @Test
    void updateTeacherAndSubjectForGroupedLesson() throws Exception {
        TeacherBaseDTO teacher = new TeacherBaseDTO();
        teacher.setId(4L);

        SubjectDTO subject = new SubjectDTO();
        subject.setId(5L);

        LessonInfoDTO lessonDTO = buildLessonInfoDTO(13L, 1, "", "History", LECTURE, teacher, subject, groupDTO);
        lessonDTO.setGrouped(true);

        mockMvc.perform(put("/lessons")
                        .content(objectMapper.writeValueAsString(lessonDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(13L))
                .andExpect(jsonPath("$.hours").value(1))
                .andExpect(jsonPath("$.subjectForSite").value("History"))
                .andExpect(jsonPath("$.lessonType").value(LECTURE.toString()))
                .andExpect(jsonPath("$.grouped").value(true));

        SoftAssertions softAssertions = new SoftAssertions();

        LessonInfoDTO groupedWithSameSubjectForSite = lessonService.getById(14L);
        softAssertions.assertThat(groupedWithSameSubjectForSite)
                .usingRecursiveComparison()
                .comparingOnlyFields("hours", "linkToMeeting", "subjectForSite", "lessonType", "grouped")
                .isEqualTo(lessonDTO);
        softAssertions.assertThat(groupedWithSameSubjectForSite.getTeacher().getId()).isEqualTo(teacher.getId());
        softAssertions.assertThat(groupedWithSameSubjectForSite.getSubject().getId()).isEqualTo(subject.getId());
        softAssertions.assertThat(groupedWithSameSubjectForSite.getGroup().getId()).isNotEqualTo(groupDTO.getId());

        LessonInfoDTO groupedWithDiffSubjectForSite = lessonService.getById(15L);
        softAssertions.assertThat(groupedWithDiffSubjectForSite)
                .usingRecursiveComparison()
                .comparingOnlyFields("hours", "linkToMeeting", "subjectForSite", "lessonType", "grouped")
                .isEqualTo(lessonDTO);
        softAssertions.assertThat(groupedWithDiffSubjectForSite.getTeacher().getId()).isEqualTo(teacher.getId());
        softAssertions.assertThat(groupedWithDiffSubjectForSite.getSubject().getId()).isEqualTo(subject.getId());
        softAssertions.assertThat(groupedWithDiffSubjectForSite.getGroup().getId()).isNotEqualTo(groupDTO.getId());

        softAssertions.assertAll();
    }

    @Test
    void deleteLesson() throws Exception {
        mockMvc.perform(delete("/lessons/{id}", 7)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void deleteLessonGrouped() throws Exception {
        assertions.assertForDelete(13, "/lessons/{id}");

        SoftAssertions softAssertions = new SoftAssertions();
        softAssertions.assertThatThrownBy(() -> lessonService.getById(14L)).isInstanceOf(EntityNotFoundException.class);
        softAssertions.assertThat(lessonService.getById(15L)).isNotNull();
        softAssertions.assertAll();
    }

    @Test
    void returnNotFoundIfLessonNotFoundedById() throws Exception {
        mockMvc.perform(get("/lessons/100"))
                .andExpect(status().isNotFound());
    }

    @Test
    void returnBadRequestIfSaveExistLesson() throws Exception {
        LessonInfoDTO lessonDTO = lessonService.getById(7L);

        LessonForGroupsDTO lessonForGroupsDTO = new LessonForGroupsDTO();
        lessonForGroupsDTO.setId(7L);
        lessonForGroupsDTO.setGroups(Collections.singletonList(lessonDTO.getGroup()));
        lessonForGroupsDTO.setLessonType(lessonDTO.getLessonType());
        lessonForGroupsDTO.setGrouped(lessonDTO.isGrouped());
        lessonForGroupsDTO.setSemesterId(lessonDTO.getSemesterId());
        lessonForGroupsDTO.setHours(lessonDTO.getHours());
        lessonForGroupsDTO.setLinkToMeeting(lessonDTO.getLinkToMeeting());
        lessonForGroupsDTO.setSubjectForSite(lessonDTO.getSubjectForSite());
        lessonForGroupsDTO.setSubject(lessonDTO.getSubject());
        lessonForGroupsDTO.setTeacher(lessonDTO.getTeacher());

        mockMvc.perform(post("/lessons")
                        .content(objectMapper.writeValueAsString(lessonForGroupsDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnInternalServerErrorIfSavedTeacherIsNull() throws Exception {
        SubjectDTO subject = subjectService.getById(6L);
        GroupDTO group = groupService.getById(6L);

        LessonForGroupsDTO lessonDTO = new LessonForGroupsDTO();
        lessonDTO.setHours(2);
        lessonDTO.setSubjectForSite("");
        lessonDTO.setLinkToMeeting("");
        lessonDTO.setLessonType(LABORATORY);
        lessonDTO.setTeacher(null);
        lessonDTO.setSubject(subject);
        lessonDTO.setGroups(List.of(group));

        mockMvc.perform(post("/lessons")
                        .content(objectMapper.writeValueAsString(lessonDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isInternalServerError());
    }

    @Test
    void returnInternalServerErrorIfUpdatedTeacherIsNull() throws Exception {
        LessonInfoDTO lessonDTO = buildLessonInfoDTO(4L, 1,
                "https://softserveinc.zoom.us/j/93198369163?pwd=Rk1GU281cDFtK1FCK3pJWXphRkJrQT09",
                "History of World", LECTURE, null, subjectService.getById(6L), groupService.getById(4L));

        mockMvc.perform(put("/lessons")
                        .content(objectMapper.writeValueAsString(lessonDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isInternalServerError());
    }

    static Stream<Object[]> parametersToUpdateLinkToMeeting() {
        LessonWithLinkDTO lessonWithSubjectAndType = new LessonWithLinkDTO();
        lessonWithSubjectAndType.setLinkToMeeting("https://www.youtube.com/");
        lessonWithSubjectAndType.setSemesterId(7L);
        lessonWithSubjectAndType.setTeacherId(5L);
        lessonWithSubjectAndType.setSubjectId(5L);
        lessonWithSubjectAndType.setLessonType("LECTURE");

        LessonWithLinkDTO lessonWithSubject = new LessonWithLinkDTO();
        lessonWithSubject.setLinkToMeeting("https://www.youtube.com/");
        lessonWithSubject.setSemesterId(7L);
        lessonWithSubject.setTeacherId(5L);
        lessonWithSubject.setSubjectId(5L);

        LessonWithLinkDTO lesson = new LessonWithLinkDTO();
        lesson.setLinkToMeeting("https://www.youtube.com/");
        lesson.setSemesterId(7L);
        lesson.setTeacherId(5L);

        LessonWithLinkDTO lessonWithNoExistingType = new LessonWithLinkDTO();
        lessonWithNoExistingType.setLinkToMeeting("https://www.youtube.com/");
        lessonWithNoExistingType.setSemesterId(7L);
        lessonWithNoExistingType.setTeacherId(5L);
        lessonWithNoExistingType.setSubjectId(5L);
        lessonWithNoExistingType.setLessonType("LABORATORY");

        return Stream.of(
                new Object[]{lessonWithSubjectAndType, 2},
                new Object[]{lessonWithSubject, 3},
                new Object[]{lesson, 4},
                new Object[]{lessonWithNoExistingType, 0}
        );
    }

    @ParameterizedTest
    @MethodSource("parametersToUpdateLinkToMeeting")
    void updateLinkToMeeting(LessonWithLinkDTO lessonWithLinkDTO, Integer result) throws Exception {
        mockMvc.perform(put("/lessons/link")
                        .content(objectMapper.writeValueAsString(lessonWithLinkDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$").value(result));
    }

    private LessonInfoDTO buildLessonInfoDTO(Long id, int hours, String linkToMeeting,
                                             String subjectForSite, LessonType lessonType,
                                             TeacherBaseDTO teacher, SubjectDTO subject, GroupDTO group) {
        LessonInfoDTO lessonDTO = new LessonInfoDTO();
        lessonDTO.setId(id);
        lessonDTO.setHours(hours);
        lessonDTO.setLinkToMeeting(linkToMeeting);
        lessonDTO.setSubjectForSite(subjectForSite);
        lessonDTO.setLessonType(lessonType);
        lessonDTO.setTeacher(teacher);
        lessonDTO.setSubject(subject);
        lessonDTO.setGroup(group);
        return lessonDTO;
    }
}
