package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.TeacherDTO;
import com.softserve.entity.Teacher;
import com.softserve.service.TeacherService;
import com.softserve.service.mapper.TeacherMapperImpl;
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

//@Test
//@EnableWebMvc
//@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class, TeacherController.class, TeacherServiceImpl.class})
//@WebAppConfiguration
//public class TeacherControllerTest extends AbstractTestNGSpringContextTests {
//
//    private MockMvc mockMvc;
//    private ObjectMapper objectMapper;
//
//    @Autowired
//    private WebApplicationContext wac;
//
//    @Mock
//    private TeacherService teacherService;
//
//    @BeforeTest
//    public void init() {
//        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
//        MockitoAnnotations.initMocks(this);
//    }
//
//    @Test
//    public void testGetAll() throws Exception {
//        mockMvc.perform(get("/teachers").accept(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isOk())
//                .andExpect(content().contentType("application/json"));
//    }
//
//    @BeforeMethod
//    public void insertData() throws Exception {
//        TeacherDTO teacherDTO = new TeacherDTO();
//        teacherDTO.setId(1L);
//        teacherDTO.setName("Ivan");
//        teacherDTO.setSurname("Ivanov");
//        teacherDTO.setPatronymic("Ivanovych");
//        teacherDTO.setPosition("teacher");
//        Teacher teacher = new TeacherMapperImpl().teacherDTOToTeacher(teacherDTO);
//
//        when(teacherService.save(any(Teacher.class))).thenReturn(teacher);
//
//        mockMvc.perform(post("/teachers").content(objectMapper.writeValueAsString(teacher))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(teacher.getId()));
//    }
//
//    @Test
//    public void testGet() throws Exception {
//
//        mockMvc.perform(get("/teachers/{id}","1").contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().is2xxSuccessful())
//                .andExpect(content().contentType("application/json"))
//                .andExpect(jsonPath("$.id").value("1"));
//    }
//
//    @Test
//    public void testSave() throws Exception {
//        TeacherDTO teacherDTO = new TeacherDTO();
//        teacherDTO.setId(2L);
//        teacherDTO.setName("Ibragimov");
//        teacherDTO.setSurname("Ibragim");
//        teacherDTO.setPatronymic("Ibragimovych");
//        teacherDTO.setPosition("teacher");
//        Teacher teacher = new TeacherMapperImpl().teacherDTOToTeacher(teacherDTO);
//
//        when(teacherService.save(any(Teacher.class))).thenReturn(teacher);
//
//        mockMvc.perform(post("/teachers").content(objectMapper.writeValueAsString(teacher))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(teacher.getId()));
//    }
//
//    @Test
//    public void testUpdate() throws Exception {
//        TeacherDTO teacherDTO = new TeacherDTO();
//        teacherDTO.setId(2L);
//        teacherDTO.setName("Petro");
//        teacherDTO.setSurname("Petrov");
//        teacherDTO.setPatronymic("Petrovych");
//        teacherDTO.setPosition("lector");
//        Teacher teacher = new TeacherMapperImpl().teacherDTOToTeacher(teacherDTO);
//
//        when(teacherService.update(any(Teacher.class))).thenReturn(teacher);
//
//        mockMvc.perform(put("/teachers", "2").content(objectMapper.writeValueAsString(teacher))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isAccepted())
//                .andExpect(jsonPath("$.id").value(teacher.getId()))
//                .andExpect(jsonPath("$.name").value(teacher.getName()))
//                .andExpect(jsonPath("$.surname").value(teacher.getSurname()))
//                .andExpect(jsonPath("$.patronymic").value(teacher.getPatronymic()))
//                .andExpect(jsonPath("$.position").value(teacher.getPosition()));
//        testGetAll();
//    }
//
//    @Test
//    public void testDelete() throws Exception {
//        mockMvc.perform(delete("/teachers/{id}", "1").contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isAccepted());
//    }
//}

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class TeacherControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Mock
    private TeacherService teacherService;

    @Before
    public void init() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/teachers").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setId(1L);
        teacherDTO.setName("Ivan");
        teacherDTO.setSurname("Ivanov");
        teacherDTO.setPatronymic("Ivanovych");
        teacherDTO.setPosition("teacher");
        Teacher teacher = new TeacherMapperImpl().teacherDTOToTeacher(teacherDTO);

        when(teacherService.save(any(Teacher.class))).thenReturn(teacher);

        mockMvc.perform(post("/teachers").content(objectMapper.writeValueAsString(teacher))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(teacher.getId()));

        mockMvc.perform(get("/teachers/{id}","1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    public void testSave() throws Exception {
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setId(2L);
        teacherDTO.setName("Ibragimov");
        teacherDTO.setSurname("Ibragim");
        teacherDTO.setPatronymic("Ibragimovych");
        teacherDTO.setPosition("teacher");
        Teacher teacher = new TeacherMapperImpl().teacherDTOToTeacher(teacherDTO);

        when(teacherService.save(any(Teacher.class))).thenReturn(teacher);

        mockMvc.perform(post("/teachers").content(objectMapper.writeValueAsString(teacher))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(teacher.getId()));
    }

    @Test
    public void testUpdate() throws Exception {
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setId(2L);
        teacherDTO.setName("Petro");
        teacherDTO.setSurname("Petrov");
        teacherDTO.setPatronymic("Petrovych");
        teacherDTO.setPosition("lector");
        Teacher teacher = new TeacherMapperImpl().teacherDTOToTeacher(teacherDTO);

        when(teacherService.update(any(Teacher.class))).thenReturn(teacher);

        mockMvc.perform(put("/teachers", "2").content(objectMapper.writeValueAsString(teacher))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.id").value(teacher.getId()))
                .andExpect(jsonPath("$.name").value(teacher.getName()))
                .andExpect(jsonPath("$.surname").value(teacher.getSurname()))
                .andExpect(jsonPath("$.patronymic").value(teacher.getPatronymic()))
                .andExpect(jsonPath("$.position").value(teacher.getPosition()));
        testGetAll();
    }

    @Test
    public void testDelete() throws Exception {
        testGetAll();
        mockMvc.perform(delete("/teachers/{id}", "1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isAccepted());
    }
}
