package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.*;
import com.softserve.dto.GroupDTO;
import com.softserve.dto.StudentDTO;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class, SecurityConfig.class, SecurityWebApplicationInitializer.class})
@WebAppConfiguration
@WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "MANAGER")
@Sql(value = {"classpath:create-students-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@Sql(value = {"classpath:delete-students-after.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
public class StudentControllerTest {

    private static MockMvc mockMvc;
    private static ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    public void getAllStudents() throws Exception {
        String email = "aware.123db@gmail.com";

        mockMvc.perform(get("/students")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].email").value(email));
    }

    @Test
    public void getStudentById() throws Exception {
        String email = "aware.123db@gmail.com";

        mockMvc.perform(get("/students/{id}", 2L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    public void saveStudent() throws Exception {
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(1L);
        groupDTO.setTitle("qweqweqwe");

        StudentDTO studentDTO = new StudentDTO();
        studentDTO.setName("Name");
        studentDTO.setSurname("Surname");
        studentDTO.setPatronymic("Patronymic");
        studentDTO.setEmail("12313asdasd@gmail.com");
        studentDTO.setUserId(1L);
        studentDTO.setGroup(groupDTO);

        mockMvc.perform(post("/students")
                .content(objectMapper.writeValueAsString(studentDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void updateStudent() throws Exception {
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(1L);

        StudentDTO studentDTO = new StudentDTO();
        studentDTO.setId(2L);
        studentDTO.setName("Changed Name");
        studentDTO.setSurname("Changed Surname");
        studentDTO.setPatronymic("Changed Patronymic");
        studentDTO.setEmail("changedTempStudent@gmail.com");
        studentDTO.setUserId(1L);
        studentDTO.setGroup(groupDTO);

        mockMvc.perform(put("/students")
                .content(objectMapper.writeValueAsString(studentDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(studentDTO.getId()))
                .andExpect(jsonPath("$.email").value(studentDTO.getEmail()));
    }

    @Test
    public void deleteStudent() throws Exception {
        mockMvc.perform(delete("/students/{id}", 2L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
