package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.assertions.CustomMockMvcAssertions;
import com.softserve.dto.DepartmentDTO;
import com.softserve.dto.TeacherDTO;
import com.softserve.exception.apierror.ApiValidationError;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.Collections;
import java.util.stream.Stream;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Tag("integration")
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(
        username = "vbforwork702@mail.com",
        password = "$2a$10$42sZYaqffhxKah7sTFsm3OXF02qdUUykPfVWPO3GguHvoDui.WsIi",
        roles = "MANAGER"
)
@Sql(value = "classpath:create-departments-before.sql")
class DepartmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private CustomMockMvcAssertions assertions;

    @Autowired
    private ObjectMapper objectMapper;

    private DepartmentDTO departmentDTOWithId4L;

    private DepartmentDTO disableDepartmentDTOWithId5L;

    @BeforeEach
    void setup() {
        assertions = new CustomMockMvcAssertions(mockMvc, objectMapper, "/departments");

        departmentDTOWithId4L = DepartmentDTO.builder()
                .id(4L)
                .name("Department4")
                .disable(false)
                .build();

        disableDepartmentDTOWithId5L = DepartmentDTO.builder()
                .id(5L)
                .name("Department5")
                .disable(true)
                .build();
    }

    @Test
    void getAll() throws Exception {
        assertions.assertForGetListWithOneEntity(departmentDTOWithId4L);
    }

    @Test
    void getById() throws Exception {
        assertions.assertForGet(departmentDTOWithId4L, "/departments/4");
    }

    @Test
    @WithMockUser(
            username = "vbforwork702@mail.com",
            password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.",
            roles = "USER"
    )
    void returnForbiddenIfAuthenticatedUserRoleIsNotManager() throws Exception {
        mockMvc.perform(get("/departments/{id}", 1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void saveDepartment() throws Exception {
        DepartmentDTO expected = new DepartmentDTO();
        expected.setName("save new departments");
        assertions.assertForSave(expected, e -> jsonPath("$.name").value(e.getName()));
    }

    @Test
    void updateDepartment() throws Exception {
        assertions.assertForUpdate(departmentDTOWithId4L);
    }

    @Test
    void deleteById() throws Exception {
        assertions.assertForDelete(5);
    }

    @Test
    void returnBadRequestIfReferencesOnDepartmentExist() throws Exception {
        mockMvc.perform(delete("/departments/{id}", 4)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnNotFoundIfEntityNotFoundedById() throws Exception {
        assertions.assertForGetWhenEntityNotFound(20);
    }

    @Test
    void throwFieldAlreadyExistsExceptionOnSave() throws Exception {
        DepartmentDTO departmentDTO = new DepartmentDTO();
        departmentDTO.setName(departmentDTOWithId4L.getName());
        assertThatReturnedFieldAlreadyExistsException(post("/departments"), departmentDTO);
    }

    @Test
    void throwFieldAlreadyExistsExceptionOnUpdate() throws Exception {
        DepartmentDTO departmentDTO = departmentDTOWithId4L;
        departmentDTO.setName(disableDepartmentDTOWithId5L.getName());
        assertThatReturnedFieldAlreadyExistsException(put("/departments"), departmentDTO);
    }

    static Stream<Object[]> validationExceptionProvider() {
        String errorMessage = "Name cannot be blank";
        return Stream.of(
                new Object[]{null, errorMessage},
                new Object[]{"", errorMessage},
                new Object[]{"  ", errorMessage}
        );
    }

    @ParameterizedTest
    @MethodSource("validationExceptionProvider")
    void testValidationException(String incorrectName, String errorMessage) throws Exception {
        DepartmentDTO departmentDTO = new DepartmentDTO();
        departmentDTO.setName(incorrectName);
        ApiValidationError error = new ApiValidationError(
                "Department",
                "name",
                incorrectName,
                errorMessage
        );
        assertions.assertForValidationErrorsOnSave(Collections.singletonList(error), departmentDTO);
    }

    @Test
    void getAllDisable() throws Exception {
        assertions.assertForGetListWithOneEntity(disableDepartmentDTOWithId5L, "/departments/disabled");
    }

    @Test
    void getAllTeachers() throws Exception {
        DepartmentDTO departmentDTO = departmentDTOWithId4L;

        TeacherDTO firstTeacher = new TeacherDTO();
        firstTeacher.setId(4L);
        firstTeacher.setDisable(false);
        firstTeacher.setName("Ivan");
        firstTeacher.setSurname("Ivanov");
        firstTeacher.setPatronymic("Ivanovych");
        firstTeacher.setPosition("docent");
        firstTeacher.setDepartmentDTO(departmentDTO);

        assertions.assertForGetListWithOneEntity(firstTeacher, "/departments/4/teachers");
    }

    private <T> void assertThatReturnedFieldAlreadyExistsException(MockHttpServletRequestBuilder requestBuilder,
                                                                   T groupDTO) throws Exception {
        mockMvc.perform(requestBuilder.content(objectMapper.writeValueAsString(groupDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.message")
                        .value("Department with provided name already exists"));
    }
}
