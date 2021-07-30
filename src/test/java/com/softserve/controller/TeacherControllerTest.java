package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.DepartmentDTO;
import com.softserve.dto.TeacherDTO;
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

        teacherDtoWithId1L = new TeacherDTO();
        teacherDtoWithId1L.setId(1L);
        teacherDtoWithId1L.setName("Ivan");
        teacherDtoWithId1L.setSurname("Ivanov");
        teacherDtoWithId1L.setPatronymic("Ivanovych");
        teacherDtoWithId1L.setPosition("docent");
        teacherDtoWithId1L.setDepartmentDTO(departmentDTO);
        teacherDtoWithId1L.setEmail("teacher@gmail.com");
        teacherDtoWithId1L.setDisable(false);

        disabledTeacherDtoWithId2LAndWithoutEmail = new TeacherDTO();
        disabledTeacherDtoWithId2LAndWithoutEmail.setId(2L);
        disabledTeacherDtoWithId2LAndWithoutEmail.setName("Ivan");
        disabledTeacherDtoWithId2LAndWithoutEmail.setSurname("Ivanov");
        disabledTeacherDtoWithId2LAndWithoutEmail.setPatronymic("Ivanovych");
        disabledTeacherDtoWithId2LAndWithoutEmail.setPosition("docent");
        disabledTeacherDtoWithId2LAndWithoutEmail.setDepartmentDTO(departmentDTO);
        disabledTeacherDtoWithId2LAndWithoutEmail.setDisable(true);
    }

    @Test
    public void getAllTeachers() throws Exception {
        TeacherDTO expected = teacherDtoWithId1L;
        mockMvc.perform(get("/teachers").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(expected.getId()))
                .andExpect(jsonPath("$[0].name").value(expected.getName()))
                .andExpect(jsonPath("$[0].surname").value(expected.getSurname()))
                .andExpect(jsonPath("$[0].patronymic").value(expected.getPatronymic()))
                .andExpect(jsonPath("$[0].position").value(expected.getPosition()))
                .andExpect(jsonPath("$[0].departmentDTO").value(expected.getDepartmentDTO()))
                .andExpect(jsonPath("$[0].disable").value(expected.isDisable()));
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
                .andExpect(jsonPath("$.id").value(expected.getId()))
                .andExpect(jsonPath("$.name").value(expected.getName()))
                .andExpect(jsonPath("$.surname").value(expected.getSurname()))
                .andExpect(jsonPath("$.patronymic").value(expected.getPatronymic()))
                .andExpect(jsonPath("$.position").value(expected.getPosition()))
                .andExpect(jsonPath("$.departmentDTO").value(expected.getDepartmentDTO()))
                .andExpect(jsonPath("$.disable").value(expected.isDisable()));
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
                .andExpect(jsonPath("$.name").value(expected.getName()))
                .andExpect(jsonPath("$.surname").value(expected.getSurname()))
                .andExpect(jsonPath("$.patronymic").value(expected.getPatronymic()))
                .andExpect(jsonPath("$.position").value(expected.getPosition()))
                .andExpect(jsonPath("$.departmentDTO").value(expected.getDepartmentDTO()))
                .andExpect(jsonPath("$.disable").value(expected.isDisable()));
    }

    @Test
    public void updateTeacherIfEmailAndUserIdNotExist() throws Exception {
        TeacherDTO expected = disabledTeacherDtoWithId2LAndWithoutEmail;
        mockMvc.perform(put("/teachers").content(objectMapper.writeValueAsString(expected))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(expected.getId()))
                .andExpect(jsonPath("$.name").value(expected.getName()))
                .andExpect(jsonPath("$.surname").value(expected.getSurname()))
                .andExpect(jsonPath("$.patronymic").value(expected.getPatronymic()))
                .andExpect(jsonPath("$.position").value(expected.getPosition()))
                .andExpect(jsonPath("$.departmentDTO").value(expected.getDepartmentDTO()))
                .andExpect(jsonPath("$.disable").value(expected.isDisable()));
    }

    public void updateTeacherIfEmailAndUserIdExist() throws Exception {
        TeacherDTO expected = teacherDtoWithId1L;
        mockMvc.perform(put("/teachers").content(objectMapper.writeValueAsString(expected))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(expected.getId()))
                .andExpect(jsonPath("$.name").value(expected.getName()))
                .andExpect(jsonPath("$.surname").value(expected.getSurname()))
                .andExpect(jsonPath("$.patronymic").value(expected.getPatronymic()))
                .andExpect(jsonPath("$.position").value(expected.getPosition()))
                .andExpect(jsonPath("$.departmentDTO").value(expected.getDepartmentDTO()))
                .andExpect(jsonPath("$.disable").value(expected.isDisable()));
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
        TeacherDTO expected = teacherDtoWithId1L;
        mockMvc.perform(get("/public/teachers").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(expected.getId()))
                .andExpect(jsonPath("$[0].name").value(expected.getName()))
                .andExpect(jsonPath("$[0].surname").value(expected.getSurname()))
                .andExpect(jsonPath("$[0].patronymic").value(expected.getPatronymic()))
                .andExpect(jsonPath("$[0].position").value(expected.getPosition()))
                .andExpect(jsonPath("$[0].departmentDTO").value(expected.getDepartmentDTO()))
                .andExpect(jsonPath("$[0].disable").value(expected.isDisable()));
    }

    @Test
    public void getDisableTeachers() throws Exception {
        TeacherDTO expected = disabledTeacherDtoWithId2LAndWithoutEmail;
        mockMvc.perform(get("/teachers/disabled").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(expected.getId()))
                .andExpect(jsonPath("$[0].name").value(expected.getName()))
                .andExpect(jsonPath("$[0].surname").value(expected.getSurname()))
                .andExpect(jsonPath("$[0].patronymic").value(expected.getPatronymic()))
                .andExpect(jsonPath("$[0].position").value(expected.getPosition()))
                .andExpect(jsonPath("$[0].departmentDTO").value(expected.getDepartmentDTO()))
                .andExpect(jsonPath("$[0].disable").value(expected.isDisable()));
    }

    @Test
    public void getAllNotRegisteredTeachers() throws Exception {
        TeacherDTO expected = disabledTeacherDtoWithId2LAndWithoutEmail;
        mockMvc.perform(get("/not-registered-teachers").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(expected.getId()))
                .andExpect(jsonPath("$[0].name").value(expected.getName()))
                .andExpect(jsonPath("$[0].surname").value(expected.getSurname()))
                .andExpect(jsonPath("$[0].patronymic").value(expected.getPatronymic()))
                .andExpect(jsonPath("$[0].position").value(expected.getPosition()))
                .andExpect(jsonPath("$[0].departmentDTO").value(expected.getDepartmentDTO()))
                .andExpect(jsonPath("$[0].disable").value(expected.isDisable()));
    }
}

