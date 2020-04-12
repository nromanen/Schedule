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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class TeacherControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private TeacherService teacherService;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/teachers").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGetAllWithWishes() throws Exception {
        mockMvc.perform(get("/teachers/with-wishes").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGetWithWishes() throws Exception {
        mockMvc.perform(get("/teachers/{id}/with-wishes", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        mockMvc.perform(get("/teachers/{id}", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void testSave() throws Exception {
        TeacherDTO teacherDtoForSave = new TeacherDTO();
        teacherDtoForSave.setName("save teacher name");
        teacherDtoForSave.setSurname("save teacher surname");
        teacherDtoForSave.setPatronymic("save teacher patronymic");
        teacherDtoForSave.setPosition("save teacher position");

        mockMvc.perform(post("/teachers").content(objectMapper.writeValueAsString(teacherDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {
        TeacherDTO teacherDtoForUpdate = new TeacherDTO();
        teacherDtoForUpdate.setId(2L);
        teacherDtoForUpdate.setName("Dmytro updated");
        teacherDtoForUpdate.setSurname("Dmytryk updated");
        teacherDtoForUpdate.setPatronymic("Dmytrovych updated");
        teacherDtoForUpdate.setPosition("docent updated");

        Teacher teacherForCompare = new TeacherMapperImpl().teacherDTOToTeacher(teacherDtoForUpdate);

        mockMvc.perform(put("/teachers", 2).content(objectMapper.writeValueAsString(teacherDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(teacherForCompare.getId()))
                .andExpect(jsonPath("$.name").value(teacherForCompare.getName()))
                .andExpect(jsonPath("$.surname").value(teacherForCompare.getSurname()))
                .andExpect(jsonPath("$.patronymic").value(teacherForCompare.getPatronymic()))
                .andExpect(jsonPath("$.position").value(teacherForCompare.getPosition()));
    }

    @Test
    public void testDelete() throws Exception {
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setName("delete name");
        teacherDTO.setSurname("delete surname");
        teacherDTO.setPatronymic("delete patronymic");
        teacherDTO.setPosition("delete position");

        Teacher teacher = teacherService.save(new TeacherMapperImpl().teacherDTOToTeacher(teacherDTO));

        mockMvc.perform(delete("/teachers/{id}", String.valueOf(teacher.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void whenTeacherNotFound() throws Exception {
        mockMvc.perform(get("/teachers/10")).andExpect(status().isNotFound());
    }

    @Test
    public void whenTeacherWithWishesNotFound() throws Exception {
        mockMvc.perform(get("/teachers/100/with-wishes")).andExpect(status().isNotFound());
    }

    @Test
    public void whenSavePositionIsNull() throws Exception {
        TeacherDTO teacherDtoForSave = new TeacherDTO();
        teacherDtoForSave.setName("save name");
        teacherDtoForSave.setSurname("save surname");
        teacherDtoForSave.setPatronymic("save patronymic");
        teacherDtoForSave.setPosition(null);

        mockMvc.perform(post("/teachers").content(objectMapper.writeValueAsString(teacherDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateNullName() throws Exception {
        TeacherDTO teacherDtoForUpdate = new TeacherDTO();
        teacherDtoForUpdate.setId(2L);
        teacherDtoForUpdate.setName(null);
        teacherDtoForUpdate.setSurname("update surname");
        teacherDtoForUpdate.setPatronymic("update patronymic");
        teacherDtoForUpdate.setPosition("update position");

        mockMvc.perform(put("/teachers", 2).content(objectMapper.writeValueAsString(teacherDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
