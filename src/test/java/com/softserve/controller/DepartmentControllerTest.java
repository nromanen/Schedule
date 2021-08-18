package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.assertions.CustomMockMvcAssertions;
import com.softserve.config.*;
import com.softserve.dto.DepartmentDTO;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class, SecurityConfig.class, SecurityWebApplicationInitializer.class})
@WebAppConfiguration
@WithMockUser(username = "vbforwork702@mail.com", password = "$2a$10$42sZYaqffhxKah7sTFsm3OXF02qdUUykPfVWPO3GguHvoDui.WsIi", roles = "MANAGER")
@Sql(value = "classpath:create-departments-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class DepartmentControllerTest {

    private CustomMockMvcAssertions customMockMvcAssertions;
    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
        customMockMvcAssertions = new CustomMockMvcAssertions(mockMvc, objectMapper, "/departments");
    }

    @Test
    public void getAll() throws Exception {
        mockMvc.perform(get("/departments").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void getById() throws Exception {
        mockMvc.perform(get("/departments/{id}", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(String.valueOf(1L)));
    }

    @Test
    @WithMockUser(username = "vbforwork702@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "USER")
    public void returnForbiddenIfAuthenticatedUserRoleIsNotManager() throws Exception {
        mockMvc.perform(get("/departments/{id}", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    public void saveIfEntityDoesNotExist() throws Exception {
        DepartmentDTO departmentDtoForSave = new DepartmentDTO();
        departmentDtoForSave.setName("save new departments");

        mockMvc.perform(post("/departments").content(objectMapper.writeValueAsString(departmentDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void updateIfUpdatedEntityExists() throws Exception {
        DepartmentDTO departmentDtoForUpdate = new DepartmentDTO();
        departmentDtoForUpdate.setId(2L);
        departmentDtoForUpdate.setName("111epartment1");

        mockMvc.perform(put("/departments", 2).content(objectMapper.writeValueAsString(departmentDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(departmentDtoForUpdate.getId()))
                .andExpect(jsonPath("$.name").value(departmentDtoForUpdate.getName()));
    }

    @Test
    public void deleteById() throws Exception {
        mockMvc.perform(delete("/departments/{id}", 2)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void returnBadRequestIfReferencesOnDepartmentExist() throws Exception {
        mockMvc.perform(delete("/departments/{id}", 1)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnNotFoundIfEntityNotFoundedById() throws Exception {
        mockMvc.perform(get("/departments/100")).andExpect(status().isNotFound());
    }

    @Test
    public void returnBadRequestIfSavedEntityAlreadyExists() throws Exception {
        DepartmentDTO departmentDtoForSave = new DepartmentDTO();
        departmentDtoForSave.setName("Department1");

        mockMvc.perform(post("/departments").content(objectMapper.writeValueAsString(departmentDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnBadRequestIfSavedNameIsNull() throws Exception {
        DepartmentDTO departmentDtoForSave = new DepartmentDTO();
        departmentDtoForSave.setName(null);

        mockMvc.perform(post("/departments").content(objectMapper.writeValueAsString(departmentDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().is(500));
    }

    @Test
    public void returnBadRequestIfUpdatedEntityAlreadyExists() throws Exception {
        DepartmentDTO departmentDtoForUpdate = new DepartmentDTO();
        departmentDtoForUpdate.setId(2L);
        departmentDtoForUpdate.setName("Department1");

        mockMvc.perform(put("/departments", 2).content(objectMapper.writeValueAsString(departmentDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void returnBadRequestIfUpdatedNameIsNull() throws Exception {
        DepartmentDTO departmentDtoForUpdate = new DepartmentDTO();
        departmentDtoForUpdate.setId(2L);
        departmentDtoForUpdate.setName(null);

        mockMvc.perform(put("/departments", 2).content(objectMapper.writeValueAsString(departmentDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().is(500));
    }

    @Test
    public void getAllDisable() throws Exception {
        mockMvc.perform(get("/departments/disabled").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void getAllTeachers() throws Exception {

        DepartmentDTO department = new DepartmentDTO();
        department.setId(1L);
        department.setName("Department1");
        department.setDisable(false);

        TeacherDTO firstTeacher = new TeacherDTO();
        firstTeacher.setId(1L);
        firstTeacher.setName("Ivan");
        firstTeacher.setSurname("Ivanov");
        firstTeacher.setPatronymic("Ivanovych");
        firstTeacher.setPosition("docent");
        firstTeacher.setDepartmentDTO(department);

        customMockMvcAssertions.assertForGetListWithOneEntity(firstTeacher, "/departments/1/teachers");
    }
}
