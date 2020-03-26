package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.GroupDTO;
import com.softserve.dto.LessonInfoDTO;
import com.softserve.dto.SubjectDTO;
import com.softserve.dto.TeacherDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Lesson;
import com.softserve.entity.Subject;
import com.softserve.entity.Teacher;
import com.softserve.entity.enums.LessonType;
import com.softserve.service.GroupService;
import com.softserve.service.LessonService;
import com.softserve.service.SubjectService;
import com.softserve.service.TeacherService;
import com.softserve.service.mapper.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//Dont work
//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
//@WebAppConfiguration
//public class LessonsControllerTest {
//
//    private MockMvc mockMvc;
//    private ObjectMapper objectMapper = new ObjectMapper();
//
//    @Autowired
//    private WebApplicationContext wac;
//
//    @Mock
//    private LessonService lessonService;
//
//    @Before
//    public void init() throws Exception {
//        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
//        MockitoAnnotations.initMocks(this);
//    }
//
//    @Test
//    public void testGetAll() throws Exception {
//        mockMvc.perform(get("/lessons").accept(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isOk())
//                .andExpect(content().contentType("application/json"));
//    }
//
//    @Test
//    public void testGetAllWithParametrs() throws Exception {
//        mockMvc.perform(get("/lessons").param("groupId", "1").accept(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isOk())
//                .andExpect(content().contentType("application/json"));
//    }
//
//    @Test
//    public void testGet() throws Exception {
//        LessonInfoDTO lessonInfoDTO = new LessonInfoDTO();
//        lessonInfoDTO.setId(1L);
//        lessonInfoDTO.setHours(2);
//        lessonInfoDTO.setTeacherForSite("some teacher for site");
//        lessonInfoDTO.setSubjectForSite("some subject for site");
//        lessonInfoDTO.setLessonType(LessonType.LECTURE);
//        lessonInfoDTO.setSubject(new SubjectDTO() {{
//            setName("1 subject");
//            setId(1L);
//        }});
//        lessonInfoDTO.setGroup(new GroupDTO() {{
//            setTitle("111");
//            setId(1);
//        }});
//        lessonInfoDTO.setTeacher(new TeacherNameDTO() {{
//            setId(1L);
//            setName("1 name");
//            setSurname("1 surname");
//            setPatronymic("1 patronymic");
//        }});
//
//        Lesson lesson = new LessonInfoMapperImpl().LessonInfoDTOToLesson(lessonInfoDTO);
//
//        when(lessonService.save(any(Lesson.class))).thenReturn(lesson);
//
//        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lesson))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(lesson.getId()));
//
//        mockMvc.perform(get("/lessons/{id}", "1").contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().is2xxSuccessful())
//                .andExpect(content().contentType("application/json"))
//                .andExpect(jsonPath("$.id").value("1"));
//    }
//
//    @Test
//    public void testSave() throws Exception {
//        LessonInfoDTO lessonInfoDTO = new LessonInfoDTO();
//        lessonInfoDTO.setId(2L);
//        lessonInfoDTO.setHours(2);
//        lessonInfoDTO.setTeacherForSite("2 teacher for site");
//        lessonInfoDTO.setSubjectForSite("2 subject for site");
//        lessonInfoDTO.setLessonType(LessonType.LABORATORY);
//        lessonInfoDTO.setSubject(new SubjectDTO() {{
//            setName("2 subject");
//            setId(2L);
//        }});
//        lessonInfoDTO.setGroup(new GroupDTO() {{
//            setTitle("2");
//            setId(2);
//        }});
//        lessonInfoDTO.setTeacher(new TeacherNameDTO() {{
//            setId(2L);
//            setName("2 name");
//            setSurname("2 surname");
//            setPatronymic("2 patronymic");
//        }});
//
//        Lesson lesson = new LessonInfoMapperImpl().LessonInfoDTOToLesson(lessonInfoDTO);
//
//        when(lessonService.save(any(Lesson.class))).thenReturn(lesson);
//
//        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lesson))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(lesson.getId()));
//    }
//
//    @Test
//    public void testUpdate() throws Exception {
//        LessonInfoDTO lessonInfoDTO = new LessonInfoDTO();
//        lessonInfoDTO.setId(2L);
//        lessonInfoDTO.setHours(3);
//        lessonInfoDTO.setTeacherForSite("3 teacher for site");
//        lessonInfoDTO.setSubjectForSite("3 subject for site");
//        lessonInfoDTO.setLessonType(LessonType.LECTURE);
//        lessonInfoDTO.setSubject(new SubjectDTO() {{
//            setName("3 subject");
//            setId(3L);
//        }});
//        lessonInfoDTO.setGroup(new GroupDTO() {{
//            setTitle("3");
//            setId(3);
//        }});
//        lessonInfoDTO.setTeacher(new TeacherNameDTO() {{
//            setId(3L);
//            setName("3 name");
//            setSurname("3 surname");
//            setPatronymic("3 patronymic");
//        }});
//
//        Lesson lesson = new LessonInfoMapperImpl().LessonInfoDTOToLesson(lessonInfoDTO);
//
//        when(lessonService.save(any(Lesson.class))).thenReturn(lesson);
//
//        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lesson))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(lesson.getId()));
//
//        mockMvc.perform(put("/lessons", "2").content(objectMapper.writeValueAsString(lesson))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isAccepted())
//                .andExpect(jsonPath("$.id").value(lesson.getId()))
//                .andExpect(jsonPath("$.hours").value(lesson.getHours()))
//                .andExpect(jsonPath("$.teacherForSite").value(lesson.getTeacherForSite()))
//                .andExpect(jsonPath("$.subjectForSite").value(lesson.getSubjectForSite()))
//                .andExpect(jsonPath("$.lessonType").value(lesson.getLessonType()));
//                .andExpect(jsonPath("$.subject").value(lesson.getSubject()));
//                .andExpect(jsonPath("$.group").value(lesson.getGroup()));
//                .andExpect(jsonPath("$.teacher").value(lesson.getTeacher()));
//    }
//
//    @Test
//    public void testDelete() throws Exception {
//        mockMvc.perform(delete("/lessons/{id}", "1")
//                .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isAccepted());
//    }
//}

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class LessonsControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();
    private Lesson lesson = new Lesson();
    private LessonInfoDTO lessonDtoForBefore = new LessonInfoDTO();
    private LessonInfoDTO lessonDtoForSave = new LessonInfoDTO();
    private LessonInfoDTO lessonDtoForUpdate = new LessonInfoDTO();
    private LessonInfoDTO lessonDtoForDelete = new LessonInfoDTO();


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

        //Save new period before all Test methods
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setName("teacher dto name");
        teacherDTO.setSurname("teacher dto surname");
        teacherDTO.setPatronymic("teacher dto patronymic");
        teacherDTO.setPosition("teacher dto position");
        Teacher teacher = teacherService.save(new TeacherMapperImpl().teacherDTOToTeacher(teacherDTO));

        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setName("subject dto name");
        Subject subject = subjectService.save(new SubjectMapperImpl().subjectDTOToSubject(subjectDTO));

        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setTitle("group dto name");
        Group group = groupService.save(new GroupMapperImpl().groupDTOToGroup(groupDTO));

        lessonDtoForBefore.setHours(1);
        lessonDtoForBefore.setTeacherForSite("teacher for site before");
        lessonDtoForBefore.setSubjectForSite("subject for site before");
        lessonDtoForBefore.setLessonType(LessonType.LECTURE);
        lessonDtoForBefore.setTeacher(new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacher));
        lessonDtoForBefore.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subject));
        lessonDtoForBefore.setGroup(new GroupMapperImpl().groupToGroupDTO(group));
        lesson = new LessonInfoMapperImpl().LessonInfoDTOToLesson(lessonDtoForBefore);

        lessonService.save(lesson);

        lessonDtoForSave.setHours(1);
        lessonDtoForSave.setTeacherForSite("teacher for site save");
        lessonDtoForSave.setSubjectForSite("subject for site save");
        lessonDtoForSave.setLessonType(LessonType.LABORATORY);
        lessonDtoForSave.setTeacher(new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacher));
        lessonDtoForSave.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subject));
        lessonDtoForSave.setGroup(new GroupMapperImpl().groupToGroupDTO(group));

        lessonDtoForUpdate.setId(lesson.getId());
        lessonDtoForUpdate.setHours(1);
        lessonDtoForUpdate.setTeacherForSite("teacher for site update");
        lessonDtoForUpdate.setSubjectForSite("subject for site update");
        lessonDtoForUpdate.setLessonType(LessonType.PRACTICAL);
        lessonDtoForUpdate.setTeacher(new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacher));
        lessonDtoForUpdate.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subject));
        lessonDtoForUpdate.setGroup(new GroupMapperImpl().groupToGroupDTO(group));

    }

    @After
    public void deleteData() {
        lessonDtoForBefore = null;
        lessonService.delete(lesson);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/lessons").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {

        mockMvc.perform(get("/lessons/{id}", String.valueOf(lesson.getId())).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    public void testSave() throws Exception {

        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lessonDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {

        Lesson lessonForCompare = new LessonInfoMapperImpl().LessonInfoDTOToLesson(lessonDtoForUpdate);

        mockMvc.perform(put("/lessons", String.valueOf(lesson.getId())).content(objectMapper.writeValueAsString(lessonDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(lessonForCompare.getId()))
                .andExpect(jsonPath("$.hours").value(lessonForCompare.getHours()))
                .andExpect(jsonPath("$.teacherForSite").value(lessonForCompare.getTeacherForSite()))
                .andExpect(jsonPath("$.subjectForSite").value(lessonForCompare.getSubjectForSite()))
                .andExpect(jsonPath("$.lessonType").value(lessonForCompare.getLessonType()))
                .andExpect(jsonPath("$.subject").value(lessonForCompare.getSubject()))
                .andExpect(jsonPath("$.group").value(lessonForCompare.getGroup()))
                .andExpect(jsonPath("$.teacher").value(lessonForCompare.getTeacher()));
    }

    @Test
    public void testDelete() throws Exception {
        LessonInfoDTO lessonInfoDTO = new LessonInfoDTO();
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setName("teacher dto name delete");
        teacherDTO.setSurname("teacher dto surname delete");
        teacherDTO.setPatronymic("teacher dto patronymic delete");
        teacherDTO.setPosition("teacher dto position delete");
        Teacher teacher = teacherService.save(new TeacherMapperImpl().teacherDTOToTeacher(teacherDTO));

        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setName("subject dto name delete");
        Subject subject = subjectService.save(new SubjectMapperImpl().subjectDTOToSubject(subjectDTO));

        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setTitle("group dto name delete");
        Group group = groupService.save(new GroupMapperImpl().groupDTOToGroup(groupDTO));

        lessonInfoDTO.setHours(1);
        lessonInfoDTO.setTeacherForSite("teacher for site delete");
        lessonInfoDTO.setSubjectForSite("subject for site delete");
        lessonInfoDTO.setLessonType(LessonType.LECTURE);
        lessonInfoDTO.setTeacher(new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacher));
        lessonInfoDTO.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subject));
        lessonInfoDTO.setGroup(new GroupMapperImpl().groupToGroupDTO(group));
        lesson = new LessonInfoMapperImpl().LessonInfoDTOToLesson(lessonInfoDTO);
        lessonService.save(lesson);

        mockMvc.perform(delete("/lessons/{id}", String.valueOf(lesson.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());
    }
}
