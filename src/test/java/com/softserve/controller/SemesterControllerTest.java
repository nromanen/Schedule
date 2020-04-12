package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.SemesterDTO;
import com.softserve.entity.Semester;
import com.softserve.service.SemesterService;
import com.softserve.service.mapper.SemesterMapperImpl;
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
public class SemesterControllerTest {
    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private SemesterService semesterService;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/semesters").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        mockMvc.perform(get("/semesters/{id}", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(String.valueOf(1)));
    }

    @Test
    public void testSave() throws Exception {
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setNumber(4);
        semesterDtoForSave.setYear(2020);

        mockMvc.perform(post("/semesters").content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {
        SemesterDTO semesterDtoForUpdate = new SemesterDTO();
        semesterDtoForUpdate.setNumber(11);
        semesterDtoForUpdate.setYear(2022);
        semesterDtoForUpdate.setId(1);

        Semester semesterForCompare = new SemesterMapperImpl().semesterDTOToSemester(semesterDtoForUpdate);

        mockMvc.perform(put("/semesters", "1")
                .content(objectMapper.writeValueAsString(semesterDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(semesterForCompare.getId()))
                .andExpect(jsonPath("$.number").value(semesterForCompare.getNumber()))
                .andExpect(jsonPath("$.year").value(semesterForCompare.getYear()));
    }

    @Test
    public void testDelete() throws Exception {
        SemesterDTO semesterDTO = new SemesterDTO();
        semesterDTO.setNumber(1);
        semesterDTO.setYear(2020);
        Semester semesterForDelete = semesterService.save(new SemesterMapperImpl().semesterDTOToSemester(semesterDTO));

        mockMvc.perform(delete("/semesters/{id}", String.valueOf(semesterForDelete.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void whenSemesterNotFound() throws Exception {
        mockMvc.perform(get("/semesters/10")).andExpect(status().isNotFound());
    }

    @Test
    public void whenSaveExistsSemester() throws Exception {
        SemesterDTO semesterDTO = new SemesterDTO();
        semesterDTO.setNumber(1);
        semesterDTO.setYear(2020);

        mockMvc.perform(post("/semesters").content(objectMapper.writeValueAsString(semesterDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenSaveNumberIsNull() throws Exception {
        SemesterDTO semesterDTO = new SemesterDTO();
        semesterDTO.setNumber(0);
        semesterDTO.setYear(2020);

        mockMvc.perform(post("/semesters").content(objectMapper.writeValueAsString(semesterDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateExistSemester() throws Exception {
        SemesterDTO semesterDtoForUpdate = new SemesterDTO();
        semesterDtoForUpdate.setNumber(1);
        semesterDtoForUpdate.setYear(2022);
        semesterDtoForUpdate.setId(2);

        mockMvc.perform(put("/semesters", 2).content(objectMapper.writeValueAsString(semesterDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateNullNumber() throws Exception {
        SemesterDTO semesterDtoForUpdate = new SemesterDTO();
        semesterDtoForUpdate.setNumber(0);
        semesterDtoForUpdate.setYear(2022);
        semesterDtoForUpdate.setId(2);

        mockMvc.perform(put("/semesters", 2)
                .content(objectMapper.writeValueAsString(semesterDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
