package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.assertions.CustomMockMvcAssertions;
import com.softserve.config.*;
import com.softserve.dto.GroupDTO;
import com.softserve.dto.GroupForUpdateDTO;
import com.softserve.dto.StudentDTO;
import com.softserve.dto.StudentWithoutGroupDTO;
import com.softserve.entity.Group;
import com.softserve.exception.apierror.ApiValidationError;
import junitparams.JUnitParamsRunner;
import junitparams.Parameters;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.*;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.rules.SpringClassRule;
import org.springframework.test.context.junit4.rules.SpringMethodRule;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Collections;

import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
@Sql(value = {"classpath:create-groups-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class GroupControllerTest {
    @ClassRule
    public static final SpringClassRule scr = new SpringClassRule();

    @Rule
    public final SpringMethodRule smr = new SpringMethodRule();

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext wac;

    private CustomMockMvcAssertions assertions;

    private GroupDTO groupDTOWithID4L;

    private GroupDTO disabledGroupDTOWithID5L;

    private StudentWithoutGroupDTO studentDTOWithId4LForGroupWithId4L;


    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        assertions = new CustomMockMvcAssertions(mockMvc, objectMapper, "/groups");

        groupDTOWithID4L = GroupDTO.builder()
                .id(4L)
                .title("444")
                .build();

        disabledGroupDTOWithID5L = GroupDTO.builder()
                .id(5L)
                .title("555")
                .build();

        studentDTOWithId4LForGroupWithId4L = StudentWithoutGroupDTO.builder()
                .id(4L)
                .name("Name One")
                .surname("Surname One")
                .patronymic("Patron One")
                .email("zzz1@gmail.com")
                .build();
    }

    @Test
    public void getAllGroups() throws Exception {
        assertions.assertForGetListWithOneEntity(groupDTOWithID4L);
    }

    @Test
    public void getGroupById() throws Exception {
        assertions.assertForGet(groupDTOWithID4L, "/groups/4");
    }

    @Test
    @WithMockUser(
            username = "second@mail.com",
            password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.",
            roles = "TEACHER"
    )
    @Sql(value = {"classpath:create-lessons-before.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    public void getByTeacherId() throws Exception {
        GroupDTO expectedGroup = GroupDTO.builder().id(4L).title("111").build();
        assertions.assertForGetListWithOneEntity(expectedGroup, "/groups/teacher/4");
    }

    @Test
    public void returnNotFoundIfGroupNotFoundedById() throws Exception {
        assertions.assertForGetWhenEntityNotFound(445, "/groups/{id}");
    }

    @Test
    public void getGroupWithStudentsById() throws Exception {
        mockMvc.perform(get("/groups/4/with-students").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(groupDTOWithID4L.getId()))
                .andExpect(jsonPath("$.title").value(groupDTOWithID4L.getTitle()))
                .andExpect(jsonPath("$.students", hasSize(1)))
                .andExpect(jsonPath("$.students[0]").value(studentDTOWithId4LForGroupWithId4L));
    }

    @Test
    public void returnNotFoundIfGroupWithStudentsNotFoundedById() throws Exception {
        assertions.assertForGetWhenEntityNotFound(44, "/groups/{id}/with-students");
    }

    @Test
    public void saveGroup() throws Exception {
        GroupDTO groupDTO = GroupDTO.builder()
                .title("sdsdsdsd")
                .build();
        assertions.assertForSave(groupDTO, GroupControllerTest::matchIgnoringId);
    }

    @Test
    public void throwFieldAlreadyExistsExceptionForTitleWhenSave() throws Exception {
        GroupDTO groupDTO = groupDTOWithID4L;
        groupDTO.setId(null);
        assertThatReturnedFieldAlreadyExistsException(post("/groups"), groupDTO);
    }

    @Test
    public void updateGroup() throws Exception {
        GroupForUpdateDTO groupForUpdateDTO = GroupForUpdateDTO.builder()
                .id(groupDTOWithID4L.getId())
                .title(groupDTOWithID4L.getTitle())
                .disable(true)
                .build();
        assertions.assertForUpdate(groupForUpdateDTO);
    }

    @Test
    public void throwFieldAlreadyExistsExceptionForTitleWhenUpdate() throws Exception {
        GroupDTO groupDTO = groupDTOWithID4L;
        groupDTO.setTitle(disabledGroupDTOWithID5L.getTitle());
        assertThatReturnedFieldAlreadyExistsException(put("/groups"), groupDTO);
    }

    @Test
    public void getAllDisabledGroups() throws Exception {
        assertions.assertForGetListWithOneEntity(disabledGroupDTOWithID5L, "/groups/disabled");
    }

    @Test
    @WithMockUser(username = "first@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "USER")
    public void returnForbiddenIfAuthenticatedUserRoleIsNotManager() throws Exception {
        mockMvc.perform(get("/groups/{id}", 4)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "sixth@mail.com", password = "$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.", roles = "USER")
    public void returnForbiddenIfAuthenticatedUserRoleIsNotTeacher() throws Exception {
        mockMvc.perform(get("/groups/teacher/{teacherId}", 4)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    public void deleteGroup() throws Exception {
        assertions.assertForDelete(5);
    }

    public Object[] parametersForTestValidationException() {
        String lengthErrorMessage = "Title must be between 2 and 35 characters long";
        return new Object[] {
                new Object[] { null , "Title cannot be empty"  },
                new Object[] { "T",  lengthErrorMessage },
                new Object[] { RandomStringUtils.random(36, "abc"), lengthErrorMessage }
        };
    }

    @Parameters
    @Test
    public void testValidationException(String incorrectTitle, String errorMessage) throws Exception {
        GroupDTO groupDTO = GroupDTO.builder()
                .title(incorrectTitle)
                .build();
        ApiValidationError error = new ApiValidationError(
                "Group",
                "title",
                incorrectTitle,
                errorMessage
        );
        assertions.assertForValidationErrorsOnSave(Collections.singletonList(error), groupDTO);
    }

    private static ResultMatcher matchIgnoringId(GroupDTO groupDTO) {
        return ResultMatcher.matchAll(jsonPath("$.title").value(groupDTO.getTitle()));
    }

    private <T> void assertThatReturnedFieldAlreadyExistsException(MockHttpServletRequestBuilder requestBuilder,
                                                                   T groupDTO) throws Exception {
        mockMvc.perform(requestBuilder.content(objectMapper.writeValueAsString(groupDTO))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.message")
                        .value("Group with provided title already exists"));
    }
}
