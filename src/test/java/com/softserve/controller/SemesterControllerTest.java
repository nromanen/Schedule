package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.SemesterDTO;
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

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
@Sql(value = "classpath:create-semesters-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class SemesterControllerTest {
    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/semesters").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        mockMvc.perform(get("/semesters/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(4));
    }

    @Test
    public void testSave() throws Exception {
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setId(1);
        semesterDtoForSave.setDescription("another semester");
        semesterDtoForSave.setStartDay(LocalDate.parse("2020/08/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));
        semesterDtoForSave.setEndDay(LocalDate.parse("2020/09/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));

        mockMvc.perform(post("/semesters").content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {
        SemesterDTO semesterDtoForUpdate = new SemesterDTO();
        semesterDtoForUpdate.setId(4);
        semesterDtoForUpdate.setDescription("another semester");
        semesterDtoForUpdate.setStartDay(LocalDate.of(2020, 7, 20));
        semesterDtoForUpdate.setEndDay(LocalDate.of(2020, 9, 20));

        mockMvc.perform(put("/semesters", 4)
                .content(objectMapper.writeValueAsString(semesterDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(semesterDtoForUpdate.getId()))
                .andExpect(jsonPath("$.description").value(semesterDtoForUpdate.getDescription()))
                .andExpect(jsonPath("$.startDay").value(semesterDtoForUpdate.getStartDay().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))))
                .andExpect(jsonPath("$.endDay").value(semesterDtoForUpdate.getEndDay().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
    }

    @Test
    public void testDelete() throws Exception {
        mockMvc.perform(delete("/semesters/{id}", 5)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void whenSemesterNotFound() throws Exception {
        mockMvc.perform(get("/semesters/100")).andExpect(status().isNotFound());
    }

    @Test
    public void whenSaveExistsSemester() throws Exception {
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setId(4);
        semesterDtoForSave.setDescription("1 semester");
        semesterDtoForSave.setStartDay(LocalDate.of(2020, 1, 20));
        semesterDtoForSave.setEndDay(LocalDate.of(2020, 2, 20));

        mockMvc.perform(post("/semesters").content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenSaveStartDayAfterEndDay() throws Exception {
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setId(2);
        semesterDtoForSave.setDescription("5 semester");
        semesterDtoForSave.setStartDay(LocalDate.of(2020, 10, 20));
        semesterDtoForSave.setEndDay(LocalDate.of(2020, 9, 20));

        mockMvc.perform(post("/semesters").content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenSaveDescriptionIsNull() throws Exception {
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setId(1);
        semesterDtoForSave.setDescription(null);
        semesterDtoForSave.setStartDay(LocalDate.of(2020, 7, 20));
        semesterDtoForSave.setEndDay(LocalDate.of(2020, 9, 20));

        mockMvc.perform(post("/semesters").content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateExistSemester() throws Exception {
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setId(4);
        semesterDtoForSave.setDescription("2 semester");
        semesterDtoForSave.setStartDay(LocalDate.of(2020, 5, 20));
        semesterDtoForSave.setEndDay(LocalDate.of(2020, 6, 20));

        mockMvc.perform(put("/semesters", 2).content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateStartDayAfterEndDay() throws Exception {
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setId(4);
        semesterDtoForSave.setDescription("2 semester");
        semesterDtoForSave.setStartDay(LocalDate.of(2020, 6, 20));
        semesterDtoForSave.setEndDay(LocalDate.of(2020, 5, 20));

        mockMvc.perform(put("/semesters", 2).content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateNullDescription() throws Exception {
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setId(5);
        semesterDtoForSave.setDescription(null);
        semesterDtoForSave.setStartDay(LocalDate.of(2020, 7, 20));
        semesterDtoForSave.setEndDay(LocalDate.of(2020, 9, 20));

        mockMvc.perform(put("/semesters", 2)
                .content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}
