package com.softserve.mapper;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import com.softserve.entity.Teacher;
import com.softserve.entity.User;
import com.softserve.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@Tag("unit")
@ExtendWith(MockitoExtension.class)
class TeacherMapperTest {
    @Mock
    private UserService userService;

    @InjectMocks
    private TeacherMapperImpl teacherMapper;

    private Teacher teacherOnlyWithUserId1;

    private User userOnlyWithEmail;

    @BeforeEach
    void setUp() {
        teacherOnlyWithUserId1 = new Teacher();
        teacherOnlyWithUserId1.setUserId(1L);

        userOnlyWithEmail = new User();
        userOnlyWithEmail.setEmail("teacher@gmail.com");
    }

    @Test
    void testUserIdToEmailInTeacherToTeacherDTOIfUserIdExists() {
        when(userService.getById(1L)).thenReturn(userOnlyWithEmail);
        TeacherDTO actualTeacherDTO = teacherMapper.teacherToTeacherDTO(teacherOnlyWithUserId1);
        assertThat(actualTeacherDTO.getEmail()).isEqualTo(userOnlyWithEmail.getEmail());
        verify(userService).getById(1L);
    }

    @Test
    void testUserIdToEmailInTeacherToTeacherForUpdateDTOIfUserIdExists() {
        when(userService.getById(1L)).thenReturn(userOnlyWithEmail);
        TeacherForUpdateDTO actualTeacherForUpdateDTO
                = teacherMapper.teacherToTeacherForUpdateDTO(teacherOnlyWithUserId1);
        assertThat(actualTeacherForUpdateDTO.getEmail()).isEqualTo(userOnlyWithEmail.getEmail());
        verify(userService).getById(1L);
    }

    @Test
    void testUserIdToEmailInTeacherToTeacherDTOIfUserIdNotExist() {
        Teacher teacher = new Teacher();
        TeacherDTO teacherDTO = teacherMapper.teacherToTeacherDTO(teacher);
        assertThat(teacherDTO.getEmail()).isNull();
    }

    @Test
    void testUserIdToEmailInTeacherToTeacherForUpdateDTOIfUserIdNotExist() {
        Teacher teacher = new Teacher();
        TeacherForUpdateDTO teacherForUpdateDTO = teacherMapper.teacherToTeacherForUpdateDTO(teacher);
        assertThat(teacherForUpdateDTO.getEmail()).isNull();
    }

    @Test
    void teacherDTOToTeacherForSiteTest() {
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setId(1L);
        teacherDTO.setSurname("Harrison");
        teacherDTO.setName("Ford");
        teacherDTO.setPatronymic("Edward");
        teacherDTO.setPosition("Doctor of Science");
        String expectedTeacherForSite = "Doctor of Science Harrison F. E.";

        String result = TeacherMapper.teacherDTOToTeacherForSite(teacherDTO);

        assertEquals(expectedTeacherForSite, result);
    }

}
