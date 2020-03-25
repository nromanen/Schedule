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

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class PeriodControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();
    private Period period = new Period();
    private AddPeriodDTO periodDtoForBefore = new AddPeriodDTO();
    private AddPeriodDTO periodDtoForSave = new AddPeriodDTO();
    private PeriodDTO periodDtoForUpdate = new PeriodDTO();


    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private PeriodService periodService;

    @Before
    public void init() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Before
    public void insertData() {

        //Save new period before all Test methods
        periodDtoForBefore.setClass_name("dto name");
        periodDtoForBefore.setStartTime(Timestamp.valueOf("2020-10-15 01:00:00"));
        periodDtoForBefore.setEndTime(Timestamp.valueOf("2020-10-15 02:00:00"));
        period = new PeriodMapperImpl().convertToEntity(periodDtoForBefore);
        periodService.save(period);

        periodDtoForSave.setClass_name("save name");
        periodDtoForSave.setStartTime(Timestamp.valueOf("2020-10-15 03:00:00"));
        periodDtoForSave.setEndTime(Timestamp.valueOf("2020-10-15 04:00:00"));

        periodDtoForUpdate.setId(period.getId());
        periodDtoForUpdate.setClass_name("update name");
        periodDtoForUpdate.setStartTime(Timestamp.valueOf("2020-10-15 05:00:00"));
        periodDtoForUpdate.setEndTime(Timestamp.valueOf("2020-10-15 06:00:00"));
    }

    @After
    public void deleteData() {
        periodDtoForBefore = null;
        periodService.delete(period);
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

        mockMvc.perform(get("/periods/{id}", String.valueOf(period.getId())).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    public void testSave() throws Exception {

        mockMvc.perform(post("/periods").content(objectMapper.writeValueAsString(periodDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {

        Period periodForCompare = new PeriodMapperImpl().convertToEntity(periodDtoForUpdate);

        mockMvc.perform(put("/periods", String.valueOf(period.getId())).content(objectMapper.writeValueAsString(periodDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(periodForCompare.getId()))
                .andExpect(jsonPath("$.class_name").value(periodForCompare.getName()))
                .andExpect(jsonPath("$.startTime").value(new SimpleDateFormat("HH:mm").format(periodForCompare.getStartTime())))
                .andExpect(jsonPath("$.endTime").value(new SimpleDateFormat("HH:mm").format(periodForCompare.getEndTime())));
    }

    @Test
    public void testDelete() throws Exception {
        AddPeriodDTO addPeriodDTO = new AddPeriodDTO();
        addPeriodDTO.setClass_name("delete name");
        addPeriodDTO.setStartTime(Timestamp.valueOf("2020-10-15 08:00:00"));
        addPeriodDTO.setEndTime(Timestamp.valueOf("2020-10-15 09:00:00"));
        Period period = periodService.save(new PeriodMapperImpl().convertToEntity(addPeriodDTO));
        mockMvc.perform(delete("/periods/{id}", String.valueOf(period.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());
    }
}