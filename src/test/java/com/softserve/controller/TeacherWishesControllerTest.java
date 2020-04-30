package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.AddWishesDTO;
import com.softserve.dto.TeacherWishesDTO;
import com.softserve.entity.Teacher;
import com.softserve.entity.TeacherWishes;
import com.softserve.entity.Wish;
import com.softserve.entity.Wishes;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.WishStatuses;
import com.softserve.service.TeacherService;
import com.softserve.service.TeacherWishesService;
import com.softserve.service.impl.TeacherWishesServiceImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Category(IntegrationTestCategory.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
@WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "MANAGER")
@Sql(value = "classpath:create-teacherwishes-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class TeacherWishesControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    TeacherService teacherService;

    @Autowired
    TeacherWishesService teacherWishesService;

    @Autowired
    WebApplicationContext wac;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @Test
    public void getAllTeacherWishes() throws Exception {
        mockMvc.perform(get("/teacher_wishes").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void saveTeacherWishes() throws Exception {
        Wish wish = new Wish();
        wish.setClassName("1 para");
        wish.setStatus(WishStatuses.GOOD);
        List<Wish> wishList = new ArrayList<>();
        wishList.add(wish);
        Wishes wishes = new Wishes();
        wishes.setDayOfWeek(DayOfWeek.MONDAY);
        wishes.setEvenOdd(EvenOdd.EVEN);
        wishes.setWishes(wishList);
        Wishes[] wishesArray = {wishes};
        AddWishesDTO saveTeacherWishes = new AddWishesDTO();
        saveTeacherWishes.setTeacher(teacherService.getById(4L));
        saveTeacherWishes.setTeacherWishesList(wishesArray);

        mockMvc.perform(post("/teacher_wishes").content(objectMapper.writeValueAsString(saveTeacherWishes))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated());
    }

    @Test
    public void updateTeacherWishes() throws Exception {
        Wish wish = new Wish();
        wish.setClassName("1 para");
        wish.setStatus(WishStatuses.GOOD);
        List<Wish> wishList = new ArrayList<>();
        wishList.add(wish);
        Wishes wishes = new Wishes();
        wishes.setDayOfWeek(DayOfWeek.MONDAY);
        wishes.setEvenOdd(EvenOdd.EVEN);
        wishes.setWishes(wishList);
        Wishes[] wishesArray = {wishes};
        TeacherWishes teacherWishes = new TeacherWishes();
        teacherWishes.setTeacher(teacherService.getById(4L));
        teacherWishes.setTeacherWishesList(wishesArray);
        TeacherWishes savedTeacherWishes = teacherWishesService.save(teacherWishes);
        TeacherWishesDTO teacherWishesDTO = new TeacherWishesDTO();
        teacherWishesDTO.setId(savedTeacherWishes.getId());
        Wish updatedWish = new Wish();
        updatedWish.setClassName("2 para");
        updatedWish.setStatus(WishStatuses.BAD);
        List<Wish> updatedWishList = new ArrayList<>();
        updatedWishList.add(updatedWish);
        Wishes updatedWishes = new Wishes();
        updatedWishes.setDayOfWeek(DayOfWeek.MONDAY);
        updatedWishes.setEvenOdd(EvenOdd.EVEN);
        updatedWishes.setWishes(updatedWishList);
        Wishes[] updatedWishesArray = {updatedWishes};
        teacherWishesDTO.setTeacherWishesList(updatedWishesArray);

        mockMvc.perform(put("/teacher_wishes").content(objectMapper.writeValueAsString(teacherWishesDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(teacherWishesDTO.getId()));
    }
}
