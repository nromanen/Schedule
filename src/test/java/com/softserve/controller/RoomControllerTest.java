package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.AddRoomDTO;
import com.softserve.dto.RoomDTO;
import com.softserve.entity.Room;
import com.softserve.entity.enums.RoomSize;
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
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
//@WebAppConfiguration
//public class RoomControllerTest {
//
//    private MockMvc mockMvc;
//    private ObjectMapper objectMapper = new ObjectMapper();
//
//    @Autowired
//    private WebApplicationContext wac;
//
//    @Autowired
//    private RoomService roomService;
//
//    @Before
//    public void init() {
//        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
//    }
//
//    @Test
//    public void testGetAll() throws Exception {
//        mockMvc.perform(get("/rooms").accept(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType("application/json"));
//    }
//
//    //Dont work, because SCHEDULE table was not created
////    @Test
////    public void testFreeRoomList() throws Exception {
////        mockMvc.perform(get("/rooms/free")
////                .param("id", "1")
////                .param("dayOfWeek", "MONDAY")
////                .param("evenOdd", "ODD").accept(MediaType.APPLICATION_JSON))
////                .andDo(print())
////                .andExpect(status().isOk())
////                .andExpect(content().contentType("application/json"));
////    }
//
//    @Test
//    public void testGet() throws Exception {
//        RoomDTO roomDTO = new RoomDTO();
//        roomDTO.setId(1L);
//        roomDTO.setName("first auditory");
//        roomDTO.setRoomSize(RoomSize.LARGE);
//        Room room = new RoomMapperImpl().convertToEntity(roomDTO);
//
//        mockMvc.perform(post("/rooms").content(objectMapper.writeValueAsString(room))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(room.getId()));
//
//        mockMvc.perform(get("/rooms/{id}", "1").contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType("application/json"))
//                .andExpect(jsonPath("$.id").value("1"));
//    }
//
//    @Test
//    public void testSave() throws Exception {
//        RoomDTO roomDTO = new RoomDTO();
//        roomDTO.setId(2L);
//        roomDTO.setName("second auditory");
//        roomDTO.setRoomSize(RoomSize.SMALL);
//        Room room = new RoomMapperImpl().convertToEntity(roomDTO);
//
//        mockMvc.perform(post("/rooms").content(objectMapper.writeValueAsString(room))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(room.getId()));
//    }
//
//    @Test
//    public void testUpdate() throws Exception {
//        RoomDTO roomDTO = new RoomDTO();
//        roomDTO.setId(3L);
//        roomDTO.setName("third auditory");
//        roomDTO.setRoomSize(RoomSize.MEDIUM);
//        Room room = new RoomMapperImpl().convertToEntity(roomDTO);
//
//        mockMvc.perform(put("/rooms", "2").content(objectMapper.writeValueAsString(room))
//                .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(room.getId()))
//                .andExpect(jsonPath("$.name").value(room.getName()));
////                .andExpect(jsonPath("$.roomSize").value(room.getRoomSize()));
//    }
//
//    @Test
//    public void testDelete() throws Exception {
//        mockMvc.perform(delete("/rooms/{id}", "1")
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk());
//    }
//}

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class RoomControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();
    private Room room = new Room();
    private AddRoomDTO roomDtoForBefore = new AddRoomDTO();
    private AddRoomDTO roomDtoForSave = new AddRoomDTO();
    private RoomDTO roomDtoForUpdate = new RoomDTO();


    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private RoomService roomService;

    @Before
    public void init() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Before
    public void insertData() {

        //Save new period before all Test methods
        roomDtoForBefore.setName("dto name");
        roomDtoForBefore.setRoomSize(RoomSize.LARGE);
        room = new RoomMapperImpl().convertToEntity(roomDtoForBefore);
        roomService.save(room);

        roomDtoForSave.setName("save name");
        roomDtoForSave.setRoomSize(RoomSize.MEDIUM);

        roomDtoForUpdate.setId(room.getId());
        roomDtoForUpdate.setName("update name");
        roomDtoForUpdate.setRoomSize(RoomSize.SMALL);
    }

    @After
    public void deleteData() {
        roomDtoForBefore = null;
        roomService.delete(room);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/rooms").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {

        mockMvc.perform(get("/rooms/{id}", String.valueOf(room.getId())).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    public void testSave() throws Exception {

        mockMvc.perform(post("/rooms").content(objectMapper.writeValueAsString(roomDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {

        Room roomForCompare = new RoomMapperImpl().convertToEntity(roomDtoForUpdate);

        mockMvc.perform(put("/rooms", String.valueOf(room.getId())).content(objectMapper.writeValueAsString(roomDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(roomForCompare.getId()))
                .andExpect(jsonPath("$.name").value(roomForCompare.getName()))
                .andExpect(jsonPath("$.roomSize").value(roomForCompare.getRoomSize().toString()));
    }

    @Test
    public void testDelete() throws Exception {
        AddRoomDTO addRoomDTO = new AddRoomDTO();
        addRoomDTO.setName("delete name");
        addRoomDTO.setRoomSize(RoomSize.SMALL);
        Room room = roomService.save(new RoomMapperImpl().convertToEntity(addRoomDTO));
        mockMvc.perform(delete("/rooms/{id}", String.valueOf(room.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());
    }
}