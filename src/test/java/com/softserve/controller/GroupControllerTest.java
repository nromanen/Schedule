package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.GroupDTO;
import com.softserve.entity.Group;
import com.softserve.service.GroupService;
import com.softserve.service.mapper.GroupMapperImpl;
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
public class GroupControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private GroupService groupService;

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
        mockMvc.perform(get("/groups/{id}", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(String.valueOf(1L)));
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
        groupDtoForUpdate.setId(2L);
        groupDtoForUpdate.setTitle("222 updated");

        Group groupForCompare = new GroupMapperImpl().groupDTOToGroup(groupDtoForUpdate);

        mockMvc.perform(put("/groups", 2).content(objectMapper.writeValueAsString(groupDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(groupForCompare.getId()))
                .andExpect(jsonPath("$.title").value(groupForCompare.getTitle()));
    }

    @Test
    public void testDelete() throws Exception {
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setTitle("delete name");

        Group group = groupService.save(new GroupMapperImpl().groupDTOToGroup(groupDTO));

        mockMvc.perform(delete("/groups/{id}", String.valueOf(group.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void whenGroupNotFound() throws Exception {
        mockMvc.perform(get("/groups/10")).andExpect(status().isNotFound());
    }

    @Test
    public void whenSaveExistsGroup() throws Exception {
        GroupDTO groupDtoForSave = new GroupDTO();
        groupDtoForSave.setTitle("save name");

        mockMvc.perform(post("/groups").content(objectMapper.writeValueAsString(groupDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenSaveNameIsNull() throws Exception {
        GroupDTO groupDtoForSave = new GroupDTO();
        groupDtoForSave.setTitle(null);

        mockMvc.perform(post("/groups").content(objectMapper.writeValueAsString(groupDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateExistsGroup() throws Exception {
        GroupDTO groupDtoForUpdate = new GroupDTO();
        groupDtoForUpdate.setId(1L);
        groupDtoForUpdate.setTitle("111");

        mockMvc.perform(put("/groups", 1).content(objectMapper.writeValueAsString(groupDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenUpdateNullTitle() throws Exception {
        GroupDTO groupDtoForUpdate = new GroupDTO();
        groupDtoForUpdate.setId(1L);
        groupDtoForUpdate.setTitle(null);

        mockMvc.perform(put("/groups", 1).content(objectMapper.writeValueAsString(groupDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}