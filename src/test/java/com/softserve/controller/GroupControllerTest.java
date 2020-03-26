package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.GroupDTO;
import com.softserve.entity.Group;
import com.softserve.service.GroupService;
import com.softserve.service.mapper.GroupMapperImpl;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class GroupControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();
    private Group group;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private GroupService groupService;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();

        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setTitle("dto name");
        group = new GroupMapperImpl().groupDTOToGroup(groupDTO);
        groupService.save(group);
    }

    @After
    public void tearDown() {
        groupService.delete(group);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/groups").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        mockMvc.perform(get("/groups/{id}", String.valueOf(group.getId())).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(String.valueOf(group.getId())));
    }

    @Test
    public void testSave() throws Exception {
        GroupDTO groupDtoForSave = new GroupDTO();
        groupDtoForSave.setTitle("save name");

        mockMvc.perform(post("/groups").content(objectMapper.writeValueAsString(groupDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {
        GroupDTO groupDtoForUpdate = new GroupDTO();
        groupDtoForUpdate.setId(group.getId());
        groupDtoForUpdate.setTitle("update name");

        Group groupForCompare = new GroupMapperImpl().groupDTOToGroup(groupDtoForUpdate);

        mockMvc.perform(put("/groups", String.valueOf(group.getId())).content(objectMapper.writeValueAsString(groupDtoForUpdate))
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
}