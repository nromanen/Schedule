package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.assertions.CustomMockMvcAssertions;
import com.softserve.dto.GroupDTO;
import com.softserve.dto.StudentDTO;
import com.softserve.exception.apierror.ApiValidationError;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
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
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Tag("integration")
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(
        username = "first@mail.com",
        password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.",
        roles = "MANAGER"
)
@Sql(value = {"classpath:create-students-before.sql"})
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private CustomMockMvcAssertions assertions;

    private StudentDTO studentDTOWithId8L;
    private StudentDTO studentDTOWithId9L;
    private StudentDTO studentDTOWithId10L;
    private StudentDTO studentDTOWithId12L;

    private final GroupDTO groupDTO = GroupDTO.builder()
            .id(1L)
            .disable(false)
            .title("First Title")
            .build();

    @BeforeEach
    void setup() {
        assertions = new CustomMockMvcAssertions(mockMvc, objectMapper, "/students");

        studentDTOWithId8L = StudentDTO.builder()
                .id(8L)
                .name("First Name1")
                .surname("First Surname1")
                .patronymic("First Patronymic1")
                .email("aware.123db@gmail.com")
                .group(groupDTO)
                .build();

        studentDTOWithId9L = StudentDTO.builder()
                .id(9L)
                .name("First Name2")
                .surname("First Surname2")
                .patronymic("First Patronymic2")
                .email("student@gmail.com")
                .group(groupDTO)
                .build();

        studentDTOWithId10L = StudentDTO.builder()
                .id(10L)
                .name("Hanna")
                .surname("Romaniuk")
                .patronymic("Stepanivna")
                .email("romaniuk@gmail.com")
                .group(groupDTO)
                .build();

        studentDTOWithId12L = StudentDTO.builder()
                .id(12L)
                .name("Fourth")
                .surname("Fourth")
                .patronymic("Fourth")
                .email("Fourth@test.com")
                .group(groupDTO)
                .build();
    }

    @Test
    void getAllStudents() throws Exception {
        assertions.assertForGetList(asList(
                studentDTOWithId8L, studentDTOWithId9L, studentDTOWithId10L, studentDTOWithId12L));
    }

    @Test
    void getStudentById() throws Exception {
        assertions.assertForGet(studentDTOWithId8L, "/students/8");
    }

    @Test
    void saveStudent() throws Exception {
        StudentDTO expected = studentDTOWithId8L;
        expected.setId(null);
        expected.setEmail("dfdfdf@gmail.com");
        assertions.assertForSave(expected, StudentControllerTest::matchStudentExcludingId);
    }

    @Test
    void throwFieldAlreadyExistsExceptionWhenSave() throws Exception {
        StudentDTO studentDTO = studentDTOWithId8L;
        studentDTO.setId(null);
        assertThatReturnedFieldAlreadyExistsException(post("/students"), studentDTO);
    }

    @Test
    void updateStudent() throws Exception {
        assertions.assertForUpdate(studentDTOWithId10L);
    }

    @Test
    void throwFieldAlreadyExistsExceptionWhenUpdate() throws Exception {
        StudentDTO studentDTO = studentDTOWithId8L;
        studentDTO.setId(null);
        studentDTO.setEmail(studentDTOWithId9L.getEmail());
        assertThatReturnedFieldAlreadyExistsException(post("/students"), studentDTO);
    }

    @Test
    void deleteStudent() throws Exception {
        assertions.assertForDelete(8);
    }

    @Test
    @WithMockUser(
            username = "vbforweewrk702@mail.com",
            password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.",
            roles = "USER"
    )
    void returnForbiddenIfAuthenticatedUserRoleIsNotManagerOnSave() throws Exception {
        assertThatReturnedForbiddenStatus(post("/students")
                .content(objectMapper.writeValueAsString(studentDTOWithId8L)));
    }

    @Test
    @WithMockUser(
            username = "vbforweewrk702@mail.com",
            password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.",
            roles = "USER"
    )
    void returnForbiddenIfAuthenticatedUserRoleIsNotManagerOnUpdate() throws Exception {
        assertThatReturnedForbiddenStatus(put("/students")
                .content(objectMapper.writeValueAsString(studentDTOWithId8L)));
    }

    @Test
    @WithMockUser(
            username = "vbforweewrk702@mail.com",
            password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.",
            roles = "USER"
    )
    void returnForbiddenIfAuthenticatedUserRoleIsNotManagerOnDelete() throws Exception {
        assertThatReturnedForbiddenStatus(delete("/students/4"));
    }

    static Stream<Object[]> validationExceptionProvider() {
        String objectError = "Student";
        GroupDTO group = GroupDTO.builder()
                .id(1L)
                .disable(false)
                .title("First Title")
                .build();

        // Object 1
        StudentDTO studentDTOWithNullValues = new StudentDTO();
        studentDTOWithNullValues.setEmail("12345Asd@test.com");
        ApiValidationError nameIsNullError = new ApiValidationError(
                objectError, "name", null, "Name cannot be empty");
        ApiValidationError surnameIsNullError = new ApiValidationError(
                objectError, "surname", null, "Surname cannot be empty");
        ApiValidationError patronymicIsNullError = new ApiValidationError(
                objectError, "patronymic", null, "Patronymic cannot be empty");
        ApiValidationError groupIsNullError = new ApiValidationError(
                objectError, "group", null, "Group cannot be null");

        List<ApiValidationError> errorListWithNullValues = Arrays.asList(
                nameIsNullError, surnameIsNullError, patronymicIsNullError, groupIsNullError);

        // Object 2
        String wordWithLength1 = "T";
        StudentDTO studentDTOWithValuesLengthsLessThanMin = StudentDTO.builder()
                .name(wordWithLength1)
                .surname(wordWithLength1)
                .patronymic(wordWithLength1)
                .email("studenttttt@gmail.com")
                .group(group)
                .build();

        ApiValidationError nameLengthIs1Error = new ApiValidationError(
                objectError, "name", wordWithLength1, "Name must be between 2 and 35 characters long");
        ApiValidationError surnameLengthIs1Error = new ApiValidationError(
                objectError, "surname", wordWithLength1, "Surname must be between 2 and 35 characters long");
        ApiValidationError patronymicLengthIs1Error = new ApiValidationError(
                objectError, "patronymic", wordWithLength1, "Patronymic must be between 2 and 35 characters long");
        List<ApiValidationError> errorListWithMinLength = Arrays.asList(
                nameLengthIs1Error, surnameLengthIs1Error, patronymicLengthIs1Error);

        // Object 3
        String wordWithLength55 = RandomStringUtils.random(45, "abc") + "@gmail.com";
        StudentDTO studentDTOWithValuesLengthsMoreThanMax = StudentDTO.builder()
                .name(wordWithLength55)
                .surname(wordWithLength55)
                .patronymic(wordWithLength55)
                .email("studentttttt@gmail.com")
                .group(group)
                .build();

        ApiValidationError nameLengthIs55Error = new ApiValidationError(
                objectError, "name", wordWithLength55, "Name must be between 2 and 35 characters long");
        ApiValidationError surnameLengthIs55Error = new ApiValidationError(
                objectError, "surname", wordWithLength55, "Surname must be between 2 and 35 characters long");
        ApiValidationError patronymicLengthIs55Error = new ApiValidationError(
                objectError, "patronymic", wordWithLength55, "Patronymic must be between 2 and 35 characters long");
        List<ApiValidationError> errorListWithMaxLength = Arrays.asList(
                nameLengthIs55Error, surnameLengthIs55Error, patronymicLengthIs55Error);

        // Last Object
        String incorrectEmail = "saass";
        StudentDTO studentDTOWithIncorrectEmail = StudentDTO.builder()
                .name("sdsdsd")
                .surname("dsdsds")
                .patronymic("ddsd")
                .email(incorrectEmail)
                .group(group)
                .build();
        ApiValidationError incorrectEmailError = new ApiValidationError(
                "User", "email", incorrectEmail, "must be a well-formed email address");

        return Stream.of(
                new Object[]{studentDTOWithNullValues, errorListWithNullValues},
                new Object[]{studentDTOWithValuesLengthsLessThanMin, errorListWithMinLength},
                new Object[]{studentDTOWithValuesLengthsMoreThanMax, errorListWithMaxLength},
                new Object[]{studentDTOWithIncorrectEmail, singletonList(incorrectEmailError)}
        );
    }

    @ParameterizedTest
    @MethodSource("validationExceptionProvider")
    void testValidationException(StudentDTO studentDTO, List<ApiValidationError> errorList) throws Exception {
        assertions.assertForValidationErrorsOnSave(errorList, studentDTO);
    }

    @Test
    void saveStudentsFromFile() throws Exception {
        MockMultipartFile multipartFile = new MockMultipartFile("file",
                "students.csv",
                "text/csv",
                Files.readAllBytes(Path.of("src/test/resources/test_students2.csv")));

        mockMvc.perform(multipart("/students/import").file(multipartFile).param("groupId", "2"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$", hasSize(6)))

                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("First"))
                .andExpect(jsonPath("$[0].surname").value("First"))
                .andExpect(jsonPath("$[0].patronymic").value("First"))
                .andExpect(jsonPath("$[0].email").value("First@test.com"))
                .andExpect(jsonPath("$[0].groupDTO.id").value(2))
                .andExpect(jsonPath("$[0].groupDTO.title").value("Second Title"))
                .andExpect(jsonPath("$[0].importSaveStatus").value("SAVED"))

                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Second"))
                .andExpect(jsonPath("$[1].surname").value("Second"))
                .andExpect(jsonPath("$[1].patronymic").value("Second"))
                .andExpect(jsonPath("$[1].email").value("Second@test.com"))
                .andExpect(jsonPath("$[1].groupDTO.id").value(2))
                .andExpect(jsonPath("$[1].groupDTO.title").value("Second Title"))
                .andExpect(jsonPath("$[1].importSaveStatus").value("SAVED"))

                .andExpect(jsonPath("$[2].id").doesNotExist())
                .andExpect(jsonPath("$[2].name").value("Third"))
                .andExpect(jsonPath("$[2].surname").value("Third"))
                .andExpect(jsonPath("$[2].patronymic").value("Third"))
                .andExpect(jsonPath("$[2].email").value("Second@test.com"))
                .andExpect(jsonPath("$[2].groupDTO").doesNotExist())
                .andExpect(jsonPath("$[2].importSaveStatus").value("ALREADY_EXIST"))

                .andExpect(jsonPath("$[3].id").value(12))
                .andExpect(jsonPath("$[3].name").value("Fourth"))
                .andExpect(jsonPath("$[3].surname").value("Fourth"))
                .andExpect(jsonPath("$[3].patronymic").value("Fourth"))
                .andExpect(jsonPath("$[3].email").value("Fourth@test.com"))
                .andExpect(jsonPath("$[3].groupDTO.id").value(1))
                .andExpect(jsonPath("$[3].groupDTO.title").value("First Title"))
                .andExpect(jsonPath("$[3].importSaveStatus").value("ALREADY_EXIST"))

                .andExpect(jsonPath("$[4].id").doesNotExist())
                .andExpect(jsonPath("$[4].name").value("Five"))
                .andExpect(jsonPath("$[4].surname").value("Five"))
                .andExpect(jsonPath("$[4].patronymic").value("Five"))
                .andExpect(jsonPath("$[4].email").value("Five@test.com"))
                .andExpect(jsonPath("$[4].groupDTO").doesNotExist())
                .andExpect(jsonPath("$[4].importSaveStatus").value("ROLE_CONFLICT"))

                .andExpect(jsonPath("$[5].id").doesNotExist())
                .andExpect(jsonPath("$[5].name").value("Name"))
                .andExpect(jsonPath("$[5].surname").value("Surname"))
                .andExpect(jsonPath("$[5].patronymic").value("Patronymic"))
                .andExpect(jsonPath("$[5].email").value("Email"))
                .andExpect(jsonPath("$[5].groupDTO").doesNotExist())
                .andExpect(jsonPath("$[5].importSaveStatus").value("VALIDATION_ERROR"));
    }

    private void assertThatReturnedFieldAlreadyExistsException(MockHttpServletRequestBuilder requestBuilder,
                                                               StudentDTO studentDTO) throws Exception {
        mockMvc.perform(requestBuilder.content(objectMapper.writeValueAsString(studentDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.message")
                        .value("Student with provided email already exists"));
    }

    private static ResultMatcher matchStudentExcludingId(StudentDTO expected) {
        return ResultMatcher.matchAll(
                jsonPath("$.name").value(expected.getName()),
                jsonPath("$.surname").value(expected.getSurname()),
                jsonPath("$.patronymic").value(expected.getPatronymic()),
                jsonPath("$.email").value(expected.getEmail()),
                jsonPath("$.group").value(expected.getGroup())
        );
    }

    private void assertThatReturnedForbiddenStatus(MockHttpServletRequestBuilder requestBuilder) throws Exception {
        mockMvc.perform(requestBuilder.contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}
