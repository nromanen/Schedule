package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.GroupDTO;
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
@Sql(value = {"classpath:create-groups-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class GroupControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/groups").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        mockMvc.perform(get("/groups/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(String.valueOf(4L)));
    }

    @Test
    public void testSave() throws Exception {
        GroupDTO groupDtoForSave = new GroupDTO();
        groupDtoForSave.setTitle("save new group");

        mockMvc.perform(post("/groups").content(objectMapper.writeValueAsString(groupDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {
        GroupDTO groupDtoForUpdate = new GroupDTO();
        groupDtoForUpdate.setId(4L);
        groupDtoForUpdate.setTitle("111 updated");

        mockMvc.perform(put("/groups", 4).content(objectMapper.writeValueAsString(groupDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(groupDtoForUpdate.getId()))
                .andExpect(jsonPath("$.title").value(groupDtoForUpdate.getTitle()));
    }

    @Test
    public void testDelete() throws Exception {
        mockMvc.perform(delete("/groups/{id}", 6)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void whenGroupNotFound() throws Exception {
        mockMvc.perform(get("/groups/100")).andExpect(status().isNotFound());
    }

    @Test
    public void whenSaveExistsGroup() throws Exception {
        GroupDTO groupDtoForSave = new GroupDTO();
        groupDtoForSave.setTitle("111");

        mockMvc.perform(post("/groups").content(objectMapper.writeValueAsString(groupDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenSaveNameIsNull() throws Exception {
        GroupDTO groupDtoForSave = new GroupDTO();
        groupDtoForSave.setTitle(null);

        mockMvc.perform(post("/groups").content(objectMapper.writeValueAsString(groupDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateExistsGroup() throws Exception {
        GroupDTO groupDtoForUpdate = new GroupDTO();
        groupDtoForUpdate.setId(5L);
        groupDtoForUpdate.setTitle("111");

        mockMvc.perform(put("/groups", 5).content(objectMapper.writeValueAsString(groupDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateNullTitle() throws Exception {
        GroupDTO groupDtoForUpdate = new GroupDTO();
        groupDtoForUpdate.setId(6L);
        groupDtoForUpdate.setTitle(null);

        mockMvc.perform(put("/groups", 6).content(objectMapper.writeValueAsString(groupDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}