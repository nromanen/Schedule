package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.TeacherDTO;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
@Sql(value = "classpath:create-teachers-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class TeacherControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void getAllTeachers() throws Exception {
        mockMvc.perform(get("/teachers").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void getAllTeachersWithWishes() throws Exception {
        mockMvc.perform(get("/teachers/with-wishes").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void getTeacherWithWishesById() throws Exception {
        mockMvc.perform(get("/teachers/{id}/with-wishes", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void getTeacherById() throws Exception {
        mockMvc.perform(get("/teachers/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(4));
    }

    @Test
    public void saveTeacher() throws Exception {
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
    public void updateTeacher() throws Exception {
        TeacherDTO teacherDtoForUpdate = new TeacherDTO();
        teacherDtoForUpdate.setId(6L);
        teacherDtoForUpdate.setName("Dmytro updated");
        teacherDtoForUpdate.setSurname("Dmytryk updated");
        teacherDtoForUpdate.setPatronymic("Dmytrovych updated");
        teacherDtoForUpdate.setPosition("docent updated");

        mockMvc.perform(put("/teachers", 6).content(objectMapper.writeValueAsString(teacherDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(teacherDtoForUpdate.getId()))
                .andExpect(jsonPath("$.name").value(teacherDtoForUpdate.getName()))
                .andExpect(jsonPath("$.surname").value(teacherDtoForUpdate.getSurname()))
                .andExpect(jsonPath("$.patronymic").value(teacherDtoForUpdate.getPatronymic()))
                .andExpect(jsonPath("$.position").value(teacherDtoForUpdate.getPosition()));
    }

    @Test
    public void deleteTeacher() throws Exception {
        mockMvc.perform(delete("/teachers/{id}", 5)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void returnNotFoundIfTeacherNotFoundedById() throws Exception {
        mockMvc.perform(get("/teachers/100")).andExpect(status().isNotFound());
    }

    @Test
    public void returnNotFoundIfTeacherWithWishesNotFoundedById() throws Exception {
        mockMvc.perform(get("/teachers/100/with-wishes")).andExpect(status().isNotFound());
    }

    @Test
    public void returnBadRequestIfSavedPositionIsNull() throws Exception {
        TeacherDTO teacherDtoForSave = new TeacherDTO();
        teacherDtoForSave.setName("save name");
        teacherDtoForSave.setSurname("save surname");
        teacherDtoForSave.setPatronymic("save patronymic");
        teacherDtoForSave.setPosition(null);

        mockMvc.perform(post("/teachers").content(objectMapper.writeValueAsString(teacherDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnBadRequestIfUpdatedNameIsNull() throws Exception {
        TeacherDTO teacherDtoForUpdate = new TeacherDTO();
        teacherDtoForUpdate.setId(7L);
        teacherDtoForUpdate.setName(null);
        teacherDtoForUpdate.setSurname("update surname");
        teacherDtoForUpdate.setPatronymic("update patronymic");
        teacherDtoForUpdate.setPosition("update position");

        mockMvc.perform(put("/teachers", 7).content(objectMapper.writeValueAsString(teacherDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}
