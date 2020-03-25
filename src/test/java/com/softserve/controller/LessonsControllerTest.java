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
import com.softserve.entity.enums.LessonType;
import com.softserve.service.LessonService;
import com.softserve.service.mapper.LessonInfoMapperImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//Dont work
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class LessonsControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Mock
    private LessonService lessonService;

    @Before
    public void init() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/lessons").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGetAllWithParametrs() throws Exception {
        mockMvc.perform(get("/lessons").param("groupId", "1").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        LessonInfoDTO lessonInfoDTO = new LessonInfoDTO();
        lessonInfoDTO.setId(1L);
        lessonInfoDTO.setHours(2);
        lessonInfoDTO.setTeacherForSite("some teacher for site");
        lessonInfoDTO.setSubjectForSite("some subject for site");
        lessonInfoDTO.setLessonType(LessonType.LECTURE);
        lessonInfoDTO.setSubject(new SubjectDTO() {{
            setName("1 subject");
            setId(1L);
        }});
        lessonInfoDTO.setGroup(new GroupDTO() {{
            setTitle("111");
            setId(1);
        }});
        lessonInfoDTO.setTeacher(new TeacherNameDTO() {{
            setId(1L);
            setName("1 name");
            setSurname("1 surname");
            setPatronymic("1 patronymic");
        }});

        Lesson lesson = new LessonInfoMapperImpl().LessonInfoDTOToLesson(lessonInfoDTO);

        when(lessonService.save(any(Lesson.class))).thenReturn(lesson);

        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lesson))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(lesson.getId()));

        mockMvc.perform(get("/lessons/{id}", "1").contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().is2xxSuccessful())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    public void testSave() throws Exception {
        LessonInfoDTO lessonInfoDTO = new LessonInfoDTO();
        lessonInfoDTO.setId(2L);
        lessonInfoDTO.setHours(2);
        lessonInfoDTO.setTeacherForSite("2 teacher for site");
        lessonInfoDTO.setSubjectForSite("2 subject for site");
        lessonInfoDTO.setLessonType(LessonType.LABORATORY);
        lessonInfoDTO.setSubject(new SubjectDTO() {{
            setName("2 subject");
            setId(2L);
        }});
        lessonInfoDTO.setGroup(new GroupDTO() {{
            setTitle("2");
            setId(2);
        }});
        lessonInfoDTO.setTeacher(new TeacherNameDTO() {{
            setId(2L);
            setName("2 name");
            setSurname("2 surname");
            setPatronymic("2 patronymic");
        }});

        Lesson lesson = new LessonInfoMapperImpl().LessonInfoDTOToLesson(lessonInfoDTO);

        when(lessonService.save(any(Lesson.class))).thenReturn(lesson);

        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lesson))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(lesson.getId()));
    }

    @Test
    public void testUpdate() throws Exception {
        LessonInfoDTO lessonInfoDTO = new LessonInfoDTO();
        lessonInfoDTO.setId(2L);
        lessonInfoDTO.setHours(3);
        lessonInfoDTO.setTeacherForSite("3 teacher for site");
        lessonInfoDTO.setSubjectForSite("3 subject for site");
        lessonInfoDTO.setLessonType(LessonType.LECTURE);
        lessonInfoDTO.setSubject(new SubjectDTO() {{
            setName("3 subject");
            setId(3L);
        }});
        lessonInfoDTO.setGroup(new GroupDTO() {{
            setTitle("3");
            setId(3);
        }});
        lessonInfoDTO.setTeacher(new TeacherNameDTO() {{
            setId(3L);
            setName("3 name");
            setSurname("3 surname");
            setPatronymic("3 patronymic");
        }});

        Lesson lesson = new LessonInfoMapperImpl().LessonInfoDTOToLesson(lessonInfoDTO);

        when(lessonService.save(any(Lesson.class))).thenReturn(lesson);

        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lesson))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(lesson.getId()));

        mockMvc.perform(put("/lessons", "2").content(objectMapper.writeValueAsString(lesson))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.id").value(lesson.getId()))
                .andExpect(jsonPath("$.hours").value(lesson.getHours()))
                .andExpect(jsonPath("$.teacherForSite").value(lesson.getTeacherForSite()))
                .andExpect(jsonPath("$.subjectForSite").value(lesson.getSubjectForSite()))
                .andExpect(jsonPath("$.lessonType").value(lesson.getLessonType()));
//                .andExpect(jsonPath("$.subject").value(lesson.getSubject()));
//                .andExpect(jsonPath("$.group").value(lesson.getGroup()));
//                .andExpect(jsonPath("$.teacher").value(lesson.getTeacher()));
    }

    @Test
    public void testDelete() throws Exception {
        mockMvc.perform(delete("/lessons/{id}", "1")
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isAccepted());
    }
}
