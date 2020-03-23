package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.AddPeriodDTO;
import com.softserve.dto.PeriodDTO;
import com.softserve.entity.Period;
import com.softserve.service.PeriodService;
import com.softserve.service.mapper.PeriodMapperImpl;
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

import java.sql.Timestamp;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class PeriodControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Mock
    private PeriodService periodService;

    @Before
    public void init() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/periods").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        AddPeriodDTO periodDTO = new AddPeriodDTO();
//        periodDTO.setId(1L);
        periodDTO.setClass_name("name");
        periodDTO.setStartTime(Timestamp.valueOf("2020-10-15 10:10:11"));
        periodDTO.setEndTime(Timestamp.valueOf("2020-10-15 11:50:11"));
        Period period = new PeriodMapperImpl().convertToEntity(periodDTO);

        when(periodService.save(any(Period.class))).thenReturn(period);

        mockMvc.perform(post("/periods").content(objectMapper.writeValueAsString(period))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(period.getId()));

        mockMvc.perform(get("/periods/{id}", "1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    public void testSave() throws Exception {
        PeriodDTO periodDTO = new PeriodDTO();
        periodDTO.setId(2L);
        periodDTO.setClass_name("name2");
        periodDTO.setStartTime(Timestamp.valueOf("2020-10-15 9:10:11"));
        periodDTO.setEndTime(Timestamp.valueOf("2020-10-15 10:50:11"));
        Period period = new PeriodMapperImpl().convertToEntity(periodDTO);

        when(periodService.save(any(Period.class))).thenReturn(period);

        mockMvc.perform(post("/periods").content(objectMapper.writeValueAsString(period))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(period.getId()));
    }

    @Test
    public void testUpdate() throws Exception {
        PeriodDTO periodDTO = new PeriodDTO();
        periodDTO.setId(2L);
        periodDTO.setClass_name("Some name12345");
        periodDTO.setStartTime(Timestamp.valueOf("2020-10-15 8:10:11"));
        periodDTO.setEndTime(Timestamp.valueOf("2020-10-15 9:50:11"));
        Period period = new PeriodMapperImpl().convertToEntity(periodDTO);

        when(periodService.update(any(Period.class))).thenReturn(period);

        mockMvc.perform(put("/periods", "2").content(objectMapper.writeValueAsString(period))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(period.getId()))
                .andExpect(jsonPath("$.name").value(period.getName()))
                .andExpect(jsonPath("$.startTime").value(period.getStartTime()))
                .andExpect(jsonPath("$.endTime").value(period.getEndTime()));
        testGetAll();
    }

    @Test
    public void testDelete() throws Exception {
        testGetAll();
        mockMvc.perform(delete("/periods/{id}", "1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}