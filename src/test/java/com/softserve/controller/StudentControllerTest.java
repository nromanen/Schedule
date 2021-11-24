package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.assertions.CustomMockMvcAssertions;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.SecurityConfig;
import com.softserve.config.SecurityWebApplicationInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.GroupDTO;
import com.softserve.dto.StudentDTO;
import com.softserve.exception.apierror.ApiValidationError;
import junitparams.JUnitParamsRunner;
import junitparams.Parameters;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.rules.SpringClassRule;
import org.springframework.test.context.junit4.rules.SpringMethodRule;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Category(IntegrationTestCategory.class)
@RunWith(JUnitParamsRunner.class)
@ContextConfiguration(
        classes = {
                WebMvcConfig.class,
                DBConfigTest.class,
                MyWebAppInitializer.class,
                SecurityConfig.class,
                SecurityWebApplicationInitializer.class
        }
)
@WebAppConfiguration
@WithMockUser(
        username = "first@mail.com",
        password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.",
        roles = "MANAGER"
)
@Sql(value = {"classpath:create-students-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class StudentControllerTest {
    @ClassRule
    public static final SpringClassRule scr = new SpringClassRule();

    @Rule
    public final SpringMethodRule smr = new SpringMethodRule();

    private static MockMvc mockMvc;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    private CustomMockMvcAssertions assertions;

    private StudentDTO studentDTOWithId4L;

    private StudentDTO studentDTOWithId5L;

    private StudentDTO studentDTOWithId6L;

    private final GroupDTO groupDTO = GroupDTO.builder()
            .id(1L)
            .disable(false)
            .title("First Title")
            .build();

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
        assertions = new CustomMockMvcAssertions(mockMvc, objectMapper, "/students");

        studentDTOWithId4L = StudentDTO.builder()
                .id(4L)
                .name("First Name1")
                .surname("First Surname1")
                .patronymic("First Patronymic1")
                .email("aware.123db@gmail.com")
                .group(groupDTO)
                .build();

        studentDTOWithId5L = StudentDTO.builder()
                .id(5L)
                .name("First Name2")
                .surname("First Surname2")
                .patronymic("First Patronymic2")
                .email("student@gmail.com")
                .group(groupDTO)
                .build();

        studentDTOWithId6L = StudentDTO.builder()
                .id(6L)
                .name("Hanna")
                .surname("Romaniuk")
                .patronymic("Stepanivna")
                .email("romaniuk@gmail.com")
                .group(groupDTO)
                .build();

    }

    @Test
    public void getAllStudents() throws Exception {
        assertions.assertForGetList(asList(studentDTOWithId4L, studentDTOWithId5L, studentDTOWithId6L));
    }

    @Test
    public void getStudentById() throws Exception {
        assertions.assertForGet(studentDTOWithId4L, "/students/4");
    }

    @Test
    public void saveStudent() throws Exception {
        StudentDTO expected = studentDTOWithId4L;
        expected.setId(null);
        expected.setEmail("dfdfdf@gmail.com");
        assertions.assertForSave(expected, StudentControllerTest::matchStudentExcludingId);
    }

    @Test
    public void throwFieldAlreadyExistsExceptionWhenSave() throws Exception {
        StudentDTO studentDTO = studentDTOWithId4L;
        studentDTO.setId(null);
        assertThatReturnedFieldAlreadyExistsException(post("/students"), studentDTO);
    }

    @Test
    public void updateStudent() throws Exception {
        assertions.assertForUpdate(studentDTOWithId5L);
    }

    @Test
    public void updateListStudent() throws Exception {
        List<StudentDTO> listOfStudentsForUpdate = new ArrayList<>();
        StudentDTO student = new StudentDTO();
        student.setEmail("aware.123db@gmail.com");
        student.setId(4L);
        student.setGroup(groupDTO);
        student.setName("First Name11");
        student.setSurname("First Surname11");
        student.setPatronymic("First Patronymic11");
        listOfStudentsForUpdate.add(student);
        student = new StudentDTO();
        student.setEmail("student@gmail.com");
        student.setId(5L);
        student.setGroup(groupDTO);
        student.setName("First Name22");
        student.setSurname("First Surname22");
        student.setPatronymic("First Patronymic22");
        listOfStudentsForUpdate.add(student);


        mockMvc.perform(put("/students/list")
                        .content(objectMapper.writeValueAsString(listOfStudentsForUpdate))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value(listOfStudentsForUpdate.get(0)))
                .andExpect(jsonPath("$[1]").value(listOfStudentsForUpdate.get(1)));

    }


    @Test
    public void throwFieldAlreadyExistsExceptionWhenUpdate() throws Exception {
        StudentDTO studentDTO = studentDTOWithId4L;
        studentDTO.setId(null);
        studentDTO.setEmail(studentDTOWithId5L.getEmail());
        assertThatReturnedFieldAlreadyExistsException(post("/students"), studentDTO);
    }

    @Test
    public void deleteStudent() throws Exception {
        assertions.assertForDelete(5);
    }

    @Test
    @WithMockUser(
            username = "vbforweewrk702@mail.com",
            password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.",
            roles = "USER"
    )
    public void returnForbiddenIfAuthenticatedUserRoleIsNotManagerOnSave() throws Exception {
        assertThatReturnedForbiddenStatus(post("/students")
                .content(objectMapper.writeValueAsString(studentDTOWithId4L)));
    }

    @Test
    @WithMockUser(
            username = "vbforweewrk702@mail.com",
            password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.",
            roles = "USER"
    )
    public void returnForbiddenIfAuthenticatedUserRoleIsNotManagerOnUpdate() throws Exception {
        assertThatReturnedForbiddenStatus(put("/students")
                .content(objectMapper.writeValueAsString(studentDTOWithId4L)));
    }

    @Test
    @WithMockUser(
            username = "vbforweewrk702@mail.com",
            password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.",
            roles = "USER"
    )
    public void returnForbiddenIfAuthenticatedUserRoleIsNotManagerOnDelete() throws Exception {
        assertThatReturnedForbiddenStatus(delete("/students/4"));
    }

    public Object[] parametersForTestValidationException() {
        String objectError = "Student";

        StudentDTO studentDTOWithNullValues = new StudentDTO();
        ApiValidationError nameIsNullError = new ApiValidationError(
                objectError,
                "name",
                null,
                "Name cannot be empty"
        );
        ApiValidationError emailIsNullError = new ApiValidationError(
                objectError,
                "email",
                null,
                "Email cannot be empty"
        );
        ApiValidationError surnameIsNullError = new ApiValidationError(
                objectError,
                "surname",
                null,
                "Surname cannot be empty"
        );
        ApiValidationError patronymicIsNullError = new ApiValidationError(
                objectError,
                "patronymic",
                null,
                "Patronymic cannot be empty"
        );
        ApiValidationError groupIsNullError = new ApiValidationError(
                objectError,
                "group",
                null,
                "Group cannot be null"
        );

        List<ApiValidationError> errorListWithNullValues = Arrays.asList(
                nameIsNullError,
                emailIsNullError,
                surnameIsNullError,
                patronymicIsNullError,
                groupIsNullError
        );

        String wordWithLength1 = "T";
        StudentDTO studentDTOWithValuesLengthsLessThanMin = StudentDTO.builder()
                .name(wordWithLength1)
                .surname(wordWithLength1)
                .patronymic(wordWithLength1)
                .email("studenttttt@gmail.com")
                .group(groupDTO)
                .build();

        ApiValidationError nameLengthIs1Error = new ApiValidationError(
                objectError,
                "name",
                wordWithLength1,
                "Name must be between 2 and 35 characters long"
        );
        ApiValidationError surnameLengthIs1Error = new ApiValidationError(
                objectError,
                "surname",
                wordWithLength1,
                "Surname must be between 2 and 35 characters long"
        );
        ApiValidationError patronymicLengthIs1Error = new ApiValidationError(
                objectError,
                "patronymic",
                wordWithLength1,
                "Patronymic must be between 2 and 35 characters long"
        );
        List<ApiValidationError> errorListWithMinLength = Arrays.asList(
                nameLengthIs1Error,
                surnameLengthIs1Error,
                patronymicLengthIs1Error
        );

        String wordWithLength55 = RandomStringUtils.random(45, "abc") + "@gmail.com";
        StudentDTO studentDTOWithValuesLengthsMoreThanMax = StudentDTO.builder()
                .name(wordWithLength55)
                .surname(wordWithLength55)
                .patronymic(wordWithLength55)
                .email("studentttttt@gmail.com")
                .group(groupDTO)
                .build();

        ApiValidationError nameLengthIs55Error = new ApiValidationError(
                objectError,
                "name",
                wordWithLength55,
                "Name must be between 2 and 35 characters long"
        );
        ApiValidationError surnameLengthIs55Error = new ApiValidationError(
                objectError,
                "surname",
                wordWithLength55,
                "Surname must be between 2 and 35 characters long"
        );
        ApiValidationError patronymicLengthIs55Error = new ApiValidationError(
                objectError,
                "patronymic",
                wordWithLength55,
                "Patronymic must be between 2 and 35 characters long"
        );
        List<ApiValidationError> errorListWithMaxLength = Arrays.asList(
                nameLengthIs55Error,
                surnameLengthIs55Error,
                patronymicLengthIs55Error
        );

        String incorrectEmail = "saass";
        StudentDTO studentDTOWithIncorrectEmail = StudentDTO.builder()
                .name("sdsdsd")
                .surname("dsdsds")
                .patronymic("ddsd")
                .email(incorrectEmail)
                .group(groupDTO)
                .build();
        ApiValidationError incorrectEmailError = new ApiValidationError(
                objectError,
                "email",
                incorrectEmail,
                "Email must match format"
        );

        return new Object[] {
                new Object[] { studentDTOWithNullValues, errorListWithNullValues },
                new Object[] { studentDTOWithValuesLengthsLessThanMin, errorListWithMinLength },
                new Object[] { studentDTOWithValuesLengthsMoreThanMax, errorListWithMaxLength },
                new Object[] { studentDTOWithIncorrectEmail, singletonList(incorrectEmailError) },
        };
    }

    @Parameters
    @Test
    public void testValidationException(StudentDTO studentDTO, List<ApiValidationError> errorList) throws Exception {
        assertions.assertForValidationErrorsOnSave(errorList, studentDTO);
    }

    @Test
    public void saveStudentsFromFile() throws Exception {

        MockMultipartFile multipartFile = new MockMultipartFile("file",
                "students.csv",
                "text/csv",
                Files.readAllBytes(Path.of("src/test/resources/test_students.csv")));

        mockMvc.perform(multipart("/students/import").file(multipartFile).param("groupId", "1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$", hasSize(3)))

                .andExpect(jsonPath("$[0].id").value(6))
                .andExpect(jsonPath("$[0].name").value("Hanna"))
                .andExpect(jsonPath("$[0].surname").value("Romaniuk"))
                .andExpect(jsonPath("$[0].patronymic").value("Stepanivna"))
                .andExpect(jsonPath("$[0].email").value("romaniuk@gmail.com"))
                .andExpect(jsonPath("$[0].group.id").value(1))
                .andExpect(jsonPath("$[0].group.title").value("First Title"))

                .andExpect(jsonPath("$[1].id").doesNotExist())
                .andExpect(jsonPath("$[1].name").value("Oleksandr"))
                .andExpect(jsonPath("$[1].surname").value("Boichuk"))
                .andExpect(jsonPath("$[1].patronymic").value("Ivanovych"))
                .andExpect(jsonPath("$[1].email").value(""))
                .andExpect(jsonPath("$[1].group").doesNotExist())

                .andExpect(jsonPath("$[2].id").value(1))
                .andExpect(jsonPath("$[2].name").value("Viktor"))
                .andExpect(jsonPath("$[2].surname").value("Hanushchak"))
                .andExpect(jsonPath("$[2].patronymic").value("Mykolaiovych"))
                .andExpect(jsonPath("$[2].email").value("hanushchak@bigmir.net"))
                .andExpect(jsonPath("$[2].group.id").value(1))
                .andExpect(jsonPath("$[2].group.title").doesNotExist());
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

    public void assertThatReturnedForbiddenStatus(MockHttpServletRequestBuilder requestBuilder) throws Exception {
        mockMvc.perform(requestBuilder.contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}
