package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.AddPeriodDTO;
import com.softserve.dto.GroupDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Period;
import com.softserve.service.GroupService;
import com.softserve.service.mapper.GroupMapperImpl;
import com.softserve.service.mapper.PeriodMapperImpl;
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

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
//@WebAppConfiguration
//public class GroupControllerTest {
//
//    private MockMvc mockMvc;
//    private ObjectMapper objectMapper = new ObjectMapper();
//
//    @Autowired
//    private WebApplicationContext wac;
//
//    @Autowired
//    private GroupService groupService;
//
//    @Before
//    public void init() {
//        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
//    }
//
//    @Test
//    public void testGetAll() throws Exception {
//        mockMvc.perform(get("/groups").accept(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType("application/json"));
//    }
//
//    @Test
//    public void testGet() throws Exception {
//        GroupDTO groupDTO = new GroupDTO();
//        groupDTO.setId(1L);
//        groupDTO.setTitle("103");
//        Group group = new GroupMapperImpl().groupDTOToGroup(groupDTO);
//
//        mockMvc.perform(post("/groups").content(objectMapper.writeValueAsString(group))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(group.getId()));
//
//        mockMvc.perform(get("/groups/{id}", "1").contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType("application/json"))
//                .andExpect(jsonPath("$.id").value("1"));
//    }
//
//    @Test
//    public void testSave() throws Exception {
//        GroupDTO groupDTO = new GroupDTO();
//        groupDTO.setId(2L);
//        groupDTO.setTitle("203");
//        Group group = new GroupMapperImpl().groupDTOToGroup(groupDTO);
//
//        mockMvc.perform(post("/groups").content(objectMapper.writeValueAsString(group))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(group.getId()));
//    }
//
//    @Test
//    public void testUpdate() throws Exception {
//        GroupDTO groupDTO = new GroupDTO();
//        groupDTO.setId(2L);
//        groupDTO.setTitle("303");
//        Group group = new GroupMapperImpl().groupDTOToGroup(groupDTO);
//
//        mockMvc.perform(put("/groups", "2").content(objectMapper.writeValueAsString(group))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(group.getId()))
//                .andExpect(jsonPath("$.title").value(group.getTitle()));
//    }
//
//    @Test
//    public void testDelete() throws Exception {
//        mockMvc.perform(delete("/groups/{id}", "1")
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk());
//    }
//}
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class GroupControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();
    private Group group = new Group();
    private GroupDTO groupDtoForBefore = new GroupDTO();
    private GroupDTO groupDtoForSave = new GroupDTO();
    private GroupDTO groupDtoForUpdate = new GroupDTO();


    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private GroupService groupService;

    @Before
    public void init() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Before
    public void insertData() {

        //Save new period before all Test methods
        groupDtoForBefore.setTitle("dto name");
        group = new GroupMapperImpl().groupDTOToGroup(groupDtoForBefore);
        groupService.save(group);

        groupDtoForSave.setTitle("save name");

        groupDtoForUpdate.setId(group.getId());
        groupDtoForUpdate.setTitle("update name");
    }

    @After
    public void deleteData() {
        groupDtoForBefore = null;
        groupService.delete(group);
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

        mockMvc.perform(get("/groups/{id}", String.valueOf(group.getId())).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    public void testSave() throws Exception {

        mockMvc.perform(post("/groups").content(objectMapper.writeValueAsString(groupDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {

        Group groupForCompare = new GroupMapperImpl().groupDTOToGroup(groupDtoForUpdate);

        mockMvc.perform(put("/groups", String.valueOf(group.getId())).content(objectMapper.writeValueAsString(groupDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
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
                .andDo(print())
                .andExpect(status().isOk());
    }
}