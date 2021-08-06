package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.PeriodDTO;
import com.softserve.dto.SemesterDTO;
import com.softserve.entity.Semester;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TreeSet;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
@WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "MANAGER")
@Sql(value = "classpath:create-semesters-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class SemesterControllerTest {
    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    public void getAllSemesters() throws Exception {
        mockMvc.perform(get("/semesters").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void getSemesterById() throws Exception {
        mockMvc.perform(get("/semesters/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(4));
    }

    @Test
    @WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "USER")
    public void returnForbiddenIfAuthenticatedUserRoleIsNotManager() throws Exception {
        mockMvc.perform(get("/semesters/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    public void saveSemesterIfSavedSemesterDoesNotExistAndStartDayBeginBeforeEndDay() throws Exception {
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.FRIDAY);
        PeriodDTO periodDTO = new PeriodDTO();
        periodDTO.setId(4L);
        periodDTO.setName("first para");
        periodDTO.setStartTime(LocalTime.parse("09:00:00"));
        periodDTO.setEndTime(LocalTime.parse("10:00:00"));
        LinkedHashSet<PeriodDTO> periodDTOS = new LinkedHashSet<>();
        periodDTOS.add(periodDTO);
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setDaysOfWeek(dayOfWeeks);
        semesterDtoForSave.setPeriods(periodDTOS);
        semesterDtoForSave.setId(1);
        semesterDtoForSave.setDescription("another semester");
        semesterDtoForSave.setYear(2020);
        semesterDtoForSave.setStartDay(LocalDate.parse("2020/08/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));
        semesterDtoForSave.setEndDay(LocalDate.parse("2020/09/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));

        mockMvc.perform(post("/semesters").content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void updateSemesterIfUpdatedSemesterDoesNotExistAndStartDayBeginBeforeEndDay() throws Exception {
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.FRIDAY);
        PeriodDTO periodDTO = new PeriodDTO();
        periodDTO.setId(6L);
        periodDTO.setName("updated para");
        periodDTO.setStartTime(LocalTime.parse("09:00:00"));
        periodDTO.setEndTime(LocalTime.parse("10:00:00"));
        LinkedHashSet<PeriodDTO> periodDTOS = new LinkedHashSet<>();
        periodDTOS.add(periodDTO);
        SemesterDTO semesterDtoForUpdate = new SemesterDTO();
        semesterDtoForUpdate.setId(4);
        semesterDtoForUpdate.setYear(2222);
        semesterDtoForUpdate.setDescription("another semester");
        semesterDtoForUpdate.setStartDay(LocalDate.of(2020, 7, 20));
        semesterDtoForUpdate.setEndDay(LocalDate.of(2020, 9, 20));
        semesterDtoForUpdate.setDaysOfWeek(dayOfWeeks);
        semesterDtoForUpdate.setPeriods(periodDTOS);

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
    public void deleteExistSemester() throws Exception {
        mockMvc.perform(delete("/semesters/{id}", 6)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void returnNotFoundIfSemesterNotFoundedById() throws Exception {
        mockMvc.perform(get("/semesters/100")).andExpect(status().isNotFound());
    }

    @Test
    public void returnBadRequestIfSavedSemesterAlreadyExists() throws Exception {
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.FRIDAY);
        PeriodDTO periodDTO = new PeriodDTO();
        periodDTO.setId(4L);
        periodDTO.setName("first para");
        periodDTO.setStartTime(LocalTime.parse("09:00:00"));
        periodDTO.setEndTime(LocalTime.parse("10:00:00"));
        LinkedHashSet<PeriodDTO> periodDTOS = new LinkedHashSet<>();
        periodDTOS.add(periodDTO);
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setDaysOfWeek(dayOfWeeks);
        semesterDtoForSave.setPeriods(periodDTOS);
        semesterDtoForSave.setId(0);
        semesterDtoForSave.setDescription("1 semester");
        semesterDtoForSave.setYear(2020);
        semesterDtoForSave.setStartDay(LocalDate.parse("2020/08/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));
        semesterDtoForSave.setEndDay(LocalDate.parse("2020/09/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));

        mockMvc.perform(post("/semesters").content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnBadRequestIfSavedStartDayBeginAfterEndDay() throws Exception {
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.FRIDAY);
        PeriodDTO periodDTO = new PeriodDTO();
        periodDTO.setId(4L);
        periodDTO.setName("first para");
        periodDTO.setStartTime(LocalTime.parse("09:00:00"));
        periodDTO.setEndTime(LocalTime.parse("10:00:00"));
        LinkedHashSet<PeriodDTO> periodDTOS = new LinkedHashSet<>();
        periodDTOS.add(periodDTO);
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setDaysOfWeek(dayOfWeeks);
        semesterDtoForSave.setPeriods(periodDTOS);
        semesterDtoForSave.setId(2);
        semesterDtoForSave.setDescription("5 semester");
        semesterDtoForSave.setYear(2020);
        semesterDtoForSave.setStartDay(LocalDate.parse("2020/10/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));
        semesterDtoForSave.setEndDay(LocalDate.parse("2020/09/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));

        mockMvc.perform(post("/semesters").content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnBadRequestIfSavedDescriptionIsNull() throws Exception {
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.FRIDAY);
        PeriodDTO periodDTO = new PeriodDTO();
        periodDTO.setId(4L);
        periodDTO.setName("first para");
        periodDTO.setStartTime(LocalTime.parse("09:00:00"));
        periodDTO.setEndTime(LocalTime.parse("10:00:00"));
        LinkedHashSet<PeriodDTO> periodDTOS = new LinkedHashSet<>();
        periodDTOS.add(periodDTO);
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setDaysOfWeek(dayOfWeeks);
        semesterDtoForSave.setPeriods(periodDTOS);
        semesterDtoForSave.setId(1);
        semesterDtoForSave.setDescription(null);
        semesterDtoForSave.setYear(2020);
        semesterDtoForSave.setStartDay(LocalDate.parse("2020/08/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));
        semesterDtoForSave.setEndDay(LocalDate.parse("2020/09/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));

        mockMvc.perform(post("/semesters").content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnBadRequestIfUpdatedSemesterAlreadyExists() throws Exception {
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.FRIDAY);
        PeriodDTO periodDTO = new PeriodDTO();
        periodDTO.setId(4L);
        periodDTO.setName("first para");
        periodDTO.setStartTime(LocalTime.parse("09:00:00"));
        periodDTO.setEndTime(LocalTime.parse("10:00:00"));
        LinkedHashSet<PeriodDTO> periodDTOS = new LinkedHashSet<>();
        periodDTOS.add(periodDTO);
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setDaysOfWeek(dayOfWeeks);
        semesterDtoForSave.setPeriods(periodDTOS);
        semesterDtoForSave.setId(4);
        semesterDtoForSave.setDescription("2 semester");
        semesterDtoForSave.setYear(2020);
        semesterDtoForSave.setStartDay(LocalDate.parse("2020/08/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));
        semesterDtoForSave.setEndDay(LocalDate.parse("2020/09/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));

        mockMvc.perform(put("/semesters").content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnBadRequestIfUpdatedStartDayBeginAfterEndDay() throws Exception {
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setId(4);
        semesterDtoForSave.setDescription("2 semester");
        semesterDtoForSave.setStartDay(LocalDate.of(2020, 6, 20));
        semesterDtoForSave.setEndDay(LocalDate.of(2020, 5, 20));

        mockMvc.perform(put("/semesters").content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnBadRequestIfUpdatedDescriptionIsNull() throws Exception {
        TreeSet<DayOfWeek> dayOfWeeks = new TreeSet<>();
        dayOfWeeks.add(DayOfWeek.MONDAY);
        dayOfWeeks.add(DayOfWeek.FRIDAY);
        PeriodDTO periodDTO = new PeriodDTO();
        periodDTO.setId(4L);
        periodDTO.setName("first para");
        periodDTO.setStartTime(LocalTime.parse("09:00:00"));
        periodDTO.setEndTime(LocalTime.parse("10:00:00"));
        LinkedHashSet<PeriodDTO> periodDTOS = new LinkedHashSet<>();
        periodDTOS.add(periodDTO);
        SemesterDTO semesterDtoForSave = new SemesterDTO();
        semesterDtoForSave.setDaysOfWeek(dayOfWeeks);
        semesterDtoForSave.setPeriods(periodDTOS);
        semesterDtoForSave.setId(5);
        semesterDtoForSave.setDescription(null);
        semesterDtoForSave.setYear(2020);
        semesterDtoForSave.setStartDay(LocalDate.parse("2020/08/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));
        semesterDtoForSave.setEndDay(LocalDate.parse("2020/09/20", DateTimeFormatter.ofPattern("yyyy/MM/dd")));

        mockMvc.perform(put("/semesters")
                .content(objectMapper.writeValueAsString(semesterDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void getDisableSemesters() throws Exception {
        mockMvc.perform(get("/semesters/disabled").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void getCurrentSemester() throws Exception {
        mockMvc.perform(get("/semesters/current"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.currentSemester").value(true));
    }

    @Test
    public void changeCurrentSemester() throws Exception {
        mockMvc.perform(put("/semesters/current").param("semesterId","7"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.currentSemester").value(true));
    }

    @Test
    public void getDefaultSemester() throws Exception {
        mockMvc.perform(get("/semesters/default"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.defaultSemester").value(true));
    }

    @Test
    public void changeDefaultSemester() throws Exception {
        mockMvc.perform(put("/semesters/default").param("semesterId","7"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.defaultSemester").value(true));
    }
}
