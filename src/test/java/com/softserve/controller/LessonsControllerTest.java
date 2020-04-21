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
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/lessons").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        mockMvc.perform(get("/lessons/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(4));
    }

    @Test
    public void testGetAllLessonTypes() throws Exception {
        mockMvc.perform(get("/lessons/types").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testSave() throws Exception {
        TeacherNameDTO teacherDTO = new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacherService.getById(5L));
        SubjectDTO subjectDTO = new SubjectMapperImpl().subjectToSubjectDTO(subjectService.getById(4L));
        GroupDTO groupDTO = new GroupMapperImpl().groupToGroupDTO(groupService.getById(4L));
        LessonInfoDTO lessonDtoForSave = new LessonInfoDTO();
        lessonDtoForSave.setHours(1);
        lessonDtoForSave.setSubjectForSite("");
        lessonDtoForSave.setTeacherForSite("");
        lessonDtoForSave.setLessonType(LABORATORY);
        lessonDtoForSave.setTeacher(teacherDTO);
        lessonDtoForSave.setSubject(subjectDTO);
        lessonDtoForSave.setGroup(groupDTO);

        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lessonDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {
        LessonInfoDTO lessonDtoForUpdate = new LessonInfoDTO();
        lessonDtoForUpdate.setId(5L);
        lessonDtoForUpdate.setHours(2);
        lessonDtoForUpdate.setTeacherForSite("Ivanov I.I. updated");
        lessonDtoForUpdate.setSubjectForSite("History updated");
        lessonDtoForUpdate.setLessonType(LECTURE);
        lessonDtoForUpdate.setTeacher(new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacherService.getById(6L)));
        lessonDtoForUpdate.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subjectService.getById(6L)));
        lessonDtoForUpdate.setGroup(new GroupMapperImpl().groupToGroupDTO(groupService.getById(4L)));

        Lesson lessonForCompare = new LessonInfoMapperImpl().lessonInfoDTOToLesson(lessonDtoForUpdate);

        mockMvc.perform(put("/lessons", 2).content(objectMapper.writeValueAsString(lessonDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(lessonForCompare.getId()))
                .andExpect(jsonPath("$.hours").value(lessonForCompare.getHours()))
                .andExpect(jsonPath("$.teacherForSite").value(lessonForCompare.getTeacherForSite()))
                .andExpect(jsonPath("$.subjectForSite").value(lessonForCompare.getSubjectForSite()))
                .andExpect(jsonPath("$.lessonType").value(lessonForCompare.getLessonType().toString()))
                .andExpect(jsonPath("$.subject").value(lessonForCompare.getSubject()))
                .andExpect(jsonPath("$.group").value(lessonForCompare.getGroup()));
    }

    @Test
    public void testDelete() throws Exception {
        mockMvc.perform(delete("/lessons/{id}", 7)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void notFound() throws Exception {
        mockMvc.perform(get("/lessons/100"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void whenSaveExistLesson() throws Exception {
        LessonInfoDTO lessonDtoForSave = new LessonInfoMapperImpl().lessonToLessonInfoDTO(lessonService.getById(4L));

        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lessonDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenSaveNullTeacher() throws Exception {
//        TeacherNameDTO teacherDTO = new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacherService.getById(1L));
        SubjectDTO subjectDTO = new SubjectMapperImpl().subjectToSubjectDTO(subjectService.getById(6L));
        GroupDTO groupDTO = new GroupMapperImpl().groupToGroupDTO(groupService.getById(6L));
        LessonInfoDTO lessonDtoForSave = new LessonInfoDTO();
        lessonDtoForSave.setHours(2);
        lessonDtoForSave.setSubjectForSite("");
        lessonDtoForSave.setTeacherForSite("");
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
    public void whenUpdateExistLesson() throws Exception {
        LessonInfoDTO lessonDtoForUpdate = new LessonInfoDTO();
        lessonDtoForUpdate.setId(4L);
        lessonDtoForUpdate.setHours(1);
        lessonDtoForUpdate.setTeacherForSite("Ivanov I.I. update");
        lessonDtoForUpdate.setSubjectForSite("History of USA");
        lessonDtoForUpdate.setLessonType(LABORATORY);
        lessonDtoForUpdate.setTeacher(new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacherService.getById(5L)));
        lessonDtoForUpdate.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subjectService.getById(5L)));
        lessonDtoForUpdate.setGroup(new GroupMapperImpl().groupToGroupDTO(groupService.getById(5L)));

        mockMvc.perform(put("/lessons", 4).content(objectMapper.writeValueAsString(lessonDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateNullTeacher() throws Exception {
        LessonInfoDTO lessonDtoForUpdate = new LessonInfoDTO();
        lessonDtoForUpdate.setId(4L);
        lessonDtoForUpdate.setHours(1);
        lessonDtoForUpdate.setTeacherForSite("Ivanov I.I. update");
        lessonDtoForUpdate.setSubjectForSite("History of World");
        lessonDtoForUpdate.setLessonType(LECTURE);
        lessonDtoForUpdate.setTeacher(null);
        lessonDtoForUpdate.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subjectService.getById(5L)));
        lessonDtoForUpdate.setGroup(new GroupMapperImpl().groupToGroupDTO(groupService.getById(4L)));

        mockMvc.perform(put("/lessons", 4).content(objectMapper.writeValueAsString(lessonDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isInternalServerError());
    }
}
