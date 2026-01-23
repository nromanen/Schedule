package com.softserve.service;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import com.softserve.entity.Period;
import com.softserve.entity.Teacher;
import com.softserve.entity.User;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.mapper.TeacherMapper;
import com.softserve.repository.TeacherRepository;
import com.softserve.service.impl.TeacherServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.softserve.entity.enums.Role.ROLE_TEACHER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Tag("unit")
@ExtendWith(MockitoExtension.class)
class TeacherServiceTest {
    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private TeacherMapper teacherMapper;

    @Mock
    private UserService userService;

    @InjectMocks
    private TeacherServiceImpl teacherService;

    private Teacher teacherWithoutId;

    private Teacher teacherWithId1LAndWithUserId1;

    private Teacher teacherWithId1LAndWithoutUser;

    private TeacherDTO teacherDtoWithoutId;

    private TeacherForUpdateDTO teacherForUpdateDTOWithId1L;

    @BeforeEach
    void setUp() {
        String name = "Name1";
        String surname = "Surname1";
        String patronymic = "Patronymic1";
        String position = "Position1";
        String email = "teacher@gmail.com";

        teacherWithoutId = new Teacher();
        teacherWithoutId.setName(name);
        teacherWithoutId.setDisable(false);
        teacherWithoutId.setSurname(surname);
        teacherWithoutId.setPatronymic(patronymic);
        teacherWithoutId.setPosition(position);
        teacherWithoutId.setUserId(null);

        teacherWithId1LAndWithUserId1 = new Teacher();
        teacherWithId1LAndWithUserId1.setId(1L);
        teacherWithId1LAndWithUserId1.setDisable(false);
        teacherWithId1LAndWithUserId1.setName(name);
        teacherWithId1LAndWithUserId1.setSurname(surname);
        teacherWithId1LAndWithUserId1.setPatronymic(patronymic);
        teacherWithId1LAndWithUserId1.setPosition(position);
        teacherWithId1LAndWithUserId1.setUserId(1L);

        teacherWithId1LAndWithoutUser = new Teacher();
        teacherWithId1LAndWithoutUser.setId(1L);
        teacherWithId1LAndWithoutUser.setDisable(false);
        teacherWithId1LAndWithoutUser.setName(name);
        teacherWithId1LAndWithoutUser.setSurname(surname);
        teacherWithId1LAndWithoutUser.setPatronymic(patronymic);
        teacherWithId1LAndWithoutUser.setPosition(position);
        teacherWithId1LAndWithoutUser.setUserId(null);

        teacherDtoWithoutId = new TeacherDTO();
        teacherDtoWithoutId.setName(name);
        teacherDtoWithoutId.setDisable(false);
        teacherDtoWithoutId.setSurname(surname);
        teacherDtoWithoutId.setPatronymic(patronymic);
        teacherDtoWithoutId.setPosition(position);
        teacherDtoWithoutId.setEmail(email);

        teacherForUpdateDTOWithId1L = new TeacherForUpdateDTO();
        teacherForUpdateDTOWithId1L.setId(1L);
        teacherForUpdateDTOWithId1L.setDisable(false);
        teacherForUpdateDTOWithId1L.setName(name);
        teacherForUpdateDTOWithId1L.setSurname(surname);
        teacherForUpdateDTOWithId1L.setPatronymic(patronymic);
        teacherForUpdateDTOWithId1L.setPosition(position);
        teacherForUpdateDTOWithId1L.setEmail(email);
    }

    @Test
    void getAll() {
        List<Teacher> expectedTeachers = Collections.singletonList(teacherWithId1LAndWithUserId1);
        when(teacherRepository.getAll()).thenReturn(expectedTeachers);

        List<Teacher> actualTeachers = teacherService.getAll();

        assertThat(actualTeachers).hasSameSizeAs(expectedTeachers).hasSameElementsAs(expectedTeachers);
        verify(teacherRepository, times(1)).getAll();
    }

    @Test
    void delete() {
        Teacher expectedTeacher = teacherWithId1LAndWithUserId1;
        expectedTeacher.setUserId(null);
        when(teacherRepository.delete(argThat(t -> deepEqualsForTeachers(t, expectedTeacher))))
                .thenReturn(expectedTeacher);

        Teacher actualTeacher = teacherService.delete(expectedTeacher);

        assertThat(actualTeacher).usingRecursiveComparison().isEqualTo(expectedTeacher);
        verify(teacherRepository, times(1)).delete(argThat(t -> deepEqualsForTeachers(t, expectedTeacher)));
    }

    @Test
    void getDisabled() {
        List<Teacher> expectedTeachers = Collections.singletonList(teacherWithId1LAndWithUserId1);
        when(teacherRepository.getDisabled()).thenReturn(expectedTeachers);

        List<Teacher> actualTeachers = teacherService.getDisabled();

        assertThat(actualTeachers).hasSameSizeAs(expectedTeachers).hasSameElementsAs(expectedTeachers);
        verify(teacherRepository, times(1)).getDisabled();
    }

    @Test
    void getTeachersWithoutUsers() {
        List<Teacher> expectedTeachers = Collections.singletonList(teacherWithId1LAndWithoutUser);
        when(teacherRepository.getAllTeacherWithoutUser()).thenReturn(expectedTeachers);

        List<Teacher> actualTeachers = teacherService.getAllTeacherWithoutUser();

        assertThat(actualTeachers).hasSameSizeAs(expectedTeachers).hasSameElementsAs(expectedTeachers);
        verify(teacherRepository, times(1)).getAllTeacherWithoutUser();
    }

    @ParameterizedTest
    @NullAndEmptySource
    void saveDTOIfEmailNotExist(String teacherEmail) {
        TeacherDTO teacherDTO = teacherDtoWithoutId;
        teacherDTO.setEmail(teacherEmail);
        Teacher expectedTeacher = teacherWithId1LAndWithoutUser;

        when(teacherMapper.teacherDTOToTeacher(teacherDTO)).thenReturn(expectedTeacher);
        when(teacherRepository.save(argThat(u -> deepEqualsForTeachersExcludingId(u, expectedTeacher))))
                .thenReturn(expectedTeacher);

        Teacher actualTeacher = teacherService.save(teacherDTO);

        assertThat(actualTeacher).usingRecursiveComparison().isEqualTo(expectedTeacher);
        verify(teacherRepository, times(1)).save(argThat(u -> deepEqualsForTeachersExcludingId(u, expectedTeacher)));
        verify(teacherMapper, times(1)).teacherDTOToTeacher(teacherDTO);
    }

    @Test
    void saveDTOIfEmailExists() {
        TeacherDTO teacherDTO = teacherDtoWithoutId;
        Teacher teacherAfterMapper = teacherWithoutId;
        Teacher expectedTeacher = teacherWithId1LAndWithUserId1;

        User userForTeacher = new User();
        userForTeacher.setId(1L);

        when(teacherMapper.teacherDTOToTeacher(teacherDTO)).thenReturn(teacherAfterMapper);
        when(userService.automaticRegistration(teacherDTO.getEmail(), ROLE_TEACHER)).thenReturn(userForTeacher);
        when(teacherRepository.save(argThat(u -> deepEqualsForTeachersExcludingId(u, expectedTeacher))))
                .thenReturn(expectedTeacher);

        Teacher actualTeacher = teacherService.save(teacherDTO);

        assertThat(actualTeacher).usingRecursiveComparison().isEqualTo(expectedTeacher);
        verify(teacherRepository, times(1)).save(argThat(u -> deepEqualsForTeachersExcludingId(u, expectedTeacher)));
        verify(teacherMapper, times(1)).teacherDTOToTeacher(teacherDTO);
        verify(userService, times(1)).automaticRegistration(teacherDTO.getEmail(), ROLE_TEACHER);
    }

    @ParameterizedTest
    @NullAndEmptySource
    void updateDTOIfEmailNotExist(String teacherEmail) {
        TeacherForUpdateDTO teacherDTO = teacherForUpdateDTOWithId1L;
        teacherDTO.setEmail(teacherEmail);
        Teacher expectedTeacher = teacherWithId1LAndWithUserId1;

        when(teacherMapper.teacherForUpdateDTOToTeacher(teacherDTO)).thenReturn(expectedTeacher);
        when(teacherRepository.update(argThat(t -> deepEqualsForTeachers(t, expectedTeacher))))
                .thenReturn(expectedTeacher);

        Teacher actualTeacher = teacherService.update(teacherDTO);

        assertThat(actualTeacher)
                .usingRecursiveComparison()
                .isEqualTo(expectedTeacher);
        verify(teacherRepository, times(1)).update(argThat(t -> deepEqualsForTeachers(t, expectedTeacher)));
        verify(teacherMapper, times(1)).teacherForUpdateDTOToTeacher(teacherDTO);
    }

    @Test
    void updateDTOIfEmailAndUserIdExist() {
        TeacherForUpdateDTO teacherDTO = teacherForUpdateDTOWithId1L;
        Teacher expectedTeacher = teacherWithId1LAndWithUserId1;

        User userForTeacher = new User();
        userForTeacher.setId(1L);
        userForTeacher.setEmail(teacherDTO.getEmail());

        when(teacherMapper.teacherForUpdateDTOToTeacher(teacherDTO)).thenReturn(expectedTeacher);
        when(teacherRepository.update(argThat(t -> deepEqualsForTeachers(t, expectedTeacher))))
                .thenReturn(expectedTeacher);
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(expectedTeacher));
        when(userService.getById(1L)).thenReturn(userForTeacher);
        when(userService.update(argThat(u -> equalsForUsersByIdAndEmail(u, userForTeacher))))
                .thenReturn(userForTeacher);

        Teacher actualTeacher = teacherService.update(teacherDTO);

        assertThat(actualTeacher).usingRecursiveComparison().isEqualTo(expectedTeacher);
        verify(teacherRepository, times(1)).update(argThat(t -> deepEqualsForTeachers(t, expectedTeacher)));
        verify(teacherMapper, times(1)).teacherForUpdateDTOToTeacher(teacherDTO);
        verify(teacherRepository, times(1)).findById(1L);
        verify(userService, times(1)).getById(1L);
        verify(userService, times(1)).update(argThat(u -> equalsForUsersByIdAndEmail(u, userForTeacher)));
    }

    @Test
    void updateDTOIfEmailExistsAndUserIdNotExist() {
        TeacherForUpdateDTO teacherDTO = teacherForUpdateDTOWithId1L;
        Teacher teacherAfterMapper = teacherWithId1LAndWithoutUser;
        Teacher expectedTeacher = teacherWithId1LAndWithUserId1;

        User userForTeacher = new User();
        userForTeacher.setId(1L);

        when(teacherMapper.teacherForUpdateDTOToTeacher(teacherDTO)).thenReturn(teacherAfterMapper);
        when(userService.automaticRegistration(teacherDTO.getEmail(), ROLE_TEACHER)).thenReturn(userForTeacher);
        when(teacherRepository.update(argThat(u -> deepEqualsForTeachers(u, expectedTeacher))))
                .thenReturn(expectedTeacher);
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacherAfterMapper));

        Teacher actualTeacher = teacherService.update(teacherDTO);

        assertThat(actualTeacher).usingRecursiveComparison().isEqualTo(expectedTeacher);
        verify(teacherRepository, times(1)).update(argThat(t -> deepEqualsForTeachers(t, expectedTeacher)));
        verify(teacherMapper, times(1)).teacherForUpdateDTOToTeacher(teacherDTO);
        verify(userService, times(1)).automaticRegistration(teacherDTO.getEmail(), ROLE_TEACHER);
        verify(teacherRepository, times(1)).findById(1L);
    }

    @Test
    void getById() {
        Teacher expectedTeacher = teacherWithId1LAndWithUserId1;
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(expectedTeacher));

        Teacher actualTeacher = teacherService.getById(1L);

        assertThat(actualTeacher).usingRecursiveComparison().isEqualTo(expectedTeacher);
        verify(teacherRepository, times(1)).findById(1L);
    }

    @Test
    void throwEntityNotFoundExceptionIfTeacherNotFoundedById() {
        when(teacherRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> teacherService.getById(1L));
        verify(teacherRepository, times(1)).findById(1L);
    }

    @Test
    void getTeacherByUserId() {
        Teacher teacher = teacherWithId1LAndWithUserId1;
        when(teacherRepository.findByUserId(1L)).thenReturn(Optional.of(teacher));

        Teacher result = teacherService.findByUserId(1L);

        assertNotNull(result);
        assertEquals(teacher, result);
        verify(teacherRepository, times(1)).findByUserId(1L);
    }

    @Test
    void throwEntityNotFoundExceptionIfTeacherNotFoundedByUserId() {
        when(teacherRepository.findByUserId(1L)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> teacherService.findByUserId(1L));
        verify(teacherRepository, times(1)).findByUserId(1L);
    }

    @Test
    void saveTeacher() {
        Teacher teacher = teacherWithId1LAndWithoutUser;

        Period period = new Period();
        period.setName("1 para");
        period.setId(1L);
        period.setStartTime(LocalTime.parse("10:00:00"));
        period.setEndTime(LocalTime.parse("11:00:00"));


        when(teacherRepository.save(teacher)).thenReturn(teacher);

        Teacher result = teacherService.save(teacher);

        assertThat(result).usingRecursiveComparison().isEqualTo(teacher);
        verify(teacherRepository, times(1)).save(teacher);
    }

    private boolean equalsForUsersByIdAndEmail(User user1, User user2) {
        return Objects.equals(user1.getId(), user2.getId())
                && Objects.equals(user1.getEmail(), user2.getEmail());
    }

    private boolean deepEqualsForTeachersExcludingId(Teacher teacher1, Teacher teacher2) {
        return Objects.equals(teacher1.getName(), teacher2.getName())
                && Objects.equals(teacher1.getSurname(), teacher2.getSurname())
                && Objects.equals(teacher1.getPatronymic(), teacher2.getPatronymic())
                && Objects.equals(teacher1.getPosition(), teacher2.getPosition())
                && Objects.equals(teacher1.getUserId(), teacher2.getUserId());
    }

    private boolean deepEqualsForTeachers(Teacher teacher1, Teacher teacher2) {
        return Objects.equals(teacher1.getId(), teacher2.getId())
                && deepEqualsForTeachersExcludingId(teacher1, teacher2);
    }
}
