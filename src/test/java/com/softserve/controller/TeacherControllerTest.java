package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.assertions.CustomMockMvcAssertions;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.DepartmentDTO;
import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.rules.SpringClassRule;
import org.springframework.test.context.junit4.rules.SpringMethodRule;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import java.util.Arrays;
import java.util.List;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Category(IntegrationTestCategory.class)
@RunWith(JUnitParamsRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
@WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "MANAGER")
@Sql(value = "classpath:create-teachers-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class TeacherControllerTest {
    @ClassRule
    public static final SpringClassRule scr = new SpringClassRule();

    @Rule
    public final SpringMethodRule smr = new SpringMethodRule();

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private TeacherDTO teacherDtoWithId1L;

    private TeacherDTO disabledTeacherDtoWithId2LAndWithoutEmail;

    private TeacherForUpdateDTO teacherForUpdateDtoWithId1L;

    private TeacherForUpdateDTO teacherForUpdateDtoWithId2LAndWithoutEmail;

    private CustomMockMvcAssertions assertions;

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        assertions = new CustomMockMvcAssertions(mockMvc, objectMapper, "/teachers");

        DepartmentDTO departmentDTO = new DepartmentDTO();
        departmentDTO.setId(1L);
        departmentDTO.setName("Department1");

        String teacherName = "Ivan";
        String teacherSurname = "Ivanov";
        String teacherPatronymic = "Ivanovych";
        String teacherPosition = "docent";
        String teacherEmail = "teacher@gmail.com";

        teacherDtoWithId1L = new TeacherDTO();
        teacherDtoWithId1L.setId(1L);
        teacherDtoWithId1L.setName(teacherName);
        teacherDtoWithId1L.setSurname(teacherSurname);
        teacherDtoWithId1L.setPatronymic(teacherPatronymic);
        teacherDtoWithId1L.setPosition(teacherPosition);
        teacherDtoWithId1L.setDepartmentDTO(departmentDTO);
        teacherDtoWithId1L.setEmail(teacherEmail);

        disabledTeacherDtoWithId2LAndWithoutEmail = new TeacherDTO();
        disabledTeacherDtoWithId2LAndWithoutEmail.setId(2L);
        disabledTeacherDtoWithId2LAndWithoutEmail.setName(teacherName);
        disabledTeacherDtoWithId2LAndWithoutEmail.setSurname(teacherSurname);
        disabledTeacherDtoWithId2LAndWithoutEmail.setPatronymic(teacherPatronymic);
        disabledTeacherDtoWithId2LAndWithoutEmail.setPosition(teacherPosition);
        disabledTeacherDtoWithId2LAndWithoutEmail.setDepartmentDTO(departmentDTO);

        teacherForUpdateDtoWithId1L = new TeacherForUpdateDTO();
        teacherForUpdateDtoWithId1L.setId(1L);
        teacherForUpdateDtoWithId1L.setName(teacherName);
        teacherForUpdateDtoWithId1L.setSurname(teacherSurname);
        teacherForUpdateDtoWithId1L.setPatronymic(teacherPatronymic);
        teacherForUpdateDtoWithId1L.setPosition(teacherPosition);
        teacherForUpdateDtoWithId1L.setDepartmentDTO(departmentDTO);
        teacherForUpdateDtoWithId1L.setEmail(teacherEmail);

        teacherForUpdateDtoWithId2LAndWithoutEmail = new TeacherForUpdateDTO();
        teacherForUpdateDtoWithId2LAndWithoutEmail.setId(2L);
        teacherForUpdateDtoWithId2LAndWithoutEmail.setName(teacherName);
        teacherForUpdateDtoWithId2LAndWithoutEmail.setSurname(teacherSurname);
        teacherForUpdateDtoWithId2LAndWithoutEmail.setPatronymic(teacherPatronymic);
        teacherForUpdateDtoWithId2LAndWithoutEmail.setPosition(teacherPosition);
        teacherForUpdateDtoWithId2LAndWithoutEmail.setDepartmentDTO(departmentDTO);
    }

    @Test
    public void getTeacherById() throws Exception {
        assertions.assertForGet(teacherDtoWithId1L, "/teachers/1");
    }

    @Test
    public void getAllTeachers() throws Exception {
        assertions.assertForGetListWithOneEntity(teacherDtoWithId1L);
    }

    @Test
    @WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "USER")
    public void returnForbiddenIfAuthenticatedUserRoleIsNotManager() throws Exception {
        mockMvc.perform(get("/teachers").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    public void saveTeacher() throws Exception {
        TeacherDTO expected = disabledTeacherDtoWithId2LAndWithoutEmail;
        expected.setId(null);
        assertions.assertForSave(expected, TeacherControllerTest::matchTeacherExcludingId);
    }

    @Test
    public void updateTeacherIfEmailAndUserIdNotExist() throws Exception {
        assertions.assertForUpdate(teacherForUpdateDtoWithId2LAndWithoutEmail);
    }

    @Test
    public void updateTeacherIfEmailAndUserIdExist() throws Exception {
        assertions.assertForUpdate(teacherForUpdateDtoWithId1L);
    }

    @Test
    public void deleteTeacher() throws Exception {
        assertions.assertForDelete(1);
    }

    @Test
    public void returnNotFoundIfTeacherNotFoundedById() throws Exception {
        assertions.assertForGetWhenEntityNotFound(100);
    }

    @Test
    public void getAllPublicTeachers() throws Exception {
        assertions.assertForGetListWithOneEntity(teacherDtoWithId1L, "/public/teachers");
    }

    @Test
    public void getDisableTeachers() throws Exception {
        assertions.assertForGetListWithOneEntity(disabledTeacherDtoWithId2LAndWithoutEmail, "/teachers/disabled");
    }

    @Test
    public void getAllNotRegisteredTeachers() throws Exception {
        assertions.assertForGetListWithOneEntity(disabledTeacherDtoWithId2LAndWithoutEmail, "/not-registered-teachers");
    }

    public Object[] parametersForTestValidationException() {
        TeacherDTO teacherDTOWithNullValues = new TeacherDTO();
        ApiValidationError nameIsNull = new ApiValidationError(
                "Teacher",
                "name",
                null,
                "Name cannot be empty"
        );
        ApiValidationError positionIsNull = new ApiValidationError(
                "Teacher",
                "position",
                null,
                "Position cannot be empty"
        );
        ApiValidationError surnameIsNull = new ApiValidationError(
                "Teacher",
                "surname",
                null,
                "Surname cannot be empty"
        );
        ApiValidationError patronymicIsNull = new ApiValidationError(
                "Teacher",
                "patronymic",
                null,
                "Patronymic cannot be empty"
        );
        List<ApiValidationError> errorListWithNullValues = Arrays.asList(
                nameIsNull,
                positionIsNull,
                surnameIsNull,
                patronymicIsNull
        );

        String wordWithLength1 = "T";

        TeacherDTO teacherDTOWithValuesLengthsLessThanMin = new TeacherDTO();
        teacherDTOWithValuesLengthsLessThanMin.setName(wordWithLength1);
        teacherDTOWithValuesLengthsLessThanMin.setSurname(wordWithLength1);
        teacherDTOWithValuesLengthsLessThanMin.setPosition(wordWithLength1);
        teacherDTOWithValuesLengthsLessThanMin.setPatronymic(wordWithLength1);

        ApiValidationError nameLengthIs1 = new ApiValidationError(
                "Teacher",
                "name",
                wordWithLength1,
                "Name must be between 2 and 35 characters long"
        );

        ApiValidationError positionLengthIs1 = new ApiValidationError(
                "Teacher",
                "position",
                wordWithLength1,
                "Position must be between 2 and 35 characters long"
        );
        ApiValidationError surnameLengthIs1 = new ApiValidationError(
                "Teacher",
                "surname",
                wordWithLength1,
                "Surname must be between 2 and 35 characters long"
        );
        ApiValidationError patronymicLengthIs1 = new ApiValidationError(
                "Teacher",
                "patronymic",
                wordWithLength1,
                "Patronymic must be between 2 and 35 characters long"
        );
        List<ApiValidationError> errorListWithMinLength = Arrays.asList(
                nameLengthIs1,
                positionLengthIs1,
                surnameLengthIs1,
                patronymicLengthIs1
        );

        String wordWithLength36 = RandomStringUtils.random(36, "abc");

        TeacherDTO teacherDTOWithValuesLengthsMoreThanMax = new TeacherDTO();
        teacherDTOWithValuesLengthsMoreThanMax.setName(wordWithLength36);
        teacherDTOWithValuesLengthsMoreThanMax.setSurname(wordWithLength36);
        teacherDTOWithValuesLengthsMoreThanMax.setPosition(wordWithLength36);
        teacherDTOWithValuesLengthsMoreThanMax.setPatronymic(wordWithLength36);

        ApiValidationError nameLengthIs36 = new ApiValidationError(
                "Teacher",
                "name",
                wordWithLength36,
                "Name must be between 2 and 35 characters long"
        );

        ApiValidationError positionLengthIs36 = new ApiValidationError(
                "Teacher",
                "position",
                wordWithLength36,
                "Position must be between 2 and 35 characters long"
        );
        ApiValidationError surnameLengthIs36 = new ApiValidationError(
                "Teacher",
                "surname",
                wordWithLength36,
                "Surname must be between 2 and 35 characters long"
        );
        ApiValidationError patronymicLengthIs36 = new ApiValidationError(
                "Teacher",
                "patronymic",
                wordWithLength36,
                "Patronymic must be between 2 and 35 characters long"
        );
        List<ApiValidationError> errorListWithMaxLength = Arrays.asList(
                nameLengthIs36,
                positionLengthIs36,
                surnameLengthIs36,
                patronymicLengthIs36
        );

        return new Object[] {
                new Object[] { teacherDTOWithNullValues, errorListWithNullValues},
                new Object[] { teacherDTOWithValuesLengthsLessThanMin, errorListWithMinLength },
                new Object[] { teacherDTOWithValuesLengthsMoreThanMax, errorListWithMaxLength }
        };
    }

    @Parameters
    @Test
    public void testValidationException(TeacherDTO teacherDTO, List<ApiValidationError> errorList) throws Exception {
        assertions.assertForValidationErrorsOnSave(errorList, teacherDTO);
    }

    private static ResultMatcher matchTeacherExcludingId(TeacherDTO expected) {
        return ResultMatcher.matchAll(
                jsonPath("$.name").value(expected.getName()),
                jsonPath("$.surname").value(expected.getSurname()),
                jsonPath("$.patronymic").value(expected.getPatronymic()),
                jsonPath("$.position").value(expected.getPosition()),
                jsonPath("$.department").value(expected.getDepartmentDTO())
        );
    }
}

