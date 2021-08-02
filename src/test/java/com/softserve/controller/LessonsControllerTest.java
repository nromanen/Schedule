package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.GroupDTO;
import com.softserve.dto.LessonInfoDTO;
import com.softserve.dto.SubjectDTO;
import com.softserve.dto.TeacherNameDTO;
import com.softserve.entity.Lesson;
import com.softserve.mapper.GroupMapperImpl;
import com.softserve.mapper.LessonInfoMapperImpl;
import com.softserve.mapper.SubjectMapperImpl;
import com.softserve.mapper.TeacherNameMapperImpl;
import com.softserve.service.GroupService;
import com.softserve.service.LessonService;
import com.softserve.service.SubjectService;
import com.softserve.service.TeacherService;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static com.softserve.entity.enums.LessonType.LABORATORY;
import static com.softserve.entity.enums.LessonType.LECTURE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
@WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "MANAGER")
@Sql(value = "classpath:create-lessons-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class LessonsControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private LessonService lessonService;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private GroupService groupService;

    @Before
    public void insertData() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    public void getAllLessons() throws Exception {
        mockMvc.perform(get("/lessons").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void getLessonById() throws Exception {
        mockMvc.perform(get("/lessons/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(4));
    }

    @Test
    @WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "USER")
    public void returnForbiddenIfAuthenticatedUserRoleIsNotManager() throws Exception {
        mockMvc.perform(get("/lessons/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    public void getAllLessonsTypes() throws Exception {
        mockMvc.perform(get("/lessons/types").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void saveLessonsIfLessonDoesNotExist() throws Exception {
        TeacherNameDTO teacherDTO = new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacherService.getById(5L));
        SubjectDTO subjectDTO = new SubjectMapperImpl().subjectToSubjectDTO(subjectService.getById(4L));
        GroupDTO groupDTO = new GroupMapperImpl().convertToDto(groupService.getById(4L));
        LessonInfoDTO lessonDtoForSave = new LessonInfoDTO();
        lessonDtoForSave.setHours(1);
        lessonDtoForSave.setSubjectForSite("");
        lessonDtoForSave.setLinkToMeeting("");
        lessonDtoForSave.setLessonType(LABORATORY);
        lessonDtoForSave.setTeacher(teacherDTO);
        lessonDtoForSave.setSubject(subjectDTO);
        lessonDtoForSave.setGroup(groupDTO);

        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lessonDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void updateLessonIfLessonDoesNotExist() throws Exception {
        LessonInfoDTO lessonDtoForUpdate = new LessonInfoDTO();
        lessonDtoForUpdate.setId(5L);
        lessonDtoForUpdate.setHours(2);
        lessonDtoForUpdate.setLinkToMeeting("https://softserveinc.zoom.us/j/93198369163?pwd=Rk1GU281cDFtK1FCK3pJWXphRkJrQT09");
        lessonDtoForUpdate.setSubjectForSite("History updated");
        lessonDtoForUpdate.setLessonType(LECTURE);
        lessonDtoForUpdate.setTeacher(new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacherService.getById(6L)));
        lessonDtoForUpdate.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subjectService.getById(6L)));
        lessonDtoForUpdate.setGroup(new GroupMapperImpl().convertToDto(groupService.getById(4L)));

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
    public void deleteLesson() throws Exception {
        mockMvc.perform(delete("/lessons/{id}", 7)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void returnNotFoundIfLessonNotFoundedById() throws Exception {
        mockMvc.perform(get("/lessons/100"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void returnBadRequestIfSaveExistLesson() throws Exception {
        LessonInfoDTO lessonDtoForSave = new LessonInfoMapperImpl().lessonToLessonInfoDTO(lessonService.getById(4L));

        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lessonDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnInternalServerErrorIfSavedTeacherIsNull() throws Exception {
        SubjectDTO subjectDTO = new SubjectMapperImpl().subjectToSubjectDTO(subjectService.getById(6L));
        GroupDTO groupDTO = new GroupMapperImpl().convertToDto(groupService.getById(6L));
        LessonInfoDTO lessonDtoForSave = new LessonInfoDTO();
        lessonDtoForSave.setHours(2);
        lessonDtoForSave.setSubjectForSite("");
        lessonDtoForSave.setLinkToMeeting("");
        lessonDtoForSave.setLessonType(LABORATORY);
        lessonDtoForSave.setTeacher(null);
        lessonDtoForSave.setSubject(subjectDTO);
        lessonDtoForSave.setGroup(groupDTO);

        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lessonDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isInternalServerError());
    }

    @Test
    public void returnBadRequestIfUpdateExistLesson() throws Exception {
        LessonInfoDTO lessonDtoForUpdate = new LessonInfoDTO();
        lessonDtoForUpdate.setId(4L);
        lessonDtoForUpdate.setHours(1);
        lessonDtoForUpdate.setLinkToMeeting("https://softserveinc.zoom.us/j/93198369163?pwd=Rk1GU281cDFtK1FCK3pJWXphRkJrQT09");
        lessonDtoForUpdate.setSubjectForSite("History of USA");
        lessonDtoForUpdate.setLessonType(LABORATORY);
        lessonDtoForUpdate.setTeacher(new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacherService.getById(5L)));
        lessonDtoForUpdate.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subjectService.getById(5L)));
        lessonDtoForUpdate.setGroup(new GroupMapperImpl().convertToDto(groupService.getById(5L)));

        mockMvc.perform(put("/lessons", 4).content(objectMapper.writeValueAsString(lessonDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnInternalServerErrorIfUpdatedTeacherIsNull() throws Exception {
        LessonInfoDTO lessonDtoForUpdate = new LessonInfoDTO();
        lessonDtoForUpdate.setId(4L);
        lessonDtoForUpdate.setHours(1);
        lessonDtoForUpdate.setLinkToMeeting("https://softserveinc.zoom.us/j/93198369163?pwd=Rk1GU281cDFtK1FCK3pJWXphRkJrQT09");
        lessonDtoForUpdate.setSubjectForSite("History of World");
        lessonDtoForUpdate.setLessonType(LECTURE);
        lessonDtoForUpdate.setTeacher(null);
        lessonDtoForUpdate.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subjectService.getById(5L)));
        lessonDtoForUpdate.setGroup(new GroupMapperImpl().convertToDto(groupService.getById(4L)));

        mockMvc.perform(put("/lessons", 4).content(objectMapper.writeValueAsString(lessonDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isInternalServerError());
    }
}
