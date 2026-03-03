package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.dto.DepartmentDTO;
import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import com.softserve.exception.apierror.ApiValidationError;
import org.apache.commons.lang3.RandomStringUtils;
import org.hamcrest.core.IsNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Tag("integration")
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "MANAGER")
@Sql(value = "classpath:create-teachers-before.sql")
class TeacherControllerTest {

    private static final String BASE_URL = "/teachers";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private DepartmentDTO departmentDTO;

    @BeforeEach
    public void setup() {
        departmentDTO = new DepartmentDTO();
        departmentDTO.setId(1L);
        departmentDTO.setName("Department1");
    }

    @Test
    public void getTeacherById() throws Exception {
        TeacherDTO expected = createTeacherDTO(10L, "Ivan", "Ivanov", "Ivanovych",
                "docent", "teacher@gmail.com", false);

        mockMvc.perform(get(BASE_URL + "/10").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(objectMapper.writeValueAsString(expected)));
    }

    @Test
    public void getAllTeachers() throws Exception {
        mockMvc.perform(get(BASE_URL).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void getAllPublicTeachers() throws Exception {
        mockMvc.perform(get("/public/teachers").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void getDisableTeachers() throws Exception {
        TeacherDTO expected = createTeacherDTO(20L, "Petro", "Petrov", "Petrovych",
                "docent", null, true);

        mockMvc.perform(get(BASE_URL + "/disabled").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(content().string(objectMapper.writeValueAsString(List.of(expected))));
    }

    @Test
    public void getAllNotRegisteredTeachers() throws Exception {
        mockMvc.perform(get("/not-registered-teachers").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void returnNotFoundIfTeacherNotFoundedById() throws Exception {
        mockMvc.perform(get(BASE_URL + "/100").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    public void saveTeacher() throws Exception {
        TeacherDTO newTeacher = createTeacherDTO(null, "Olena", "Olenina", "Olenivna",
                "docent", null, false);

        mockMvc.perform(post(BASE_URL)
                        .content(objectMapper.writeValueAsString(newTeacher))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("Olena"))
                .andExpect(jsonPath("$.surname").value("Olenina"))
                .andExpect(jsonPath("$.patronymic").value("Olenivna"))
                .andExpect(jsonPath("$.position").value("docent"));
    }

    @Test
    public void saveTeacherWithDuplicateFullNameShouldFail() throws Exception {
        TeacherDTO duplicate = createTeacherDTO(null, "Ivan", "Ivanov", "Ivanovych",
                "docent", null, false);

        mockMvc.perform(post(BASE_URL)
                        .content(objectMapper.writeValueAsString(duplicate))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
    @Test
    public void updateTeacherWithEmailAndUserId() throws Exception {
        TeacherForUpdateDTO teacher = createTeacherForUpdateDTO(10L, "Ivan", "Ivanov",
                "Ivanovych", "docent", "teacher@gmail.com", false);

        mockMvc.perform(put(BASE_URL)
                        .content(objectMapper.writeValueAsString(teacher))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(objectMapper.writeValueAsString(teacher)));
    }

    @Test
    public void updateTeacherWithoutEmailAndUserId() throws Exception {
        TeacherForUpdateDTO teacher = createTeacherForUpdateDTO(20L, "Petro", "Petrov",
                "Petrovych", "docent", null, true);

        mockMvc.perform(put(BASE_URL)
                        .content(objectMapper.writeValueAsString(teacher))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(objectMapper.writeValueAsString(teacher)));
    }

    @Test
    public void deleteTeacher() throws Exception {
        mockMvc.perform(delete(BASE_URL + "/{id}", 10).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "USER")
    public void returnForbiddenIfAuthenticatedUserRoleIsNotManager() throws Exception {
        mockMvc.perform(get(BASE_URL).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    static Stream<Arguments> validationExceptionProvider() {
        TeacherDTO withNullValues = new TeacherDTO();
        List<ApiValidationError> nullErrors = Arrays.asList(
                new ApiValidationError("Teacher", "name", null, "Name cannot be empty"),
                new ApiValidationError("Teacher", "position", null, "Position cannot be empty"),
                new ApiValidationError("Teacher", "surname", null, "Surname cannot be empty"),
                new ApiValidationError("Teacher", "patronymic", null, "Patronymic cannot be empty")
        );

        String tooShort = "T";
        TeacherDTO withShortValues = new TeacherDTO();
        withShortValues.setName(tooShort);
        withShortValues.setSurname(tooShort);
        withShortValues.setPosition(tooShort);
        withShortValues.setPatronymic(tooShort);

        String lengthMsg = "must be between 2 and 35 characters long";
        List<ApiValidationError> shortErrors = Arrays.asList(
                new ApiValidationError("Teacher", "name", tooShort, "Name " + lengthMsg),
                new ApiValidationError("Teacher", "position", tooShort, "Position " + lengthMsg),
                new ApiValidationError("Teacher", "surname", tooShort, "Surname " + lengthMsg),
                new ApiValidationError("Teacher", "patronymic", tooShort, "Patronymic " + lengthMsg)
        );

        String tooLong = RandomStringUtils.random(36, "abc");
        TeacherDTO withLongValues = new TeacherDTO();
        withLongValues.setName(tooLong);
        withLongValues.setSurname(tooLong);
        withLongValues.setPosition(tooLong);
        withLongValues.setPatronymic(tooLong);

        List<ApiValidationError> longErrors = Arrays.asList(
                new ApiValidationError("Teacher", "name", tooLong, "Name " + lengthMsg),
                new ApiValidationError("Teacher", "position", tooLong, "Position " + lengthMsg),
                new ApiValidationError("Teacher", "surname", tooLong, "Surname " + lengthMsg),
                new ApiValidationError("Teacher", "patronymic", tooLong, "Patronymic " + lengthMsg)
        );

        return Stream.of(
                Arguments.of(withNullValues, nullErrors),
                Arguments.of(withShortValues, shortErrors),
                Arguments.of(withLongValues, longErrors)
        );
    }

    @ParameterizedTest
    @MethodSource("validationExceptionProvider")
    void testValidationException(TeacherDTO teacherDTO, List<ApiValidationError> expectedErrors) throws Exception {
        var result = mockMvc.perform(post(BASE_URL)
                        .content(objectMapper.writeValueAsString(teacherDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        var apiError = objectMapper.readValue(
                result.getResponse().getContentAsString(),
                com.softserve.exception.apierror.ApiError.class);
        assertThat(apiError.getSubErrors())
                .hasSameSizeAs(expectedErrors)
                .hasSameElementsAs(expectedErrors);
    }

    @Test
    public void testImportFromCsv() throws Exception {
        MockMultipartFile multipartFile = new MockMultipartFile("file",
                "teachers.csv", "csv",
                Files.readAllBytes(Path.of("src/test/resources/test_teachers.csv")));

        mockMvc.perform(multipart("/teachers/import")
                        .file(multipartFile)
                        .param("departmentId", "2"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$", hasSize(8)))
                .andExpect(importedTeacher(0, "FirstName", "FirstSurname", "FirstPatronymic",
                        "FirstPosition", "FirstEmail@test.com", "SAVED", 2))
                .andExpect(importedTeacher(1, "SecondName", "SecondSurname", "SecondPatronymic",
                        "SecondPosition", "SecondEmail@test.com", "ALREADY_EXIST", 2))
                .andExpect(importedTeacher(2, "ThirdName", "ThirdSurname", "ThirdPatronymic",
                        "ThirdPosition", "ThirdEmail@test.com", "ALREADY_EXIST", 1))
                .andExpect(importedTeacher(3, "FourthName", "FourthSurname", "FourthPatronymic",
                        "FourthPosition", "FourthEmail@test.com", "SAVED", 2))
                .andExpect(importedTeacher(4, "Five", "Five", "Five",
                        "Five", "Five@test.com", "ALREADY_EXIST", 2))
                .andExpect(importedTeacher(5, "Six", "Six", "Six",
                        "Six", "Six@test.com", "ALREADY_EXIST", 1))
                .andExpect(importedTeacher(6, "Seven", "Seven", "Seven",
                        "Seven", "Seven@test.com", "ALREADY_EXIST", 1))
                .andExpect(invalidImportedTeacher(7, "Name", "Surname", "Patronymic",
                        "Position", "Email"));
    }

    private TeacherDTO createTeacherDTO(Long id, String name, String surname,
                                        String patronymic, String position,
                                        String email, boolean disable) {
        TeacherDTO dto = new TeacherDTO();
        dto.setId(id);
        dto.setName(name);
        dto.setSurname(surname);
        dto.setPatronymic(patronymic);
        dto.setPosition(position);
        dto.setEmail(email);
        dto.setDisable(disable);
        dto.setDepartmentDTO(departmentDTO);
        return dto;
    }

    private TeacherForUpdateDTO createTeacherForUpdateDTO(Long id, String name, String surname,
                                                          String patronymic, String position,
                                                          String email, boolean disable) {
        TeacherForUpdateDTO dto = new TeacherForUpdateDTO();
        dto.setId(id);
        dto.setName(name);
        dto.setSurname(surname);
        dto.setPatronymic(patronymic);
        dto.setPosition(position);
        dto.setEmail(email);
        dto.setDisable(disable);
        dto.setDepartmentDTO(departmentDTO);
        return dto;
    }

    private static ResultMatcher importedTeacher(int i, String name, String surname,
                                                 String patronymic, String position,
                                                 String email, String status, int departmentId) {
        String prefix = "$[%d].".formatted(i);
        return result -> {
            jsonPath(prefix + "name").value(name).match(result);
            jsonPath(prefix + "surname").value(surname).match(result);
            jsonPath(prefix + "patronymic").value(patronymic).match(result);
            jsonPath(prefix + "position").value(position).match(result);
            jsonPath(prefix + "email").value(email).match(result);
            jsonPath(prefix + "importSaveStatus").value(status).match(result);
            jsonPath(prefix + "department.id").value(departmentId).match(result);
        };
    }

    private static ResultMatcher invalidImportedTeacher(int i, String name, String surname,
                                                        String patronymic, String position,
                                                        String email) {
        String prefix = "$[%d].".formatted(i);
        return result -> {
            jsonPath(prefix + "id").value(IsNull.nullValue()).match(result);
            jsonPath(prefix + "name").value(name).match(result);
            jsonPath(prefix + "surname").value(surname).match(result);
            jsonPath(prefix + "patronymic").value(patronymic).match(result);
            jsonPath(prefix + "position").value(position).match(result);
            jsonPath(prefix + "email").value(email).match(result);
            jsonPath(prefix + "importSaveStatus").value("VALIDATION_ERROR").match(result);
            jsonPath(prefix + "department").value(IsNull.nullValue()).match(result);
        };
    }
}
