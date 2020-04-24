package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.SubjectDTO;
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
@Sql(value = "classpath:create-subject-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class SubjectControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void getAllSubjects() throws Exception {
        mockMvc.perform(get("/subjects").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void getSubjectById() throws Exception {
        mockMvc.perform(get("/subjects/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(4));
    }

    @Test
    public void saveSubjectIfSavedSubjectDoesNotExist() throws Exception {
        SubjectDTO subjectDtoForSave = new SubjectDTO();
        subjectDtoForSave.setName("save subject name");

        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subjectDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void updateSubjectIfUpdatedSubjectDoesNotExist() throws Exception {
        SubjectDTO subjectDtoForUpdate = new SubjectDTO();
        subjectDtoForUpdate.setId(5L);
        subjectDtoForUpdate.setName("updated History");

        mockMvc.perform(put("/subjects", 5).content(objectMapper.writeValueAsString(subjectDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(subjectDtoForUpdate.getId()))
                .andExpect(jsonPath("$.name").value(subjectDtoForUpdate.getName()));
    }

    @Test
    public void deleteExistSubject() throws Exception {
        mockMvc.perform(delete("/subjects/{id}", 5)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void returnNotFoundIfSubjectNotFoundedById() throws Exception {
        mockMvc.perform(get("/subjects/100")).andExpect(status().isNotFound());
    }

    @Test
    public void returnBadRequestIfSavedSubjectAlreadyExists() throws Exception {
        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setName("Biology");

        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subjectDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnBadRequestIfSavedNameIsNull() throws Exception {
        SubjectDTO subjectDtoForSave = new SubjectDTO();
        subjectDtoForSave.setName(null);

        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subjectDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnBadRequestIfUpdatedSubjectAlreadyExists() throws Exception {
        SubjectDTO subjectDtoForUpdate = new SubjectDTO();
        subjectDtoForUpdate.setId(4L);
        subjectDtoForUpdate.setName("Astronomy");

        mockMvc.perform(put("/subjects", 4).content(objectMapper.writeValueAsString(subjectDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnBadRequestIfUpdatedNameIsNull() throws Exception {
        SubjectDTO subjectDtoForUpdate = new SubjectDTO();
        subjectDtoForUpdate.setId(6L);
        subjectDtoForUpdate.setName(null);

        mockMvc.perform(put("/subjects", 6).content(objectMapper.writeValueAsString(subjectDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}