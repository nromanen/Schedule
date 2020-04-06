package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.AddRoomDTO;
import com.softserve.dto.RoomDTO;
import com.softserve.entity.Room;
import com.softserve.service.RoomService;
import com.softserve.service.mapper.RoomMapperImpl;
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
public class RoomControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();
    private Room room;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private RoomService roomService;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();

        AddRoomDTO roomDTO = new AddRoomDTO();
        roomDTO.setName("dto name");
        roomDTO.setType("dto type");
        room = new RoomMapperImpl().convertToEntity(roomDTO);
        roomService.save(room);
    }

    @After
    public void tearDown() {
        roomService.delete(room);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/rooms").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {
        mockMvc.perform(get("/rooms/{id}", String.valueOf(room.getId())).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(String.valueOf(room.getId())));
    }

    @Test
    public void testSave() throws Exception {
        AddRoomDTO roomDtoForSave = new AddRoomDTO();
        roomDtoForSave.setName("save name");
        roomDtoForSave.setType("save type");

        mockMvc.perform(post("/rooms").content(objectMapper.writeValueAsString(roomDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {
        RoomDTO roomDtoForUpdate = new RoomDTO();
        roomDtoForUpdate.setId(room.getId());
        roomDtoForUpdate.setName("update name");
        roomDtoForUpdate.setType("update type");

        Room roomForCompare = new RoomMapperImpl().convertToEntity(roomDtoForUpdate);

        mockMvc.perform(put("/rooms", String.valueOf(room.getId())).content(objectMapper.writeValueAsString(roomDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(roomForCompare.getId()))
                .andExpect(jsonPath("$.name").value(roomForCompare.getName()));
    }

    @Test
    public void testDelete() throws Exception {
        AddRoomDTO addRoomDTO = new AddRoomDTO();
        addRoomDTO.setName("delete name");
        addRoomDTO.setType("delete type");
        Room room = roomService.save(new RoomMapperImpl().convertToEntity(addRoomDTO));
        mockMvc.perform(delete("/rooms/{id}", String.valueOf(room.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void whenRoomNotFound() throws Exception {
        mockMvc.perform(get("/rooms/10")).andExpect(status().isNotFound());
    }

    @Test
    public void whenSaveNameIsNull() throws Exception {
        AddRoomDTO roomDtoForSave = new AddRoomDTO();
        roomDtoForSave.setName(null);
        roomDtoForSave.setType("save type");

        mockMvc.perform(post("/rooms").content(objectMapper.writeValueAsString(roomDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}