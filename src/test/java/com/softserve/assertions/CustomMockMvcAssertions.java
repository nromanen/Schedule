package com.softserve.assertions;

import com.softserve.exception.apierror.ApiError;
import com.softserve.exception.apierror.ApiValidationError;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Collections;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class CustomMockMvcAssertions {
    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;
    private final String defaultUrl;
    private final String defaultUrlWithId;

    public CustomMockMvcAssertions(MockMvc mockMvc, ObjectMapper objectMapper, String defaultUrl) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
        this.defaultUrl = defaultUrl;
        this.defaultUrlWithId = defaultUrl + "/{id}";
    }

    public <T> void assertThatReceivedByIdEntityIsEqualTo(T expected, int id) throws Exception {
        assertThatReceivedByIdEntityIsEqualTo(expected, id, defaultUrlWithId);
    }

    public <T> void assertThatReceivedByIdEntityIsEqualTo(T expected, int id, String url) throws Exception {
        MockHttpServletRequestBuilder getByIdRequest = get(url, id).contentType(MediaType.APPLICATION_JSON);
        performRequestWithReturnedStatusOkAndExpectedObject(getByIdRequest, expected);
    }

    public <T> void assertThatReturnedByGetRequestListHas(T expected) throws Exception {
        assertThatReturnedByGetRequestListHas(expected, defaultUrl);
    }

    public <T> void assertThatReturnedByGetRequestListHas(T expected, String url) throws Exception {
        assertThatReturnedByGetRequestListHas(Collections.singletonList(expected), url);
    }

    public <T> void assertThatReturnedByGetRequestListHas(List<T> expected) throws Exception {
        assertThatReturnedByGetRequestListHas(expected, defaultUrl);
    }

    public <T> void assertThatReturnedByGetRequestListHas(List<T> expected, String url) throws Exception {
        mockMvc.perform(get(url).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$", hasSize(expected.size())))
                .andExpect(content().string(objectMapper.writeValueAsString(expected)));
    }

    public <T> void assertThatReturnedByGetRequestEntityIsEqualTo(T expected, String url) throws Exception {
        MockHttpServletRequestBuilder getRequest = get(url).contentType(MediaType.APPLICATION_JSON);
        performRequestWithReturnedStatusOkAndExpectedObject(getRequest, expected);
    }

    public <T> void assertThatGetByIdRequestReturnedNotFound(int id) throws Exception {
        assertThatGetByIdRequestReturnedNotFound(id, defaultUrlWithId);
    }

    public <T> void assertThatGetByIdRequestReturnedNotFound(int id, String url) throws Exception {
        mockMvc.perform(get(url, id).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    public <T> void assertThatUpdatedEntityIsEqualTo(T expected) throws Exception {
        assertThatUpdatedEntityIsEqualTo(expected, defaultUrl);
    }

    public <T> void assertThatUpdatedEntityIsEqualTo(T expected, String url) throws Exception {
        MockHttpServletRequestBuilder putRequest = put(url).content(objectMapper.writeValueAsString(expected))
                .contentType(MediaType.APPLICATION_JSON);
        performRequestWithReturnedStatusOkAndExpectedObject(putRequest, expected);
    }

    public <T> void assertThatSavedEntityIsEqualTo(T expected,
                                                   ResultMatcherIgnoringId<T> matcher) throws Exception {
        assertThatSavedEntityIsEqualTo(expected, matcher, defaultUrl);
    }

    public <T> void assertThatSavedEntityIsEqualTo(T expected,
                                                   ResultMatcherIgnoringId<T> matcher,
                                                   String url) throws Exception {
        mockMvc.perform(post(url).content(objectMapper.writeValueAsString(expected))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(content().contentType("application/json"))
                .andExpect(matcher.apply(expected));
    }

    public <T> void assertThatDeleteRequestReturnedOk(int id) throws Exception {
        assertThatDeleteRequestReturnedOk(defaultUrlWithId, id);
    }

    public <T> void assertThatDeleteRequestReturnedOk(String url, int id) throws Exception {
        mockMvc.perform(delete(url, id).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    public <T> void assertThatReturnedBySaveRequestValidationErrorListHas(List<ApiValidationError> errorList,
                                                                          T incorrectEntity) throws Exception {
        assertThatReturnedBySaveRequestValidationErrorListHas(errorList, incorrectEntity, defaultUrl);
    }

    public <T> void assertThatReturnedBySaveRequestValidationErrorListHas(List<ApiValidationError> errorList,
                                                                          T incorrectEntity,
                                                                          String url) throws Exception {
        MvcResult result = getResultOfBadPostRequest(incorrectEntity, url);
        ApiError apiError = objectMapper.readValue(result.getResponse().getContentAsString(), ApiError.class);
        assertThat(apiError.getSubErrors()).hasSameSizeAs(errorList).hasSameElementsAs(errorList);
    }

    private <T> void performRequestWithReturnedStatusOkAndExpectedObject(MockHttpServletRequestBuilder requestBuilder,
                                                                         T expected) throws Exception {
        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(content().string(objectMapper.writeValueAsString(expected)));
    }

    private <T> MvcResult getResultOfBadPostRequest(T incorrectEntity, String url) throws Exception {
        return mockMvc.perform(post(url).content(objectMapper.writeValueAsString(incorrectEntity))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType("application/json"))
                .andReturn();
    }
}
