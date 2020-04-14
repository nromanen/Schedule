package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.ScheduleSaveDTO;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.service.ScheduleService;
import com.softserve.service.mapper.ScheduleSaveMapperImpl;
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

import java.time.DayOfWeek;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class ScheduleControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private ScheduleService scheduleService;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void getAll() throws Exception {
        mockMvc.perform(get("/schedules").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGetInfo() throws Exception {
        mockMvc.perform(get("/schedules/getInfo?semesterId=1&dayOfWeek=MONDAY&evenOdd=ODD&classId=1&lessonId=1").contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testSave() throws Exception {
        ScheduleSaveDTO scheduleSaveDTO = new ScheduleSaveDTO();
        scheduleSaveDTO.setDayOfWeek(DayOfWeek.THURSDAY);
        scheduleSaveDTO.setEvenOdd(EvenOdd.ODD);
        scheduleSaveDTO.setLessonId(3L);
        scheduleSaveDTO.setPeriodId(3L);
        scheduleSaveDTO.setRoomId(3L);
        scheduleSaveDTO.setSemesterId(3L);

        mockMvc.perform(post("/schedules").content(objectMapper.writeValueAsString(scheduleSaveDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testDelete() throws Exception {
        ScheduleSaveDTO scheduleSaveDTO = new ScheduleSaveDTO();
        scheduleSaveDTO.setDayOfWeek(DayOfWeek.THURSDAY);
        scheduleSaveDTO.setEvenOdd(EvenOdd.ODD);
        scheduleSaveDTO.setLessonId(2L);
        scheduleSaveDTO.setPeriodId(1L);
        scheduleSaveDTO.setRoomId(1L);
        scheduleSaveDTO.setSemesterId(2L);

        Schedule schedule = scheduleService.save(new ScheduleSaveMapperImpl().scheduleSaveDTOToSchedule(scheduleSaveDTO));

        mockMvc.perform(delete("/schedules/{id}", String.valueOf(schedule.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetInfoWithConflictInEvenOdd() throws Exception {
        mockMvc.perform(get("/schedules/getInfo?semesterId=1&dayOfWeek=MONDAY&evenOdd=EVEN&classId=1&lessonId=1").contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGetInfoWithConflictInPeriod() throws Exception {
        mockMvc.perform(get("/schedules/getInfo?semesterId=1&dayOfWeek=MONDAY&evenOdd=EVEN&classId=2&lessonId=2").contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void notFounded() throws Exception {
        mockMvc.perform(get("/schedules/getInfo?semesterId=4&dayOfWeek=MONDAY&evenOdd=EVEN&classId=4&lessonId=4").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void whenSaveExistsSchedule() throws Exception {
        ScheduleSaveDTO scheduleSaveDTO = new ScheduleSaveDTO();
        scheduleSaveDTO.setDayOfWeek(DayOfWeek.THURSDAY);
        scheduleSaveDTO.setEvenOdd(EvenOdd.ODD);
        scheduleSaveDTO.setLessonId(3L);
        scheduleSaveDTO.setPeriodId(3L);
        scheduleSaveDTO.setRoomId(3L);
        scheduleSaveDTO.setSemesterId(3L);

        mockMvc.perform(post("/schedules").content(objectMapper.writeValueAsString(scheduleSaveDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenSaveIsNull() throws Exception {
        ScheduleSaveDTO scheduleSaveDTO = new ScheduleSaveDTO();
        scheduleSaveDTO.setDayOfWeek(DayOfWeek.THURSDAY);
        scheduleSaveDTO.setEvenOdd(EvenOdd.ODD);
        scheduleSaveDTO.setLessonId(null);
        scheduleSaveDTO.setPeriodId(3L);
        scheduleSaveDTO.setRoomId(3L);
        scheduleSaveDTO.setSemesterId(3L);

        mockMvc.perform(post("/schedules").content(objectMapper.writeValueAsString(scheduleSaveDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}
