package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.AddPeriodDTO;
import com.softserve.dto.SubjectDTO;
import com.softserve.entity.Period;
import com.softserve.entity.Subject;
import com.softserve.service.SubjectService;
import com.softserve.service.mapper.PeriodMapperImpl;
import com.softserve.service.mapper.SubjectMapperImpl;
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

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
//@WebAppConfiguration
//public class SubjectControllerTest {
//
//    private MockMvc mockMvc;
//    private ObjectMapper objectMapper = new ObjectMapper();
//
//    @Autowired
//    private WebApplicationContext wac;
//
//    @Autowired
//    private SubjectService subjectService;
//
//    @Before
//    public void init() {
//        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
//    }
//
//    @Test
//    public void testGetAll() throws Exception {
//        mockMvc.perform(get("/subjects").accept(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType("application/json"));
//    }
//
//    @Test
//    public void testGet() throws Exception {
//        SubjectDTO subjectDTO = new SubjectDTO();
//        subjectDTO.setId(1L);
//        subjectDTO.setName("history");
//        Subject subject = new SubjectMapperImpl().subjectDTOToSubject(subjectDTO);
//
//        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subject))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(subject.getId()));
//
//        mockMvc.perform(get("/subjects/{id}", "1").contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType("application/json"))
//                .andExpect(jsonPath("$.id").value("1"));
//    }
//
//    @Test
//    public void testSave() throws Exception {
//        SubjectDTO subjectDTO = new SubjectDTO();
//        subjectDTO.setId(2L);
//        subjectDTO.setName("biology");
//        Subject subject = new SubjectMapperImpl().subjectDTOToSubject(subjectDTO);
//
//        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subject))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(subject.getId()));
//    }
//
//    @Test
//    public void testUpdate() throws Exception {
//        SubjectDTO subjectDTO = new SubjectDTO();
//        subjectDTO.setId(2L);
//        subjectDTO.setName("Geometry");
//        Subject subject = new SubjectMapperImpl().subjectDTOToSubject(subjectDTO);
//
//        mockMvc.perform(put("/subjects", "2").content(objectMapper.writeValueAsString(subject))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(subject.getId()))
//                .andExpect(jsonPath("$.name").value(subject.getName()));
//    }
//
//    @Test
//    public void testDelete() throws Exception {
//        mockMvc.perform(delete("/subjects/{id}", "1")
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk());
//    }
//}

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class SubjectControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();
    private Subject subject = new Subject();
    private SubjectDTO subjectDtoForBefore = new SubjectDTO();
    private SubjectDTO subjectDtoForSave = new SubjectDTO();
    private SubjectDTO subjectDtoForUpdate = new SubjectDTO();


    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private SubjectService subjectService;

    @Before
    public void init() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Before
    public void insertData() {

        //Save new period before all Test methods
        subjectDtoForBefore.setName("dto name");
        subject = new SubjectMapperImpl().subjectDTOToSubject(subjectDtoForBefore);
        subjectService.save(subject);

        subjectDtoForSave.setName("save name");

        subjectDtoForUpdate.setId(subject.getId());
        subjectDtoForUpdate.setName("update name");
    }

    @After
    public void deleteData() {
        subjectDtoForBefore = null;
        subjectService.delete(subject);
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

        mockMvc.perform(get("/subjects/{id}", String.valueOf(subject.getId())).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    public void testSave() throws Exception {

        mockMvc.perform(post("/subjects").content(objectMapper.writeValueAsString(subjectDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {

        Subject subjectForCompare = new SubjectMapperImpl().subjectDTOToSubject(subjectDtoForUpdate);

        mockMvc.perform(put("/subjects", String.valueOf(subject.getId())).content(objectMapper.writeValueAsString(subjectDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
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
                .andDo(print())
                .andExpect(status().isOk());
    }
}