package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.AddPeriodDTO;
import com.softserve.dto.PeriodDTO;
import com.softserve.entity.Period;
import com.softserve.service.mapper.PeriodMapperImpl;
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

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
@Sql(value = "classpath:create-periods-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class PeriodControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

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
        mockMvc.perform(get("/classes/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(4));
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
        periodDtoForUpdate.setId(4L);
        periodDtoForUpdate.setName("1 para updated");
        periodDtoForUpdate.setStartTime(Timestamp.valueOf("2020-10-15 13:00:00"));
        periodDtoForUpdate.setEndTime(Timestamp.valueOf("2020-10-15 14:00:00"));

        Period periodForCompare = new PeriodMapperImpl().convertToEntity(periodDtoForUpdate);

        mockMvc.perform(put("/classes", 4).content(objectMapper.writeValueAsString(periodDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(periodForCompare.getId()))
                .andExpect(jsonPath("$.class_name").value(periodForCompare.getName()));
//                .andExpect(jsonPath("$.startTime").value(new SimpleDateFormat("HH:mm").format(periodForCompare.getStartTime())))
//                .andExpect(jsonPath("$.endTime").value(new SimpleDateFormat("HH:mm").format(periodForCompare.getEndTime())));
    }

    @Test
    public void testDelete() throws Exception {
        mockMvc.perform(delete("/classes/{id}", 5)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void whenPeriodNotFound() throws Exception {
        mockMvc.perform(get("/classes/100")).andExpect(status().isNotFound());
    }

    @Test
    public void whenSaveExistsPeriod() throws Exception {
        AddPeriodDTO addPeriodDTO = new AddPeriodDTO();
        addPeriodDTO.setName("1 para");
        addPeriodDTO.setStartTime(Timestamp.valueOf("2020-04-11 01:00:00"));
        addPeriodDTO.setEndTime(Timestamp.valueOf("2020-04-11 02:00:00"));
        mockMvc.perform(post("/classes").content(objectMapper.writeValueAsString(addPeriodDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
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
                .andDo(print())
                .andExpect(status().isInternalServerError());
    }

//    @Test
//    public void whenUpdateExistName() throws Exception {
//        PeriodDTO periodDtoForUpdate = new PeriodDTO();
//        periodDtoForUpdate.setId(6L);
//        periodDtoForUpdate.setName("1 para");
//        periodDtoForUpdate.setStartTime(Timestamp.valueOf("2020-10-15 13:00:00"));
//        periodDtoForUpdate.setEndTime(Timestamp.valueOf("2020-10-15 14:00:00"));
//
//        mockMvc.perform(put("/classes", 6).content(objectMapper.writeValueAsString(periodDtoForUpdate))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isInternalServerError());
//    }

    @Test
    public void whenUpdateNullName() throws Exception {
        PeriodDTO periodDtoForUpdate = new PeriodDTO();
        periodDtoForUpdate.setId(5L);
        periodDtoForUpdate.setName(null);
        periodDtoForUpdate.setStartTime(Timestamp.valueOf("2020-10-15 13:00:00"));
        periodDtoForUpdate.setEndTime(Timestamp.valueOf("2020-10-15 14:00:00"));

        mockMvc.perform(put("/classes", 5).content(objectMapper.writeValueAsString(periodDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenPeriodIntersectWithAnother() throws Exception {
        AddPeriodDTO periodDtoForSave = new AddPeriodDTO();
        periodDtoForSave.setName("intersect period");
        periodDtoForSave.setStartTime(Timestamp.valueOf("1970-01-01 03:30:00"));
        periodDtoForSave.setEndTime(Timestamp.valueOf("1970-01-01 04:30:00"));

        mockMvc.perform(post("/classes").content(objectMapper.writeValueAsString(periodDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}