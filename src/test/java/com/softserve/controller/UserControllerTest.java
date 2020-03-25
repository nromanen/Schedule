package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.UserCreateDTO;
import com.softserve.entity.User;
import com.softserve.service.UserService;
import com.softserve.service.mapper.UserMapperImpl;
import org.junit.After;
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
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class UserControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();
    private User user = new User();
    private UserCreateDTO userDtoForBefore = new UserCreateDTO();
    private UserCreateDTO userDtoForSave = new UserCreateDTO();
    private UserCreateDTO userDtoForUpdate = new UserCreateDTO();

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private UserService userService;

    @Before
    public void insertData() {

        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();

        //Save new period before all Test methods
        userDtoForBefore.setEmail("dto email");
        userDtoForBefore.setPassword("dto password");
        user = new UserMapperImpl().toUser(userDtoForBefore);
        userService.save(user);

        userDtoForSave.setEmail("save email");
        userDtoForSave.setPassword("save password");

        userDtoForUpdate.setId(user.getId());
        userDtoForUpdate.setEmail("update email");
        userDtoForUpdate.setPassword("update password");
//        userDtoForUpdate.setRole(ROLE_USER);
    }

    @After
    public void deleteData() {
        userService.delete(user);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/users").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {

        mockMvc.perform(get("/users/{id}", String.valueOf(user.getId())).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(String.valueOf(user.getId())));
    }

    @Test
    public void testSave() throws Exception {

        mockMvc.perform(post("/users").content(objectMapper.writeValueAsString(userDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {

        User userForCompare = new UserMapperImpl().toUser(userDtoForUpdate);

        mockMvc.perform(put("/users", String.valueOf(userDtoForUpdate.getId())).content(objectMapper.writeValueAsString(userDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(userForCompare.getId()))
                .andExpect(jsonPath("$.email").value(userForCompare.getEmail()))
                .andExpect(jsonPath("$.password").value(userForCompare.getPassword()));
    }

    @Test
    public void testDelete() throws Exception {
        UserCreateDTO userCreateDTO = new UserCreateDTO();
        userCreateDTO.setEmail("delete email");
        userCreateDTO.setPassword("delete password");
        User user = userService.save(new UserMapperImpl().toUser(userCreateDTO));

        mockMvc.perform(delete("/users/{id}", String.valueOf(user.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}