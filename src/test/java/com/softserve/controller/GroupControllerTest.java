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
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class GroupControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    @Mock
    private GroupService groupService;

    @Before
    public void init() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/groups").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(1L);
        groupDTO.setTitle("103");
        Group group = new GroupMapperImpl().groupDTOToGroup(groupDTO);

        when(groupService.save(any(Group.class))).thenReturn(group);

        mockMvc.perform(post("/groups").content(objectMapper.writeValueAsString(group))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(group.getId()));

        mockMvc.perform(get("/groups/{id}", "1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    public void testSave() throws Exception {
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(2L);
        groupDTO.setTitle("203");
        Group group = new GroupMapperImpl().groupDTOToGroup(groupDTO);

        when(groupService.save(any(Group.class))).thenReturn(group);

        mockMvc.perform(post("/groups").content(objectMapper.writeValueAsString(group))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(group.getId()));
    }

    @Test
    public void testUpdate() throws Exception {
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(2L);
        groupDTO.setTitle("303");
        Group group = new GroupMapperImpl().groupDTOToGroup(groupDTO);

        when(groupService.update(any(Group.class))).thenReturn(group);

        mockMvc.perform(put("/groups", "2").content(objectMapper.writeValueAsString(group))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.id").value(group.getId()))
                .andExpect(jsonPath("$.title").value(group.getTitle()));
        testGetAll();
    }

    @Test
    public void testDelete() throws Exception {
        testGetAll();
        mockMvc.perform(delete("/groups/{id}", "1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isAccepted());
    }
}