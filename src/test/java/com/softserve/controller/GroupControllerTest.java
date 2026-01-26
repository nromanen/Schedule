package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.assertions.CustomMockMvcAssertions;
import com.softserve.dto.GroupDTO;
import com.softserve.dto.StudentWithoutGroupDTO;
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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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
@Sql(value = "classpath:create-groups-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class GroupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private CustomMockMvcAssertions assertions;

    private GroupDTO groupDTOWithID4L;
    private GroupDTO disabledGroupDTOWithID5L;
    private GroupDTO groupDTOWithID6L;
    private StudentWithoutGroupDTO studentDTOWithId4LForGroupWithId4L;

    @BeforeEach
    void setup() {
        assertions = new CustomMockMvcAssertions(mockMvc, objectMapper, "/groups");

        groupDTOWithID4L = GroupDTO.builder()
                .id(4L)
                .disable(false)
                .title("444")
                .build();

        groupDTOWithID6L = GroupDTO.builder()
                .id(6L)
                .title("666")
                .disable(false)
                .build();

        disabledGroupDTOWithID5L = GroupDTO.builder()
                .id(5L)
                .disable(true)
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
    void getAllGroups() throws Exception {
        List<GroupDTO> expected = List.of(groupDTOWithID6L, groupDTOWithID4L);
        assertions.assertForGetList(expected, "/groups");
    }

    @Test
    void getGroupById() throws Exception {
        assertions.assertForGet(groupDTOWithID4L, "/groups/4");
    }

    @Test
    @WithMockUser(username = "second@mail.com", roles = "TEACHER")
    @Sql(value = "classpath:create-lessons-before.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void getByTeacherId() throws Exception {
        GroupDTO expectedGroup = GroupDTO.builder().id(4L).disable(false).title("111").build();
        assertions.assertForGetListWithOneEntity(expectedGroup, "/groups/teacher/4");
    }

    @Test
    void returnNotFoundIfGroupNotFoundedById() throws Exception {
        assertions.assertForGetWhenEntityNotFound(445, "/groups/{id}");
    }

    @Test
    void getGroupWithStudentsById() throws Exception {
        mockMvc.perform(get("/groups/4/with-students").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(groupDTOWithID4L.getId()))
                .andExpect(jsonPath("$.title").value(groupDTOWithID4L.getTitle()))
                .andExpect(jsonPath("$.students", hasSize(1)))
                .andExpect(jsonPath("$.students[0]").value(studentDTOWithId4LForGroupWithId4L));
    }

    @Test
    void returnNotFoundIfGroupWithStudentsNotFoundedById() throws Exception {
        assertions.assertForGetWhenEntityNotFound(44, "/groups/{id}/with-students");
    }

    @Test
    void saveGroup() throws Exception {
        GroupDTO groupDTO = GroupDTO.builder()
                .title("sdsdsdsd")
                .build();
        assertions.assertForSave(groupDTO, GroupControllerTest::matchIgnoringId);
    }

    @Test
    void createGroupAfterExistingGroup() throws Exception {
        String groupJSON = """
            {
              "afterId": 6,
              "disable": false,
              "title": "NewGroup"
            }
            """;

        mockMvc.perform(post("/groups/after")
                        .content(groupJSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("NewGroup"));

        // Expected order: 666, NewGroup, 444
        mockMvc.perform(get("/groups").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("666"))
                .andExpect(jsonPath("$[1].title").value("NewGroup"))
                .andExpect(jsonPath("$[2].title").value("444"));
    }

    @Test
    void createGroupAsFirstWhenNoAfterIdProvided() throws Exception {
        String groupJSON = """
            {
              "disable": false,
              "title": "FirstGroup"
            }
            """;

        mockMvc.perform(post("/groups/after")
                        .content(groupJSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("FirstGroup"));

        // Expected order: FirstGroup, 666, 444
        mockMvc.perform(get("/groups").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("FirstGroup"))
                .andExpect(jsonPath("$[1].title").value("666"))
                .andExpect(jsonPath("$[2].title").value("444"));
    }

    @Test
    void createGroupWithAfterIdZeroShouldBeFirst() throws Exception {
        String groupJSON = """
            {
              "afterId": 0,
              "disable": false,
              "title": "FirstGroup"
            }
            """;

        mockMvc.perform(post("/groups/after")
                        .content(groupJSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/groups").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("FirstGroup"))
                .andExpect(jsonPath("$[1].title").value("666"))
                .andExpect(jsonPath("$[2].title").value("444"));
    }

    @Test
    void createGroupAfterLastGroup() throws Exception {
        String groupJSON = """
            {
              "afterId": 4,
              "disable": false,
              "title": "LastGroup"
            }
            """;

        mockMvc.perform(post("/groups/after")
                        .content(groupJSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/groups").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("666"))
                .andExpect(jsonPath("$[1].title").value("444"))
                .andExpect(jsonPath("$[2].title").value("LastGroup"));
    }

    @Test
    void createGroupAfterNonExistentGroupShouldFail() throws Exception {
        String groupJSON = """
            {
              "afterId": 999,
              "disable": false,
              "title": "NewGroup"
            }
            """;

        mockMvc.perform(post("/groups/after")
                        .content(groupJSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateGroupOrderToFirst() throws Exception {
        String createJSON = """
            {
              "afterId": 6,
              "disable": false,
              "title": "MovableGroup"
            }
            """;

        MvcResult result = mockMvc.perform(post("/groups/after")
                        .content(createJSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andReturn();

        Long createdId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("id").asLong();

        String updateJSON = String.format("""
            {
              "id": %d,
              "disable": false,
              "title": "MovableGroup"
            }
            """, createdId);

        mockMvc.perform(put("/groups/after")
                        .content(updateJSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Expected order: MovableGroup, 666, 444
        mockMvc.perform(get("/groups").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("MovableGroup"))
                .andExpect(jsonPath("$[1].title").value("666"))
                .andExpect(jsonPath("$[2].title").value("444"));
    }

    @Test
    void updateGroupOrderAfterAnotherGroup() throws Exception {
        // Move group 666 (sort_order=1) after group 444 (sort_order=2)
        String updateJSON = """
            {
              "id": 6,
              "afterId": 4,
              "disable": false,
              "title": "666"
            }
            """;

        mockMvc.perform(put("/groups/after")
                        .content(updateJSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mockMvc.perform(get("/groups").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("444"))
                .andExpect(jsonPath("$[1].title").value("666"));
    }

    @Test
    void updateGroupOrderWithSameAfterIdAsIdShouldNotChange() throws Exception {
        String updateJSON = """
            {
              "id": 4,
              "afterId": 4,
              "disable": false,
              "title": "444"
            }
            """;

        mockMvc.perform(put("/groups/after")
                        .content(updateJSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mockMvc.perform(get("/groups").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("666"))
                .andExpect(jsonPath("$[1].title").value("444"));
    }

    @Test
    void updateNonExistentGroupShouldFail() throws Exception {
        String updateJSON = """
            {
              "id": 999,
              "afterId": 6,
              "disable": false,
              "title": "NonExistent"
            }
            """;

        mockMvc.perform(put("/groups/after")
                        .content(updateJSON)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void throwFieldAlreadyExistsExceptionForTitleWhenSave() throws Exception {
        GroupDTO groupDTO = GroupDTO.builder()
                .title(groupDTOWithID4L.getTitle())
                .build();
        assertThatReturnedFieldAlreadyExistsException(post("/groups"), groupDTO);
    }

    @Test
    void updateGroup() throws Exception {
        GroupDTO groupDTO = GroupDTO.builder()
                .id(groupDTOWithID4L.getId())
                .title(groupDTOWithID4L.getTitle())
                .disable(true)
                .build();
        assertions.assertForUpdate(groupDTO);
    }

    @Test
    void throwFieldAlreadyExistsExceptionForTitleWhenUpdate() throws Exception {
        GroupDTO groupDTO = GroupDTO.builder()
                .id(groupDTOWithID4L.getId())
                .title(disabledGroupDTOWithID5L.getTitle())
                .build();
        assertThatReturnedFieldAlreadyExistsException(put("/groups"), groupDTO);
    }

    @Test
    void getAllDisabledGroups() throws Exception {
        assertions.assertForGetListWithOneEntity(disabledGroupDTOWithID5L, "/groups/disabled");
    }

    @Test
    @WithMockUser(username = "first@mail.com", roles = "USER")
    void returnForbiddenIfAuthenticatedUserRoleIsNotManager() throws Exception {
        mockMvc.perform(get("/groups/{id}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "sixth@mail.com", roles = "USER")
    void returnForbiddenIfAuthenticatedUserRoleIsNotTeacher() throws Exception {
        mockMvc.perform(get("/groups/teacher/{teacherId}", 4).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteGroup() throws Exception {
        assertions.assertForDelete(5);
    }

    static Stream<Object[]> validationExceptionProvider() {
        String lengthErrorMessage = "Title must be between 2 and 35 characters long";
        return Stream.of(
                new Object[]{null, "Title cannot be empty"},
                new Object[]{"T", lengthErrorMessage},
                new Object[]{RandomStringUtils.random(36, "abc"), lengthErrorMessage}
        );
    }

    @ParameterizedTest
    @MethodSource("validationExceptionProvider")
    void testValidationException(String incorrectTitle, String errorMessage) throws Exception {
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
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.message").value("Group with provided title already exists"));
    }
}
