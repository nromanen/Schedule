package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.UserCreateDTO;
import com.softserve.entity.User;
import com.softserve.service.UserService;
import com.softserve.service.mapper.UserMapperImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class UserControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserService userService;

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
        mockMvc.perform(get("/users/{id}", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(1));
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

        User userForCompare = new UserMapperImpl().toUser(userDtoForUpdate);

        mockMvc.perform(put("/users", 5).content(objectMapper.writeValueAsString(userDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(userForCompare.getId()))
                .andExpect(jsonPath("$.email").value(userForCompare.getEmail()))
                .andExpect(jsonPath("$.password").value(userForCompare.getPassword()));
    }

    @Test
    public void testDelete() throws Exception {
        UserCreateDTO userCreateDTO = new UserCreateDTO();
        userCreateDTO.setEmail("delete@email.com");
        userCreateDTO.setPassword("delete password");

        User user = userService.save(new UserMapperImpl().toUser(userCreateDTO));

        mockMvc.perform(delete("/users/{id}", String.valueOf(user.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void whenUserNotFound() throws Exception {
        mockMvc.perform(get("/users/10")).andExpect(status().isNotFound());
    }

    @Test
    public void whenSaveExistsUser() throws Exception {
        UserCreateDTO userDtoForSave = new UserCreateDTO();
        userDtoForSave.setEmail("first@mail.com");
        userDtoForSave.setPassword("Qwerty1!");

        mockMvc.perform(post("/users").content(objectMapper.writeValueAsString(userDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenSavePasswordIsNull() throws Exception {
        UserCreateDTO userCreateDTO = new UserCreateDTO();
        userCreateDTO.setPassword(null);
        userCreateDTO.setEmail("12341@mail.com");
        mockMvc.perform(post("/users").content(objectMapper.writeValueAsString(userCreateDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateExistEmail() throws Exception {
        UserCreateDTO userDtoForUpdate = new UserCreateDTO();
        userDtoForUpdate.setId(2L);
        userDtoForUpdate.setEmail("first@mail.com");
        userDtoForUpdate.setPassword("Qwerty1!");

        mockMvc.perform(put("/users", 2).content(objectMapper.writeValueAsString(userDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateNullEmail() throws Exception {
        UserCreateDTO userDtoForUpdate = new UserCreateDTO();
        userDtoForUpdate.setId(2L);
        userDtoForUpdate.setEmail(null);
        userDtoForUpdate.setPassword("Qwerty1!");

        mockMvc.perform(put("/users", 2).content(objectMapper.writeValueAsString(userDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}