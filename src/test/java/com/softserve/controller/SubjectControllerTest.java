package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.SubjectDTO;
import com.softserve.entity.Subject;
import com.softserve.service.SubjectService;
import com.softserve.service.mapper.SubjectMapperImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
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
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class SubjectControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private SubjectService subjectService;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/subjects").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        mockMvc.perform(get("/subjects/{id}", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void testSave() throws Exception {
        SubjectDTO subjectDtoForSave = new SubjectDTO();
        subjectDtoForSave.setName("save subject name");

        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subjectDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {
        SubjectDTO subjectDtoForUpdate = new SubjectDTO();
        subjectDtoForUpdate.setId(1L);
        subjectDtoForUpdate.setName("updated History");

        Subject subjectForCompare = new SubjectMapperImpl().subjectDTOToSubject(subjectDtoForUpdate);

        mockMvc.perform(put("/subjects", 1).content(objectMapper.writeValueAsString(subjectDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(subjectForCompare.getId()))
                .andExpect(jsonPath("$.name").value(subjectForCompare.getName()));
    }

    @Test
    public void testDelete() throws Exception {
        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setName("delete name");
        Subject subject = subjectService.save(new SubjectMapperImpl().subjectDTOToSubject(subjectDTO));

        mockMvc.perform(delete("/subjects/{id}", String.valueOf(subject.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void whenSubjectNotFound() throws Exception {
        mockMvc.perform(get("/subjects/100")).andExpect(status().isNotFound());
    }

    @Test
    public void whenSaveExistsSubject() throws Exception {
        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setName("Biology");

        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subjectDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenSaveNameIsNull() throws Exception {
        SubjectDTO subjectDtoForSave = new SubjectDTO();
        subjectDtoForSave.setName(null);

        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subjectDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateExistsSubject() throws Exception {
        SubjectDTO subjectDtoForUpdate = new SubjectDTO();
        subjectDtoForUpdate.setId(1L);
        subjectDtoForUpdate.setName("Astronomy");

        mockMvc.perform(put("/subjects", 1).content(objectMapper.writeValueAsString(subjectDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateNullName() throws Exception {
        SubjectDTO subjectDtoForUpdate = new SubjectDTO();
        subjectDtoForUpdate.setId(1L);
        subjectDtoForUpdate.setName(null);

        mockMvc.perform(put("/subjects", 1).content(objectMapper.writeValueAsString(subjectDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}