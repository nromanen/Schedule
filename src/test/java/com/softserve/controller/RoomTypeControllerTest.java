package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.dto.RoomTypeDTO;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Tag("integration")
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "MANAGER")
@Sql(value = "classpath:create-roomtypes-before.sql")
class RoomTypeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllRoomTypes() throws Exception {
        mockMvc.perform(get("/room-types").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    void getRoomTypeById() throws Exception {
        mockMvc.perform(get("/room-types/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(4));
    }

    @Test
    @WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "USER")
    void returnForbiddenIfAuthenticatedUserRoleIsNotManager() throws Exception {
        mockMvc.perform(get("/room-types/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void saveRoomType() throws Exception {
        String roomTypeJSON = """
            {
              "description": "Another Small auditory"
            }
            """;

        mockMvc.perform(post("/room-types")
                        .content(roomTypeJSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.description").value("Another Small auditory"));
    }

    @Test
    void updateRoomTypeIfUpdatedDescriptionDoesNotExist() throws Exception {
        RoomTypeDTO roomTypeDTO = new RoomTypeDTO();
        roomTypeDTO.setId(4L);
        roomTypeDTO.setDescription("Another Small auditory");

        mockMvc.perform(put("/room-types", 4).content(objectMapper.writeValueAsString(roomTypeDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(roomTypeDTO.getId()))
                .andExpect(jsonPath("$.description").value(roomTypeDTO.getDescription()));
    }

    @Test
    void deleteExistRoomType() throws Exception {
        mockMvc.perform(delete("/room-types/{id}", 6)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void returnNotFoundIfRoomTypeNotFoundedById() throws Exception {
        mockMvc.perform(get("/room-types/100")).andExpect(status().isNotFound());
    }

    @Test
    void returnBadRequestIfSavedRoomTypeAlreadyExists() throws Exception {
        RoomTypeDTO roomTypeDTO = new RoomTypeDTO();
        roomTypeDTO.setDescription("small auditory");

        mockMvc.perform(post("/room-types").content(objectMapper.writeValueAsString(roomTypeDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnBadRequestIfUpdatedRoomTypeAlreadyExists() throws Exception {
        RoomTypeDTO roomTypeDTO = new RoomTypeDTO();
        roomTypeDTO.setDescription("small auditory");
        roomTypeDTO.setId(5L);

        mockMvc.perform(put("/room-types", 5).content(objectMapper.writeValueAsString(roomTypeDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnBadRequestIfSavedDescriptionIsNull() throws Exception {
        String roomTypeJSON = "{}";

        mockMvc.perform(post("/room-types")
                        .content(roomTypeJSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnBadRequestIfUpdatedDescriptionIsNull() throws Exception {
        RoomTypeDTO roomTypeDTO = new RoomTypeDTO();
        roomTypeDTO.setId(5L);
        roomTypeDTO.setDescription(null);

        mockMvc.perform(put("/room-types").content(objectMapper.writeValueAsString(roomTypeDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}
