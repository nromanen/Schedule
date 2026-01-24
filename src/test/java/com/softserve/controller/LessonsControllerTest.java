package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.assertions.CustomMockMvcAssertions;
import com.softserve.dto.*;
import com.softserve.entity.Lesson;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.mapper.LessonInfoMapperImpl;
import com.softserve.mapper.TeacherNameMapper;
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

    @Autowired
    private TeacherNameMapper teacherNameMapper;

    private CustomMockMvcAssertions assertions;


    @BeforeEach
    void setup() {
        assertions = new CustomMockMvcAssertions(mockMvc, objectMapper, "/lessons");
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
        TeacherNameDTO teacherDTO = new TeacherNameDTO();
        teacherDTO.setId(5L);

        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setId(4L);

        GroupDTO groupDTO = groupService.getById(4L);

        LessonInfoDTO lessonDtoForSave = new LessonInfoDTO();
        lessonDtoForSave.setHours(1);
        lessonDtoForSave.setSubjectForSite("");
        lessonDtoForSave.setLinkToMeeting("");
        lessonDtoForSave.setLessonType(LABORATORY);
        lessonDtoForSave.setTeacher(teacherDTO);
        lessonDtoForSave.setSubject(subjectDTO);
        lessonDtoForSave.setGroup(groupDTO);

        mockMvc.perform(post("/lessons")
                        .content(objectMapper.writeValueAsString(lessonDtoForSave))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }
    @Test
    void updateLessonIfLessonDoesNotExist() throws Exception {
        LessonInfoDTO lessonDtoForUpdate = new LessonInfoDTO();
        lessonDtoForUpdate.setId(5L);
        lessonDtoForUpdate.setHours(2);
        lessonDtoForUpdate.setLinkToMeeting("https://softserveinc.zoom.us/j/93198369163?pwd=Rk1GU281cDFtK1FCK3pJWXphRkJrQT09");
        lessonDtoForUpdate.setSubjectForSite("History updated");
        lessonDtoForUpdate.setLessonType(LECTURE);
        lessonDtoForUpdate.setTeacher(teacherNameMapper.teacherDTOToTeacherNameDTO(teacherService.getById(6L)));
        lessonDtoForUpdate.setSubject(subjectService.getById(6L));
        lessonDtoForUpdate.setGroup(groupService.getById(4L));

        Lesson lessonForCompare = new LessonInfoMapperImpl().lessonInfoDTOToLesson(lessonDtoForUpdate);

        mockMvc.perform(put("/lessons").content(objectMapper.writeValueAsString(lessonDtoForUpdate))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(lessonForCompare.getId()))
                .andExpect(jsonPath("$.hours").value(lessonForCompare.getHours()))
                .andExpect(jsonPath("$.linkToMeeting").value(lessonForCompare.getLinkToMeeting()))
                .andExpect(jsonPath("$.subjectForSite").value(lessonForCompare.getSubjectForSite()))
                .andExpect(jsonPath("$.lessonType").value(lessonForCompare.getLessonType().toString()))
                .andExpect(jsonPath("$.subject").value(lessonForCompare.getSubject()))
                .andExpect(jsonPath("$.group").value(lessonForCompare.getGroup()));
    }

    @Test
    void updateForGroupedLesson() throws Exception {
        TeacherNameDTO teacherDTO = new TeacherNameDTO();
        teacherDTO.setId(5L);

        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setId(4L);

        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(4L);

        LessonInfoDTO lessonDtoForUpdate = new LessonInfoDTO();
        lessonDtoForUpdate.setId(13L);
        lessonDtoForUpdate.setHours(2);
        lessonDtoForUpdate.setLinkToMeeting(
                "https://softserveinc.zoom.us/j/93198369163?pwd=Rk1GU281cDFtK1FCK3pJWXphRkJrQT09");
        lessonDtoForUpdate.setSubjectForSite("Biology 3");
        lessonDtoForUpdate.setLessonType(LABORATORY);
        lessonDtoForUpdate.setTeacher(teacherDTO);
        lessonDtoForUpdate.setSubject(subjectDTO);
        lessonDtoForUpdate.setGroup(groupDTO);
        lessonDtoForUpdate.setGrouped(true);

        mockMvc.perform(put("/lessons")
                        .content(objectMapper.writeValueAsString(lessonDtoForUpdate))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(13L))
                .andExpect(jsonPath("$.hours").value(2))
                .andExpect(jsonPath("$.linkToMeeting").value(lessonDtoForUpdate.getLinkToMeeting()))
                .andExpect(jsonPath("$.subjectForSite").value("Biology 3"))
                .andExpect(jsonPath("$.lessonType").value(LABORATORY.toString()))
                .andExpect(jsonPath("$.grouped").value(true));

        LessonInfoDTO groupedWithSameSubjectForSite = lessonService.getById(14L);

        SoftAssertions softAssertions = new SoftAssertions();

        // Compare simple fields
        softAssertions.assertThat(groupedWithSameSubjectForSite)
                .usingRecursiveComparison()
                .comparingOnlyFields("hours", "linkToMeeting", "subjectForSite", "lessonType", "grouped")
                .isEqualTo(lessonDtoForUpdate);

        // Compare nested objects by ID only
        softAssertions.assertThat(groupedWithSameSubjectForSite.getTeacher().getId())
                .isEqualTo(teacherDTO.getId());
        softAssertions.assertThat(groupedWithSameSubjectForSite.getSubject().getId())
                .isEqualTo(subjectDTO.getId());
        softAssertions.assertThat(groupedWithSameSubjectForSite.getGroup().getId())
                .isNotEqualTo(groupDTO.getId());

        softAssertions.assertAll();
    }

    @Test
    void updateTeacherAndSubjectForGroupedLesson() throws Exception {
        TeacherNameDTO teacherDTO = new TeacherNameDTO();
        teacherDTO.setId(4L);

        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setId(5L);

        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(4L);

        LessonInfoDTO lessonDtoForUpdate = new LessonInfoDTO();
        lessonDtoForUpdate.setId(13L);
        lessonDtoForUpdate.setHours(1);
        lessonDtoForUpdate.setLinkToMeeting("");
        lessonDtoForUpdate.setSubjectForSite("History");
        lessonDtoForUpdate.setLessonType(LECTURE);
        lessonDtoForUpdate.setTeacher(teacherDTO);
        lessonDtoForUpdate.setSubject(subjectDTO);
        lessonDtoForUpdate.setGroup(groupDTO);
        lessonDtoForUpdate.setGrouped(true);

        mockMvc.perform(put("/lessons")
                        .content(objectMapper.writeValueAsString(lessonDtoForUpdate))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(13L))
                .andExpect(jsonPath("$.hours").value(1))
                .andExpect(jsonPath("$.linkToMeeting").value(""))
                .andExpect(jsonPath("$.subjectForSite").value("History"))
                .andExpect(jsonPath("$.lessonType").value(LECTURE.toString()))
                .andExpect(jsonPath("$.grouped").value(true));

        LessonInfoDTO groupedWithSameSubjectForSite = lessonService.getById(14L);
        LessonInfoDTO groupedWithDiffSubjectForSite = lessonService.getById(15L);

        SoftAssertions softAssertions = new SoftAssertions();

        softAssertions.assertThat(groupedWithSameSubjectForSite)
                .usingRecursiveComparison()
                .comparingOnlyFields("hours", "linkToMeeting", "subjectForSite", "lessonType", "grouped")
                .isEqualTo(lessonDtoForUpdate);
        softAssertions.assertThat(groupedWithSameSubjectForSite.getTeacher().getId())
                .isEqualTo(teacherDTO.getId());
        softAssertions.assertThat(groupedWithSameSubjectForSite.getSubject().getId())
                .isEqualTo(subjectDTO.getId());
        softAssertions.assertThat(groupedWithSameSubjectForSite.getGroup().getId())
                .isNotEqualTo(groupDTO.getId());

        softAssertions.assertThat(groupedWithDiffSubjectForSite)
                .usingRecursiveComparison()
                .comparingOnlyFields("hours", "linkToMeeting", "subjectForSite", "lessonType", "grouped")
                .isEqualTo(lessonDtoForUpdate);
        softAssertions.assertThat(groupedWithDiffSubjectForSite.getTeacher().getId())
                .isEqualTo(teacherDTO.getId());
        softAssertions.assertThat(groupedWithDiffSubjectForSite.getSubject().getId())
                .isEqualTo(subjectDTO.getId());
        softAssertions.assertThat(groupedWithDiffSubjectForSite.getGroup().getId())
                .isNotEqualTo(groupDTO.getId());

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
        LessonInfoDTO lessonDtoForSave = lessonService.getById(7L);

        LessonForGroupsDTO lessonForGroupsDTO = new LessonForGroupsDTO();
        lessonForGroupsDTO.setId(7L);
        lessonForGroupsDTO.setGroups(Collections.singletonList(lessonDtoForSave.getGroup()));
        lessonForGroupsDTO.setLessonType(lessonDtoForSave.getLessonType());
        lessonForGroupsDTO.setGrouped(lessonDtoForSave.isGrouped());
        lessonForGroupsDTO.setSemesterId(lessonDtoForSave.getSemesterId());
        lessonForGroupsDTO.setHours(lessonDtoForSave.getHours());
        lessonForGroupsDTO.setLinkToMeeting(lessonDtoForSave.getLinkToMeeting());
        lessonForGroupsDTO.setSubjectForSite(lessonDtoForSave.getSubjectForSite());
        lessonForGroupsDTO.setSubject(lessonDtoForSave.getSubject());
        lessonForGroupsDTO.setTeacher(lessonDtoForSave.getTeacher());

        mockMvc.perform(post("/lessons")
                        .content(objectMapper.writeValueAsString(lessonForGroupsDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnInternalServerErrorIfSavedTeacherIsNull() throws Exception {
        SubjectDTO subjectDTO = subjectService.getById(6L);
        GroupDTO groupDTO = groupService.getById(6L);
        LessonForGroupsDTO lessonDtoForSave = new LessonForGroupsDTO();
        lessonDtoForSave.setHours(2);
        lessonDtoForSave.setSubjectForSite("");
        lessonDtoForSave.setLinkToMeeting("");
        lessonDtoForSave.setLessonType(LABORATORY);
        lessonDtoForSave.setTeacher(null);
        lessonDtoForSave.setSubject(subjectDTO);
        lessonDtoForSave.setGroups(List.of(groupDTO));

        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lessonDtoForSave))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isInternalServerError());
    }

    @Test
    void returnInternalServerErrorIfUpdatedTeacherIsNull() throws Exception {
        LessonInfoDTO lessonDtoForUpdate = new LessonInfoDTO();
        lessonDtoForUpdate.setId(4L);
        lessonDtoForUpdate.setHours(1);
        lessonDtoForUpdate.setLinkToMeeting("https://softserveinc.zoom.us/j/93198369163?pwd=Rk1GU281cDFtK1FCK3pJWXphRkJrQT09");
        lessonDtoForUpdate.setSubjectForSite("History of World");
        lessonDtoForUpdate.setLessonType(LECTURE);
        lessonDtoForUpdate.setTeacher(null);
        lessonDtoForUpdate.setSubject(subjectService.getById(6L));
        lessonDtoForUpdate.setGroup(groupService.getById(4L));

        mockMvc.perform(put("/lessons", 4).content(objectMapper.writeValueAsString(lessonDtoForUpdate))
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
        mockMvc.perform(put("/lessons/link").content(objectMapper.writeValueAsString(lessonWithLinkDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$").value(result));
    }
}
