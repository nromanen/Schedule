package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.*;
import com.softserve.dto.JoinTeacherWithUserDTO;
import com.softserve.entity.Teacher;
import com.softserve.entity.User;
import com.softserve.entity.enums.Role;
import com.softserve.service.MailService;
import com.softserve.service.TeacherService;
import com.softserve.service.UserService;
import com.softserve.service.impl.UserServiceImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class,
        SecurityConfig.class, SecurityWebApplicationInitializer.class, MailConfig.class})
@WebAppConfiguration
@WithMockUser(roles = "MANAGER")
@Sql(value = "classpath:create-dataForManager-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class ManagerControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private UserService userService;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private TeacherService teacherService;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void testJoinTeacherWithUser() throws Exception {
        JoinTeacherWithUserDTO joinTeacherWithUserDTO = new JoinTeacherWithUserDTO();
        joinTeacherWithUserDTO.setTeacherId(4L);
        joinTeacherWithUserDTO.setUserId(5L);
        mockMvc.perform(put("/managers/teacher_credentials").content(objectMapper.writeValueAsString(joinTeacherWithUserDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());

        Teacher teacher = teacherService.getById(4L);
        User user = userService.getById(5L);
        assertEquals(user.getId(), teacher.getUserId());
        assertEquals(Role.ROLE_TEACHER, user.getRole());
    }
}
