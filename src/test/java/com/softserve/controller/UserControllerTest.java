package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.UserCreateDTO;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
@Sql(value = {"classpath:create-users-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class UserControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/users").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        mockMvc.perform(get("/users/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(4));
    }

    @Test
    public void testSave() throws Exception {
        UserCreateDTO userDtoForSave = new UserCreateDTO();
        userDtoForSave.setEmail("save@email.com");
        userDtoForSave.setPassword("Qwerty1!");

        mockMvc.perform(post("/users").content(objectMapper.writeValueAsString(userDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {
        UserCreateDTO userDtoForUpdate = new UserCreateDTO();
        userDtoForUpdate.setId(5L);
        userDtoForUpdate.setEmail("update@email.com");
        userDtoForUpdate.setPassword("Qwerty1!");

        mockMvc.perform(put("/users", 5).content(objectMapper.writeValueAsString(userDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(userDtoForUpdate.getId()))
                .andExpect(jsonPath("$.email").value(userDtoForUpdate.getEmail()))
                .andExpect(jsonPath("$.password").value(userDtoForUpdate.getPassword()));
    }

    @Test
    public void testDelete() throws Exception {
        mockMvc.perform(delete("/users/{id}", 7)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void whenUserNotFound() throws Exception {
        mockMvc.perform(get("/users/100")).andExpect(status().isNotFound());
    }

    @Test
    public void whenSaveExistsUser() throws Exception {
        UserCreateDTO userDtoForSave = new UserCreateDTO();
        userDtoForSave.setEmail("first@mail.com");
        userDtoForSave.setPassword("Qwerty1!");

        mockMvc.perform(post("/users").content(objectMapper.writeValueAsString(userDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenSavePasswordIsNull() throws Exception {
        UserCreateDTO userCreateDTO = new UserCreateDTO();
        userCreateDTO.setPassword(null);
        userCreateDTO.setEmail("12341@mail.com");
        mockMvc.perform(post("/users").content(objectMapper.writeValueAsString(userCreateDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenSaveEmailIsNull() throws Exception {
        UserCreateDTO userCreateDTO = new UserCreateDTO();
        userCreateDTO.setPassword("Qwerty1!");
        userCreateDTO.setEmail(null);
        mockMvc.perform(post("/users").content(objectMapper.writeValueAsString(userCreateDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateExistEmail() throws Exception {
        UserCreateDTO userDtoForUpdate = new UserCreateDTO();
        userDtoForUpdate.setId(6L);
        userDtoForUpdate.setEmail("first@mail.com");
        userDtoForUpdate.setPassword("Qwerty1!");

        mockMvc.perform(put("/users", 6).content(objectMapper.writeValueAsString(userDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateNullEmail() throws Exception {
        UserCreateDTO userDtoForUpdate = new UserCreateDTO();
        userDtoForUpdate.setId(7L);
        userDtoForUpdate.setEmail(null);
        userDtoForUpdate.setPassword("Qwerty1!");

        mockMvc.perform(put("/users", 7).content(objectMapper.writeValueAsString(userDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}