package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.DepartmentDTO;
import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import org.junit.Before;
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
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
@WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "MANAGER")
@Sql(value = "classpath:create-teachers-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@Sql(value = "classpath:delete-teachers-after.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
public class TeacherControllerTest {
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private TeacherDTO teacherDtoWithId1L;

    private TeacherDTO disabledTeacherDtoWithId2LAndWithoutEmail;

    private TeacherForUpdateDTO teacherForUpdateDtoWithId1L;

    private TeacherForUpdateDTO teacherForUpdateDtoWithId2LAndWithoutEmail;

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        DepartmentDTO departmentDTO = new DepartmentDTO();
        departmentDTO.setId(20L);
        departmentDTO.setName("Department1");

        String teacherName = "Ivan";
        String teacherSurname = "Ivanov";
        String teacherPatronymic = "Ivanovych";
        String teacherPosition = "docent";
        String teacherEmail = "teacher@gmail.com";

        teacherDtoWithId1L = new TeacherDTO();
        teacherDtoWithId1L.setId(1L);
        teacherDtoWithId1L.setName(teacherName);
        teacherDtoWithId1L.setSurname(teacherSurname);
        teacherDtoWithId1L.setPatronymic(teacherPatronymic);
        teacherDtoWithId1L.setPosition(teacherPosition);
        teacherDtoWithId1L.setDepartmentDTO(departmentDTO);
        teacherDtoWithId1L.setEmail(teacherEmail);

        disabledTeacherDtoWithId2LAndWithoutEmail = new TeacherDTO();
        disabledTeacherDtoWithId2LAndWithoutEmail.setId(2L);
        disabledTeacherDtoWithId2LAndWithoutEmail.setName(teacherName);
        disabledTeacherDtoWithId2LAndWithoutEmail.setSurname(teacherSurname);
        disabledTeacherDtoWithId2LAndWithoutEmail.setPatronymic(teacherPatronymic);
        disabledTeacherDtoWithId2LAndWithoutEmail.setPosition(teacherPosition);
        disabledTeacherDtoWithId2LAndWithoutEmail.setDepartmentDTO(departmentDTO);

        teacherForUpdateDtoWithId1L = new TeacherForUpdateDTO();
        teacherForUpdateDtoWithId1L.setId(1L);
        teacherForUpdateDtoWithId1L.setName(teacherName);
        teacherForUpdateDtoWithId1L.setSurname(teacherSurname);
        teacherForUpdateDtoWithId1L.setPatronymic(teacherPatronymic);
        teacherForUpdateDtoWithId1L.setPosition(teacherPosition);
        teacherForUpdateDtoWithId1L.setDepartmentDTO(departmentDTO);
        teacherForUpdateDtoWithId1L.setEmail(teacherEmail);

        teacherForUpdateDtoWithId2LAndWithoutEmail = new TeacherForUpdateDTO();
        teacherForUpdateDtoWithId2LAndWithoutEmail.setId(2L);
        teacherForUpdateDtoWithId2LAndWithoutEmail.setName(teacherName);
        teacherForUpdateDtoWithId2LAndWithoutEmail.setSurname(teacherSurname);
        teacherForUpdateDtoWithId2LAndWithoutEmail.setPatronymic(teacherPatronymic);
        teacherForUpdateDtoWithId2LAndWithoutEmail.setPosition(teacherPosition);
        teacherForUpdateDtoWithId2LAndWithoutEmail.setDepartmentDTO(departmentDTO);
    }

    @Test
    public void getAllTeachers() throws Exception {
        assertThatByUrlReturnedListWithOneTeacher("/teachers", teacherDtoWithId1L);
    }

    @Test
    public void getAllTeachersWithWishes() throws Exception {
        mockMvc.perform(get("/teachers/with-wishes").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void getTeacherWithWishesById() throws Exception {
        mockMvc.perform(get("/teachers/{id}/with-wishes", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void getTeacherById() throws Exception {
        TeacherDTO expected = teacherDtoWithId1L;
        mockMvc.perform(get("/teachers/{id}", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(matchTeacher(expected));
    }

    @Test
    @WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "USER")
    public void returnForbiddenIfAuthenticatedUserRoleIsNotManager() throws Exception {
        mockMvc.perform(get("/teachers/{id}", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    public void saveTeacher() throws Exception {
        TeacherDTO expected = disabledTeacherDtoWithId2LAndWithoutEmail;
        expected.setId(null);
        mockMvc.perform(post("/teachers").content(objectMapper.writeValueAsString(expected))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(matchTeacherExcludingId(expected));
    }

    @Test
    public void updateTeacherIfEmailAndUserIdNotExist() throws Exception {
        TeacherForUpdateDTO expected = teacherForUpdateDtoWithId2LAndWithoutEmail;
        mockMvc.perform(put("/teachers").content(objectMapper.writeValueAsString(expected))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(matchTeacherForUpdate(expected));
    }

    @Test
    public void updateTeacherIfEmailAndUserIdExist() throws Exception {
        TeacherForUpdateDTO expected = teacherForUpdateDtoWithId1L;
        mockMvc.perform(put("/teachers").content(objectMapper.writeValueAsString(expected))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(matchTeacherForUpdate(expected));
    }

    @Test
    public void deleteTeacher() throws Exception {
        mockMvc.perform(delete("/teachers/{id}", 1)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void returnNotFoundIfTeacherNotFoundedById() throws Exception {
        mockMvc.perform(get("/teachers/100")).andExpect(status().isNotFound());
    }

    @Test
    public void returnNotFoundIfTeacherWithWishesNotFoundedById() throws Exception {
        mockMvc.perform(get("/teachers/100/with-wishes")).andExpect(status().isNotFound());
    }

    @Test
    public void returnBadRequestIfSavedPositionIsNull() throws Exception {
        TeacherDTO teacherDTO = teacherDtoWithId1L;
        teacherDTO.setId(null);
        teacherDTO.setPosition(null);
        mockMvc.perform(post("/teachers").content(objectMapper.writeValueAsString(teacherDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnBadRequestIfUpdatedNameIsNull() throws Exception {
        TeacherDTO teacherDTO = teacherDtoWithId1L;
        teacherDTO.setName(null);
        mockMvc.perform(put("/teachers", 1).content(objectMapper.writeValueAsString(teacherDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void getAllPublicTeachers() throws Exception {
        assertThatByUrlReturnedListWithOneTeacher("/public/teachers", teacherDtoWithId1L);
    }

    @Test
    public void getDisableTeachers() throws Exception {
        assertThatByUrlReturnedListWithOneTeacher("/teachers/disabled", disabledTeacherDtoWithId2LAndWithoutEmail);
    }

    @Test
    public void getAllNotRegisteredTeachers() throws Exception {
        assertThatByUrlReturnedListWithOneTeacher("/not-registered-teachers",
                                                  disabledTeacherDtoWithId2LAndWithoutEmail);
    }

    private static ResultMatcher matchTeacher(TeacherDTO expected) {
        return matchTeacher("$", expected);
    }

    private static ResultMatcher matchTeacher(String prefix, TeacherDTO expected) {
        return ResultMatcher.matchAll(
                jsonPath(prefix + ".id").value(expected.getId()),
                matchTeacherExcludingId(prefix, expected)
        );
    }

    private static ResultMatcher matchTeacherExcludingId(TeacherDTO expected) {
        return matchTeacherExcludingId("$", expected);
    }

    private static ResultMatcher matchTeacherExcludingId(String prefix, TeacherDTO expected) {
        return ResultMatcher.matchAll(
                jsonPath(prefix + ".name").value(expected.getName()),
                jsonPath(prefix + ".surname").value(expected.getSurname()),
                jsonPath(prefix + ".patronymic").value(expected.getPatronymic()),
                jsonPath(prefix + ".position").value(expected.getPosition()),
                jsonPath(prefix + ".department").value(expected.getDepartmentDTO())
        );
    }

    private static ResultMatcher matchTeacherForUpdate(TeacherForUpdateDTO expected) {
        return ResultMatcher.matchAll(
                jsonPath("$.id").value(expected.getId()),
                jsonPath("$.name").value(expected.getName()),
                jsonPath("$.surname").value(expected.getSurname()),
                jsonPath("$.patronymic").value(expected.getPatronymic()),
                jsonPath("$.position").value(expected.getPosition()),
                jsonPath("$.department").value(expected.getDepartmentDTO())
        );
    }

    private void assertThatByUrlReturnedListWithOneTeacher(String url, TeacherDTO expected) throws Exception {
        mockMvc.perform(get(url).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(matchTeacher("$[0]", expected));
    }
}

