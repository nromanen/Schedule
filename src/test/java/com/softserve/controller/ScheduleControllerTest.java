package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.dto.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.service.GroupService;
import com.softserve.service.LessonService;
import com.softserve.service.SubjectService;
import com.softserve.service.TeacherService;
import org.assertj.core.api.SoftAssertions;
import org.hamcrest.Matchers;
import org.hamcrest.collection.IsEmptyCollection;
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
import org.springframework.test.web.servlet.MvcResult;

import java.time.DayOfWeek;
import java.util.Arrays;
import java.util.List;

import static com.softserve.entity.enums.LessonType.LECTURE;
import static org.hamcrest.core.StringContains.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Tag("integration")
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "MANAGER")
@Sql(value = "classpath:create-schedule-before.sql")
class ScheduleControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private LessonService lessonService;

    @Test
    void getListOfAllSchedules() throws Exception {
        mockMvc.perform(get("/schedules").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void getListOfAllSchedulesBySemesterId() throws Exception {
        mockMvc.perform(get("/schedules/semester").param("semesterId", "4").contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void returnEmptyListIfGetListOfAllSchedulesByNoExistSemester() throws Exception {
        mockMvc.perform(get("/schedules/semester").param("semesterId", "100").contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", IsEmptyCollection.empty()))
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void getInfoForNoExistScheduleBySemesterIdByDayOfWeekByEvenOddByClassIdByLessonId() throws Exception {
        // Create and save teacher
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setPatronymic("Ivanovych");
        teacherDTO.setSurname("Tymysh");
        teacherDTO.setName("Oleg");
        teacherDTO.setPosition("docent");
        TeacherDTO savedTeacher = teacherService.save(teacherDTO);

        // Create TeacherNameDTO
        TeacherNameDTO teacherNameDTO = new TeacherNameDTO();
        teacherNameDTO.setId(savedTeacher.getId());
        teacherNameDTO.setName(savedTeacher.getName());
        teacherNameDTO.setSurname(savedTeacher.getSurname());
        teacherNameDTO.setPatronymic(savedTeacher.getPatronymic());

        // Create SubjectDTO
        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setId(4L);

        // Create GroupDTO
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(4L);

        // Create LessonInfoDTO
        LessonInfoDTO lessonDTO = new LessonInfoDTO();
        lessonDTO.setHours(2);
        lessonDTO.setSubjectForSite("lesson for getInfo");
        lessonDTO.setLinkToMeeting("some link....");
        lessonDTO.setLessonType(LECTURE);
        lessonDTO.setSubject(subjectDTO);
        lessonDTO.setGroup(groupDTO);
        lessonDTO.setTeacher(teacherNameDTO);
        lessonDTO.setSemesterId(4L);

        LessonInfoDTO savedLesson = lessonService.save(lessonDTO);

        mockMvc.perform(get("/schedules/data-before")
                        .param("semesterId", "4")
                        .param("dayOfWeek", "MONDAY")
                        .param("evenOdd", "EVEN")
                        .param("classId", "6")
                        .param("lessonId", savedLesson.getId().toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void returnBadRequestIfGetInfoForExistScheduleBySemesterIdByDayOfWeekByEvenOddByClassIdByLessonId() throws Exception {
        mockMvc.perform(get("/schedules/data-before")
                        .param("semesterId", "4")
                        .param("dayOfWeek", "MONDAY")
                        .param("evenOdd", "EVEN")
                        .param("classId", "4")
                        .param("lessonId", "4")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void getFullScheduleForGroup() throws Exception {
        mockMvc.perform(get("/schedules/full/groups")
                        .param("semesterId", "4")
                        .param("groupId", "4")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void returnEmptyListOfScheduleIfGetFullScheduleForNotFoundedGroup() throws Exception {
        mockMvc.perform(get("/schedules/full/groups")
                        .param("semesterId", "4")
                        .param("groupId", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.schedule").value(Matchers.empty()))
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void getFullScheduleForSemester() throws Exception {
        mockMvc.perform(get("/schedules/full/semester")
                        .param("semesterId", "4")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void returnNotFoundIfGetFullScheduleForNotFoundedSemester() throws Exception {
        mockMvc.perform(get("/schedules/full/semester")
                        .param("semesterId", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void getFullScheduleForTeacher() throws Exception {
        mockMvc.perform(get("/schedules/full/teachers")
                        .param("semesterId", "4")
                        .param("teacherId", "4")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void returnNotFoundIfGetFullScheduleForNotFoundedTeacher() throws Exception {
        mockMvc.perform(get("/schedules/full/teachers")
                        .param("semesterId", "4")
                        .param("teacherId", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void getFullScheduleForRoom() throws Exception {
        mockMvc.perform(get("/schedules/full/rooms")
                        .param("semesterId", "4")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void saveSchedule() throws Exception {
        ScheduleSaveDTO scheduleSaveDTO = new ScheduleSaveDTO();
        scheduleSaveDTO.setDayOfWeek(DayOfWeek.TUESDAY);
        scheduleSaveDTO.setEvenOdd(EvenOdd.ODD);
        scheduleSaveDTO.setLessonId(5L);
        scheduleSaveDTO.setPeriodId(4L);
        scheduleSaveDTO.setRoomId(5L);

        mockMvc.perform(post("/schedules")
                        .content(objectMapper.writeValueAsString(scheduleSaveDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    void saveScheduleWithGroupedLessons() throws Exception {
        ScheduleSaveDTO scheduleSaveDTO = new ScheduleSaveDTO();
        scheduleSaveDTO.setDayOfWeek(DayOfWeek.TUESDAY);
        scheduleSaveDTO.setEvenOdd(EvenOdd.ODD);
        scheduleSaveDTO.setLessonId(8L);
        scheduleSaveDTO.setPeriodId(5L);
        scheduleSaveDTO.setRoomId(4L);

        MvcResult mvcResult = mockMvc.perform(post("/schedules")
                        .content(objectMapper.writeValueAsString(scheduleSaveDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        List<ScheduleWithoutSemesterDTO> savedSchedules = Arrays.asList(
                objectMapper.readValue(contentAsString, ScheduleWithoutSemesterDTO[].class));

        SoftAssertions softAssertions = new SoftAssertions();

        softAssertions.assertThat(savedSchedules.get(0).getDayOfWeek()).isEqualTo(DayOfWeek.TUESDAY);
        softAssertions.assertThat(savedSchedules.get(0).getEvenOdd()).isEqualTo(EvenOdd.ODD);
        softAssertions.assertThat(savedSchedules.get(0).getLesson().getId()).isEqualTo(8L);
        softAssertions.assertThat(savedSchedules.get(0).getPeriod().getId()).isEqualTo(5L);
        softAssertions.assertThat(savedSchedules.get(0).getRoom().getId()).isEqualTo(4L);

        softAssertions.assertThat(savedSchedules.get(1).getDayOfWeek()).isEqualTo(DayOfWeek.TUESDAY);
        softAssertions.assertThat(savedSchedules.get(1).getEvenOdd()).isEqualTo(EvenOdd.ODD);
        softAssertions.assertThat(savedSchedules.get(1).getLesson().getId()).isEqualTo(9L);
        softAssertions.assertThat(savedSchedules.get(1).getPeriod().getId()).isEqualTo(5L);
        softAssertions.assertThat(savedSchedules.get(1).getRoom().getId()).isEqualTo(4L);

        softAssertions.assertAll();
    }

    @Test
    void saveScheduleIfScheduleIsExist() throws Exception {

        ScheduleSaveDTO scheduleSaveDTO = new ScheduleSaveDTO();
        scheduleSaveDTO.setDayOfWeek(DayOfWeek.MONDAY);
        scheduleSaveDTO.setEvenOdd(EvenOdd.EVEN);
        scheduleSaveDTO.setLessonId(4L);
        scheduleSaveDTO.setPeriodId(4L);
        scheduleSaveDTO.setRoomId(4L);

        mockMvc.perform(post("/schedules").content(objectMapper.writeValueAsString(scheduleSaveDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("already exists")));
    }

    @Test
    void testDelete() throws Exception {
        mockMvc.perform(delete("/schedules/{id}", 4)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void returnBadRequestIfSaveScheduleWhenEvenOddIsNull() throws Exception {
        ScheduleSaveDTO scheduleSaveDTO = new ScheduleSaveDTO();
        scheduleSaveDTO.setDayOfWeek(DayOfWeek.MONDAY);
        scheduleSaveDTO.setEvenOdd(null);
        scheduleSaveDTO.setLessonId(4L);
        scheduleSaveDTO.setPeriodId(5L);
        scheduleSaveDTO.setRoomId(4L);

        mockMvc.perform(post("/schedules").content(objectMapper.writeValueAsString(scheduleSaveDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}
