package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.SubjectDTO;
import com.softserve.entity.Subject;
import com.softserve.service.SubjectService;
import com.softserve.service.mapper.SubjectMapperImpl;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.util.NestedServletException;

import static junit.framework.TestCase.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class SubjectControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();
    private Subject subject;
    private RestTemplate restTemplate;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private SubjectService subjectService;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();

        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setName("dto name");
        subject = new SubjectMapperImpl().subjectDTOToSubject(subjectDTO);
        subjectService.save(subject);
    }

    @After
    public void tearDown() {
        subjectService.delete(subject);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/subjects").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        mockMvc.perform(get("/subjects/{id}", String.valueOf(subject.getId())).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(String.valueOf(subject.getId())));
    }

    @Test
    public void testSave() throws Exception {
        SubjectDTO subjectDtoForSave = new SubjectDTO();
        subjectDtoForSave.setName("save name");

        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subjectDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {
        SubjectDTO subjectDtoForUpdate = new SubjectDTO();
        subjectDtoForUpdate.setId(subject.getId());
        subjectDtoForUpdate.setName("update name");

        Subject subjectForCompare = new SubjectMapperImpl().subjectDTOToSubject(subjectDtoForUpdate);

        mockMvc.perform(put("/subjects", String.valueOf(subject.getId())).content(objectMapper.writeValueAsString(subjectDtoForUpdate))
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
        mockMvc.perform(get("/subjects/10")).andExpect(status().isNotFound());
    }

    @Test(expected = NestedServletException.class)
    public void whenSaveExistsSubject() throws Exception {
        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setName("dto name");

        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subjectDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict());
    }

    @Test(expected = NullPointerException.class)
    public void whenSaveNameIsNull() {
        String userInJson = "{\"name\":null}";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(userInJson, headers);
        ResponseEntity<String> response = restTemplate.postForEntity("/subjects", entity, String.class);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}