package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.dto.AddPeriodDTO;
import com.softserve.dto.PeriodDTO;
import com.softserve.entity.Period;
import com.softserve.mapper.PeriodMapperImpl;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Tag("integration")
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "MANAGER")
@Sql(value = "classpath:create-periods-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class PeriodControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;
    @Test
    void getAllPeriods() throws Exception {
        mockMvc.perform(get("/classes").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void getPeriodById() throws Exception {
        mockMvc.perform(get("/classes/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(4));
    }

    @Test
    @WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "USER")
    void returnForbiddenIfAuthenticatedUserRoleIsNotManager() throws Exception {
        mockMvc.perform(get("/classes/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void savePeriodIfSavedPeriodDoesNotExist() throws Exception {
        AddPeriodDTO periodDtoForSave = new AddPeriodDTO();
        periodDtoForSave.setName("save period");
        periodDtoForSave.setStartTime(LocalTime.parse("09:00:00"));
        periodDtoForSave.setEndTime(LocalTime.parse("10:00:00"));

        mockMvc.perform(post("/classes").content(objectMapper.writeValueAsString(periodDtoForSave))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    void saveListOfPeriodsIfAllOfThemDoNotExist() throws Exception {
        AddPeriodDTO periodDtoForList = new AddPeriodDTO();
        periodDtoForList.setName("save list of periods");
        periodDtoForList.setStartTime(LocalTime.parse("11:00:00"));
        periodDtoForList.setEndTime(LocalTime.parse("12:00:00"));
        List<AddPeriodDTO> periodDtoListForSave = new ArrayList<>();
        periodDtoListForSave.add(periodDtoForList);

        mockMvc.perform(post("/classes/all").content(objectMapper.writeValueAsString(periodDtoListForSave))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    void updatePeriodIfUpdatedPeriodDoesNotExist() throws Exception {
        PeriodDTO periodDtoForUpdate = new PeriodDTO();
        periodDtoForUpdate.setId(4L);
        periodDtoForUpdate.setName("1 para updated");
        periodDtoForUpdate.setStartTime(LocalTime.parse("13:00:00"));
        periodDtoForUpdate.setEndTime(LocalTime.parse("14:00:00"));

        Period periodForCompare = new PeriodMapperImpl().convertToEntity(periodDtoForUpdate);

        mockMvc.perform(put("/classes", 4).content(objectMapper.writeValueAsString(periodDtoForUpdate))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(periodForCompare.getId()))
                .andExpect(jsonPath("$.class_name").value(periodForCompare.getName()));
    }

    @Test
    void deleteExistPeriod() throws Exception {
        mockMvc.perform(delete("/classes/{id}", 5)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void returnNotFoundIfPeriodNotFoundedById() throws Exception {
        mockMvc.perform(get("/classes/100")).andExpect(status().isNotFound());
    }

    @Test
    void returnBadRequestIfSavedPeriodAlreadyExist() throws Exception {
        AddPeriodDTO addPeriodDTO = new AddPeriodDTO();
        addPeriodDTO.setName("1 para");
        addPeriodDTO.setStartTime(LocalTime.parse("01:00:00"));
        addPeriodDTO.setEndTime(LocalTime.parse("02:00:00"));
        mockMvc.perform(post("/classes").content(objectMapper.writeValueAsString(addPeriodDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnBadRequestIfSavedNameIsNull() throws Exception {
        AddPeriodDTO periodDtoForSave = new AddPeriodDTO();
        periodDtoForSave.setName(null);
        periodDtoForSave.setStartTime(LocalTime.parse("03:00:00"));
        periodDtoForSave.setEndTime(LocalTime.parse("04:00:00"));

        mockMvc.perform(post("/classes")
                        .content(objectMapper.writeValueAsString(periodDtoForSave))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnBadRequestIfUpdatedPeriodAlreadyExist() throws Exception {
        PeriodDTO periodDtoForUpdate = new PeriodDTO();
        periodDtoForUpdate.setId(6L);
        periodDtoForUpdate.setName("1 para");
        periodDtoForUpdate.setStartTime(LocalTime.parse("13:00:00"));
        periodDtoForUpdate.setEndTime(LocalTime.parse("14:00:00"));

        mockMvc.perform(put("/classes", 6).content(objectMapper.writeValueAsString(periodDtoForUpdate))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnBadRequestIfUpdatedNameIsNull() throws Exception {
        PeriodDTO periodDtoForUpdate = new PeriodDTO();
        periodDtoForUpdate.setId(5L);
        periodDtoForUpdate.setName(null);
        periodDtoForUpdate.setStartTime(LocalTime.parse("13:00:00"));
        periodDtoForUpdate.setEndTime(LocalTime.parse("14:00:00"));

        mockMvc.perform(put("/classes", 5).content(objectMapper.writeValueAsString(periodDtoForUpdate))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnBadRequestIfSavedPeriodIntersectsWithOtherPeriod() throws Exception {
        AddPeriodDTO periodDtoForSave = new AddPeriodDTO();
        periodDtoForSave.setName("intersect period");
        periodDtoForSave.setStartTime(LocalTime.parse("03:30:00"));
        periodDtoForSave.setEndTime(LocalTime.parse("04:40:00"));

        mockMvc.perform(post("/classes").content(objectMapper.writeValueAsString(periodDtoForSave))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllPublicClasses() throws Exception {
        mockMvc.perform(get("/public/classes").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }
}
