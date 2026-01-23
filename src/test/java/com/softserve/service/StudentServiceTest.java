package com.softserve.service;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.StudentDTO;
import com.softserve.dto.StudentImportDTO;
import com.softserve.dto.enums.ImportSaveStatus;
import com.softserve.entity.Group;
import com.softserve.entity.Student;
import com.softserve.entity.User;
import com.softserve.entity.enums.Role;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.exception.FieldNullException;
import com.softserve.mapper.GroupMapper;
import com.softserve.mapper.StudentMapper;
import com.softserve.repository.StudentRepository;
import com.softserve.service.impl.StudentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@Tag("unit")
@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    private static final String TEST_STUDENTS_FILE_PATH = "src/test/resources/test_students.csv";

    @InjectMocks
    private StudentServiceImpl studentService;

    @Mock
    private StudentRepository studentRepository;
    @Mock
    private UserService userService;
    @Mock
    private GroupService groupService;
    @Mock
    private StudentMapper studentMapper;
    @Mock
    private GroupMapper groupMapper;

    private Student studentWithId1L;
    private StudentDTO studentDTOWithId1L;
    private StudentDTO studentDTOWithId2L;

    @BeforeEach
    void setUp() {

        User userWithId1L = new User();
        userWithId1L.setId(1L);
        userWithId1L.setEmail("userWithId1L@test.com");
        userWithId1L.setPassword("12345@testAa");
        userWithId1L.setRole(Role.ROLE_STUDENT);

        studentWithId1L = new Student();
        studentWithId1L.setName("Name");
        studentWithId1L.setSurname("Surname");
        studentWithId1L.setPatronymic("Patronymic");
        studentWithId1L.setUser(userWithId1L);

        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(3L);
        groupDTO.setTitle("Test");

        studentDTOWithId1L = new StudentDTO();
        studentDTOWithId1L.setId(null);
        studentDTOWithId1L.setName("Name");
        studentDTOWithId1L.setSurname("Surname");
        studentDTOWithId1L.setPatronymic("Patronymic");
        studentDTOWithId1L.setEmail("aware.123db@gmail.com");
        studentDTOWithId1L.setGroup(groupDTO);

        studentDTOWithId2L = new StudentDTO();
        studentDTOWithId2L.setId(null);
        studentDTOWithId2L.setName("Name");
        studentDTOWithId2L.setSurname("Surname");
        studentDTOWithId2L.setPatronymic("Patronymic");
        studentDTOWithId2L.setEmail(null);

    }

    @Test
    void getAll() {
        List<Student> expected = singletonList(studentWithId1L);
        when(studentRepository.getAll()).thenReturn(expected);

        List<Student> actual = studentService.getAll();

        assertThat(actual).hasSameSizeAs(expected).hasSameElementsAs(expected);
        verify(studentRepository).getAll();
    }

    @Test
    void getById() {
        Student expected = studentWithId1L;
        when(studentRepository.findById(expected.getId())).thenReturn(Optional.of(expected));

        Student actual = studentService.getById(expected.getId());

        assertThat(actual).usingRecursiveComparison().isEqualTo(expected);
        verify(studentRepository).findById(expected.getId());
    }

    @Test
    void save() {
        Student expected = studentWithId1L;
        when(studentRepository.save(expected)).thenReturn(expected);

        Student actual = studentService.save(expected);

        assertThat(actual).usingRecursiveComparison().isEqualTo(expected);
        verify(studentRepository).save(expected);
    }

    @Test
    void update() {
        Student expected = studentWithId1L;
        when(studentRepository.update(expected)).thenReturn(expected);

        Student actual = studentService.update(expected);

        assertThat(actual).usingRecursiveComparison().isEqualTo(expected);
        verify(studentRepository).update(expected);
    }

    @Test
    void delete() {
        Student expected = studentWithId1L;
        when(studentRepository.delete(expected)).thenReturn(expected);

        Student actual = studentService.delete(expected);

        assertThat(actual).usingRecursiveComparison().isEqualTo(expected);
        verify(studentRepository).delete(expected);
    }

    @Test
    void throwEntityNotFoundExceptionWhenGetById() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> studentService.getById(1L));
        verify(studentRepository).findById(1L);
    }

    @Test
    void throwFieldAlreadyExistsExceptionWhenSave() {
        User user = new User();
        user.setId(16L);
        user.setEmail("aware.123db@gmail.com");
        user.setPassword("Pass1233!");
        user.setRole(Role.ROLE_STUDENT);

        Group group = new Group();
        group.setId(1L);
        group.setTitle("First Title");

        Student student = new Student();
        student.setId(null);
        student.setName("Name");
        student.setName("Name");
        student.setSurname("Surname");
        student.setPatronymic("Patronymic");
        student.setUser(user);
        student.setGroup(group);

        StudentDTO expected = studentDTOWithId1L;
        when(studentMapper.studentDTOToStudent(expected)).thenReturn(student);
        when(userService.findSocialUser(expected.getEmail())).thenReturn(Optional.of(user));
        when(studentRepository.isEmailInUse(anyString())).thenReturn(true);

        assertThrows(FieldAlreadyExistsException.class, () -> studentService.save(expected));
    }

    @Test
    void throwFieldNullExceptionWhenSave() {
        Student student = new Student();
        student.setId(null);
        student.setName("Name");
        student.setName("Name");
        student.setSurname("Surname");
        student.setPatronymic("Patronymic");
        student.setUser(null);

        StudentDTO expected = studentDTOWithId2L;
        when(studentMapper.studentDTOToStudent(expected)).thenReturn(student);
        assertThrows(FieldNullException.class, () -> studentService.save(expected));
    }

    @Test
    void throwFieldNullExceptionWhenUpdate() {
        Student student = new Student();
        student.setId(null);
        student.setName("Name");
        student.setName("Name");
        student.setSurname("Surname");
        student.setPatronymic("Patronymic");
        student.setUser(null);

        StudentDTO expected = studentDTOWithId2L;
        when(studentMapper.studentDTOToStudent(expected)).thenReturn(student);

        assertThrows(FieldNullException.class, () -> studentService.update(expected));
    }

    @Test
    void throwEntityNotFoundExceptionWhenUpdate() {
        User user = new User();
        user.setId(16L);
        user.setEmail("aware.123db@gmail.com");
        user.setPassword("Pass1233!");
        user.setRole(Role.ROLE_STUDENT);

        Group group = new Group();
        group.setId(1L);
        group.setTitle("First Title");

        Student student = new Student();
        student.setId(null);
        student.setName("Name");
        student.setName("Name");
        student.setSurname("Surname");
        student.setPatronymic("Patronymic");
        student.setUser(user);
        student.setGroup(group);

        StudentDTO expected = studentDTOWithId1L;
        when(studentMapper.studentDTOToStudent(expected)).thenReturn(student);
        when(studentRepository.isIdPresent(student.getId())).thenReturn(false);
        assertThrows(EntityNotFoundException.class, () -> studentService.update(expected));
    }

    static Stream<Arguments> parametersToTestImport() throws IOException {
        byte[] fileContent = Files.readAllBytes(Path.of(TEST_STUDENTS_FILE_PATH));

        MockMultipartFile multipartFileCsv = new MockMultipartFile("file",
                "students.csv",
                "text/csv",
                fileContent);

        MockMultipartFile multipartFileTxt = new MockMultipartFile("file",
                "students.txt",
                "text/plain",
                fileContent);

        return Stream.of(
                Arguments.of(multipartFileCsv),
                Arguments.of(multipartFileTxt)
        );
    }

    @ParameterizedTest
    @MethodSource("parametersToTestImport")
    void importStudentsFromFile(MockMultipartFile multipartFile) {

        User userWithId1L = new User();
        userWithId1L.setId(1L);
        userWithId1L.setEmail("romaniuk@gmail.com");
        userWithId1L.setPassword("12345@testAa");
        userWithId1L.setRole(Role.ROLE_STUDENT);

        User userWithId2L = new User();
        userWithId2L.setId(2L);
        userWithId2L.setEmail("hanushchak@bigmir.net");
        userWithId2L.setPassword("12345@testAa");
        userWithId2L.setRole(Role.ROLE_STUDENT);

        Group group = new Group();
        group.setId(10L);
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(10L);

        List<StudentImportDTO> expectedStudents = new ArrayList<>();

        StudentImportDTO studentImportDTO1 = new StudentImportDTO();
        studentImportDTO1.setName("Hanna");
        studentImportDTO1.setSurname("Romaniuk");
        studentImportDTO1.setPatronymic("Stepanivna");
        studentImportDTO1.setEmail("romaniuk@gmail.com");

        StudentImportDTO studentImportDTO1Mapped = new StudentImportDTO();
        studentImportDTO1Mapped.setId(1L);
        studentImportDTO1Mapped.setName("Hanna");
        studentImportDTO1Mapped.setSurname("Romaniuk");
        studentImportDTO1Mapped.setPatronymic("Stepanivna");
        studentImportDTO1Mapped.setEmail("romaniuk@gmail.com");
        studentImportDTO1Mapped.setGroupDTO(groupDTO);

        StudentImportDTO studentImportDTO2 = new StudentImportDTO();
        studentImportDTO2.setId(null);
        studentImportDTO2.setName("Oleksandr");
        studentImportDTO2.setSurname("Boichuk");
        studentImportDTO2.setPatronymic("Ivanovych");
        studentImportDTO2.setEmail("");
        studentImportDTO2.setGroupDTO(null);
        studentImportDTO2.setImportSaveStatus(ImportSaveStatus.VALIDATION_ERROR);

        StudentImportDTO studentImportDTO3 = new StudentImportDTO();
        studentImportDTO3.setName("Viktor");
        studentImportDTO3.setSurname("Hanushchak");
        studentImportDTO3.setPatronymic("Mykolaiovych");
        studentImportDTO3.setEmail("hanushchak@bigmir.net");

        StudentImportDTO studentImportDTO3Mapped = new StudentImportDTO();
        studentImportDTO3Mapped.setId(1L);
        studentImportDTO3Mapped.setName("Viktor");
        studentImportDTO3Mapped.setSurname("Hanushchak");
        studentImportDTO3Mapped.setPatronymic("Mykolaiovych");
        studentImportDTO3Mapped.setEmail("hanushchak@bigmir.net");
        studentImportDTO3Mapped.setGroupDTO(groupDTO);

        expectedStudents.add(studentImportDTO1);
        expectedStudents.add(studentImportDTO2);
        expectedStudents.add(studentImportDTO3);

        Student student1 = new Student();
        student1.setName("Hanna");
        student1.setSurname("Romaniuk");
        student1.setPatronymic("Stepanivna");
        StudentDTO studentDTO1 = new StudentDTO();
        studentDTO1.setName("Hanna");
        studentDTO1.setSurname("Romaniuk");
        studentDTO1.setPatronymic("Stepanivna");
        studentDTO1.setEmail("romaniuk@gmail.com");
        Student student1registered = new Student();
        student1registered.setName("Hanna");
        student1registered.setSurname("Romaniuk");
        student1registered.setPatronymic("Stepanivna");
        student1registered.setUser(userWithId1L);
        student1registered.setGroup(group);

        Student student3 = new Student();
        student3.setName("Viktor");
        student3.setSurname("Hanushchak");
        student3.setPatronymic("Mykolaiovych");
        StudentDTO studentDTO3 = new StudentDTO();
        studentDTO3.setName("Viktor");
        studentDTO3.setSurname("Hanushchak");
        studentDTO3.setPatronymic("Mykolaiovych");
        studentDTO3.setEmail("hanushchak@bigmir.net");
        Student student3registered = new Student();
        student3registered.setName("Viktor");
        student3registered.setSurname("Hanushchak");
        student3registered.setPatronymic("Mykolaiovych");
        student3registered.setUser(userWithId2L);
        student3registered.setGroup(group);

        when(studentMapper.studentImportDTOToStudent(studentImportDTO1)).thenReturn(student1);
        when(studentMapper.studentImportDTOToStudent(studentImportDTO3)).thenReturn(student3);

        when(studentMapper.studentDTOToStudent(studentDTO1)).thenReturn(student1);
        when(userService.automaticRegistration(studentDTO1.getEmail(), Role.ROLE_STUDENT)).thenReturn(userWithId1L);
        when(studentMapper.studentDTOToStudent(studentDTO3)).thenReturn(student3);
        when(userService.automaticRegistration(studentDTO3.getEmail(), Role.ROLE_STUDENT)).thenReturn(userWithId2L);

        when(studentService.save(studentDTO1)).thenReturn(student1);
        when(studentService.save(studentDTO3)).thenReturn(student3);

        when(groupService.getById(anyLong())).thenReturn(groupDTO);
        when(groupMapper.groupDTOToGroup(groupDTO)).thenReturn(group);

        when(studentMapper.studentImportDTOToStudent(studentImportDTO1)).thenReturn(student1);
        when(studentMapper.studentToStudentImportDTO(student1registered)).thenReturn(studentImportDTO1);
        when(studentMapper.studentImportDTOToStudent(studentImportDTO3)).thenReturn(student3);
        when(studentMapper.studentToStudentImportDTO(student3registered)).thenReturn(studentImportDTO3);

        List<StudentImportDTO> actualStudents = studentService.saveFromFile(multipartFile, 4L).getNow(new ArrayList<>());
        assertNotNull(actualStudents);
        assertEquals(expectedStudents, actualStudents);
        verify(studentRepository).save(student1);
        verify(studentRepository).save(student3);
        verify(studentRepository).getExistingStudent(student1);
        verify(studentRepository).getExistingStudent(student3);
    }
}
