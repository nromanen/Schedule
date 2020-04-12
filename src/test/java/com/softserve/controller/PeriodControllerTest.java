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
import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class PeriodControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private PeriodService periodService;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/classes").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        mockMvc.perform(get("/classes/{id}", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(String.valueOf(1)));
    }

    @Test
    public void testSave() throws Exception {
        AddPeriodDTO periodDtoForSave = new AddPeriodDTO();
        periodDtoForSave.setName("save period");
        periodDtoForSave.setStartTime(Timestamp.valueOf("2020-10-15 09:00:00"));
        periodDtoForSave.setEndTime(Timestamp.valueOf("2020-10-15 10:00:00"));

        mockMvc.perform(post("/classes").content(objectMapper.writeValueAsString(periodDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testSaveList() throws Exception {
        AddPeriodDTO periodDtoForList = new AddPeriodDTO();
        periodDtoForList.setName("save list of periods");
        periodDtoForList.setStartTime(Timestamp.valueOf("2020-10-15 11:00:00"));
        periodDtoForList.setEndTime(Timestamp.valueOf("2020-10-15 12:00:00"));
        List<AddPeriodDTO> periodDtoListForSave = new ArrayList<>();
        periodDtoListForSave.add(periodDtoForList);

        mockMvc.perform(post("/classes/all").content(objectMapper.writeValueAsString(periodDtoListForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {
        PeriodDTO periodDtoForUpdate = new PeriodDTO();
        periodDtoForUpdate.setId(2L);
        periodDtoForUpdate.setName("2 para updated");
        periodDtoForUpdate.setStartTime(Timestamp.valueOf("2020-10-15 13:00:00"));
        periodDtoForUpdate.setEndTime(Timestamp.valueOf("2020-10-15 14:00:00"));

        Period periodForCompare = new PeriodMapperImpl().convertToEntity(periodDtoForUpdate);

        mockMvc.perform(put("/classes", 2).content(objectMapper.writeValueAsString(periodDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(periodForCompare.getId()))
                .andExpect(jsonPath("$.class_name").value(periodForCompare.getName()))
                .andExpect(jsonPath("$.startTime").value(new SimpleDateFormat("HH:mm").format(periodForCompare.getStartTime())))
                .andExpect(jsonPath("$.endTime").value(new SimpleDateFormat("HH:mm").format(periodForCompare.getEndTime())));
    }

    @Test
    public void testDelete() throws Exception {
        AddPeriodDTO addPeriodDTO = new AddPeriodDTO();
        addPeriodDTO.setName("delete name");
        addPeriodDTO.setStartTime(Timestamp.valueOf("2020-10-15 16:00:00"));
        addPeriodDTO.setEndTime(Timestamp.valueOf("2020-10-15 17:00:00"));
        Period period = periodService.save(new PeriodMapperImpl().convertToEntity(addPeriodDTO));
        mockMvc.perform(delete("/periods/{id}", String.valueOf(period.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void whenPeriodNotFound() throws Exception {
        mockMvc.perform(get("/classes/50")).andExpect(status().isNotFound());
    }

    @Test
    public void whenSaveExistsPeriod() throws Exception {
        AddPeriodDTO addPeriodDTO = new AddPeriodDTO();
        addPeriodDTO.setName("1 para");
        addPeriodDTO.setStartTime(Timestamp.valueOf("2020-04-11 01:00:00"));
        addPeriodDTO.setEndTime(Timestamp.valueOf("2020-04-11 02:00:00"));
        mockMvc.perform(post("/classes").content(objectMapper.writeValueAsString(addPeriodDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenSaveNameIsNull() throws Exception {
        AddPeriodDTO periodDtoForSave = new AddPeriodDTO();
        periodDtoForSave.setName(null);
        periodDtoForSave.setStartTime(Timestamp.valueOf("2020-10-15 03:00:00"));
        periodDtoForSave.setEndTime(Timestamp.valueOf("2020-10-15 04:00:00"));

        mockMvc.perform(post("/classes").content(objectMapper.writeValueAsString(periodDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateExistName() throws Exception {
        PeriodDTO periodDtoForUpdate = new PeriodDTO();
        periodDtoForUpdate.setId(2L);
        periodDtoForUpdate.setName("1 para");
        periodDtoForUpdate.setStartTime(Timestamp.valueOf("2020-10-15 13:00:00"));
        periodDtoForUpdate.setEndTime(Timestamp.valueOf("2020-10-15 14:00:00"));

        mockMvc.perform(put("/classes", 2).content(objectMapper.writeValueAsString(periodDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateNullName() throws Exception {
        PeriodDTO periodDtoForUpdate = new PeriodDTO();
        periodDtoForUpdate.setId(2L);
        periodDtoForUpdate.setName(null);
        periodDtoForUpdate.setStartTime(Timestamp.valueOf("2020-10-15 13:00:00"));
        periodDtoForUpdate.setEndTime(Timestamp.valueOf("2020-10-15 14:00:00"));

        mockMvc.perform(put("/classes", 2).content(objectMapper.writeValueAsString(periodDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}