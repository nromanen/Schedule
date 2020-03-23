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

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class SubjectControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Mock
    private SubjectService subjectService;

    @Before
    public void init() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/subjects").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setId(1L);
        subjectDTO.setName("history");
        Subject subject = new SubjectMapperImpl().subjectDTOToSubject(subjectDTO);

        when(subjectService.save(any(Subject.class))).thenReturn(subject);

        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subject))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(subject.getId()));

        mockMvc.perform(get("/subjects/{id}", "1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    public void testSave() throws Exception {
        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setId(2L);
        subjectDTO.setName("biology");
        Subject subject = new SubjectMapperImpl().subjectDTOToSubject(subjectDTO);

        when(subjectService.save(any(Subject.class))).thenReturn(subject);

        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subject))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(subject.getId()));
    }

    @Test
    public void testUpdate() throws Exception {
        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setId(2L);
        subjectDTO.setName("Geometry");
        Subject subject = new SubjectMapperImpl().subjectDTOToSubject(subjectDTO);

        when(subjectService.update(any(Subject.class))).thenReturn(subject);

        mockMvc.perform(put("/subjects", "2").content(objectMapper.writeValueAsString(subject))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(subject.getId()))
                .andExpect(jsonPath("$.name").value(subject.getName()));
        testGetAll();
    }

    @Test
    public void testDelete() throws Exception {
        testGetAll();
        mockMvc.perform(delete("/subjects/{id}", "1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
