package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.entity.Student;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.StudentRepository;
import com.softserve.service.impl.StudentServiceImpl;
import junitparams.JUnitParamsRunner;
import junitparams.Parameters;
import org.junit.Rule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(JUnitParamsRunner.class)
public class StudentServiceTest {

    @Rule
    public MockitoRule mockitoRule = MockitoJUnit.rule();

    @Mock
    StudentRepository studentRepository;

    @InjectMocks
    StudentServiceImpl studentService;

    @Test
    public void getAll() {
        Student student = new Student();
        student.setName("Name");
        student.setSurname("Surname");
        student.setPatronymic("Patronymic");
        student.setEmail("tempStudent@gmail.com");
        student.setUserId(1L);
        student.setGroup(new Group());

        when(studentRepository.getAll()).thenReturn(Arrays.asList(student));
        List<Student> actualList = studentService.getAll();

        assertEquals(1, actualList.size());
        assertSame(actualList.get(0), student);
    }

    @Test
    public void getById() {
        Student expectedStudent = new Student();
        expectedStudent.setId(1L);
        expectedStudent.setName("Name");
        expectedStudent.setSurname("Surname");
        expectedStudent.setPatronymic("Patronymic");
        expectedStudent.setEmail("tempStudent@gmail.com");
        expectedStudent.setUserId(1L);
        expectedStudent.setGroup(new Group());

        when(studentRepository.getById(anyLong())).thenReturn(expectedStudent);

        Student actualStudent = studentService.getById(expectedStudent.getId());

        assertSame(expectedStudent, actualStudent);
    }

    @Test
    public void save() {
        Group group = new Group();
        group.setId(1L);

        Student expectedStudent = new Student();
        expectedStudent.setId(1L);
        expectedStudent.setName("Name");
        expectedStudent.setSurname("Surname");
        expectedStudent.setPatronymic("Patronymic");
        expectedStudent.setEmail("tempStudent@gmail.com");
        expectedStudent.setUserId(1L);
        expectedStudent.setGroup(group);

        when(studentRepository.save(any(Student.class))).thenReturn(expectedStudent);

        Student actualStudent = studentService.save(expectedStudent);

        assertEquals(expectedStudent.getEmail(), actualStudent.getEmail());
    }

    @Test
    public void update() {
        Group group = new Group();
        group.setId(1L);

        Student oldStudent = new Student();
        oldStudent.setId(1L);
        oldStudent.setName("Name");
        oldStudent.setSurname("Surname");
        oldStudent.setPatronymic("Patronymic");
        oldStudent.setEmail("tempStudent@gmail.com");
        oldStudent.setUserId(1L);
        oldStudent.setGroup(group);

        Student updatedStudent = new Student();
        updatedStudent.setId(oldStudent.getId());
        updatedStudent.setName("Changed Name");
        updatedStudent.setSurname("Changed Surname");
        updatedStudent.setPatronymic("Changed Patronymic");
        updatedStudent.setEmail("changedTempStudent@gmail.com");
        updatedStudent.setUserId(oldStudent.getUserId());
        updatedStudent.setGroup(oldStudent.getGroup());

        when(studentRepository.update(any(Student.class))).thenReturn(updatedStudent);
        when(studentRepository.getById(anyLong())).thenReturn(oldStudent);

        oldStudent = studentService.update(updatedStudent);

        assertNotNull(oldStudent);
        assertEquals(updatedStudent, oldStudent);
    }

    @Test
    public void delete() {
        Student expectedStudent = new Student();
        expectedStudent.setId(1L);
        expectedStudent.setName("Name");
        expectedStudent.setSurname("Surname");
        expectedStudent.setPatronymic("Patronymic");
        expectedStudent.setEmail("tempStudent@gmail.com");
        expectedStudent.setUserId(1L);
        expectedStudent.setGroup(new Group());

        when(studentRepository.delete(any(Student.class))).thenReturn(expectedStudent);
        when(studentRepository.getById(anyLong())).thenReturn(expectedStudent);
        Student deletedStudent = studentService.delete(expectedStudent);

        assertNotNull(deletedStudent);
        assertEquals(expectedStudent, deletedStudent);
        verify(studentRepository).delete(any());
    }

    @Test
    public void getByEmail() {
        Student expectedStudent = new Student();
        expectedStudent.setId(1L);
        expectedStudent.setName("Name");
        expectedStudent.setSurname("Surname");
        expectedStudent.setPatronymic("Patronymic");
        expectedStudent.setEmail("tempStudent@gmail.com");
        expectedStudent.setUserId(1L);
        expectedStudent.setGroup(new Group());

        when(studentRepository.findByEmail(anyString())).thenReturn(expectedStudent);

        Student actualStudent = studentService.getByEmail(expectedStudent.getEmail());

        assertNotNull(actualStudent);
        assertEquals(expectedStudent, actualStudent);
    }

    @Test
    public void getByUserId() {
        Student expectedStudent = new Student();
        expectedStudent.setId(1L);
        expectedStudent.setName("Name");
        expectedStudent.setSurname("Surname");
        expectedStudent.setPatronymic("Patronymic");
        expectedStudent.setEmail("tempStudent@gmail.com");
        expectedStudent.setUserId(1L);
        expectedStudent.setGroup(new Group());

        when(studentRepository.findByUserId(anyLong())).thenReturn(expectedStudent);

        Student actualStudent = studentService.getByUserId(expectedStudent.getUserId());

        assertNotNull(actualStudent);
        assertEquals(expectedStudent, actualStudent);
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionWhenGetById() {
        when(studentRepository.getById(anyLong())).thenReturn(null);
        studentService.getById(anyLong());
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionWhenSave() {
        Student inputStudent = new Student();
        inputStudent.setEmail("tempStudent@gmail.com");

        Student existingStudent = new Student();
        inputStudent.setEmail("tempStudent@gmail.com");

        when(studentRepository.findByEmail(anyString())).thenReturn(existingStudent);
        studentService.save(inputStudent);
    }

    @Test
    @Parameters(method = "parametersToTestImport")
    public void importStudentsFromFile(MockMultipartFile multipartFile) throws IOException {
        List<Student> expectedStudents = new ArrayList<>();

        Group group = new Group();
        group.setId(4L);

        Student student1 = new Student();
        student1.setSurname("Romaniuk");
        student1.setName("Hanna");
        student1.setPatronymic("Stepanivna");
        student1.setEmail("romaniuk@gmail.com");
        student1.setGroup(group);

        Student student2 = new Student();
        student2.setSurname("Boichuk");
        student2.setName("Oleksandr");
        student2.setPatronymic("Ivanovych");
        student2.setEmail("");
        student2.setGroup(group);

        Student student3 = new Student();
        student3.setSurname("Hanushchak");
        student3.setName("Viktor");
        student3.setPatronymic("Mykolaiovych");
        student3.setEmail("hanushchak@bigmir.net");
        student3.setGroup(group);

        expectedStudents.add(student1);
        expectedStudents.add(student3);

        when(studentRepository.findByEmail(student1.getEmail())).thenReturn(null);
        when(studentRepository.findByEmail(student2.getEmail())).thenReturn(null);
        when(studentRepository.findByEmail(student3.getEmail())).thenReturn(null);

        when(studentRepository.save(student1)).thenReturn(student1);
        when(studentRepository.save(student2)).thenThrow(RuntimeException.class);
        when(studentRepository.save(student3)).thenReturn(student3);

        List<Student> actualStudents = studentService.saveFromFile(multipartFile, 4L);
        assertNotNull(actualStudents);
        assertEquals(expectedStudents, actualStudents);
        verify(studentRepository).save(student1);
        verify(studentRepository).save(student2);
        verify(studentRepository).save(student3);
    }

    private Object[] parametersToTestImport() throws IOException {

        MockMultipartFile multipartFileCsv = new MockMultipartFile("file",
                "students.csv",
                "text/csv",
                Files.readAllBytes(Path.of("src/test/resources/test_students.csv")));

        MockMultipartFile multipartFileTxt = new MockMultipartFile("file",
                "students.txt",
                "text/plain",
                Files.readAllBytes(Path.of("src/test/resources/test_students.csv")));

        return new Object[] {multipartFileCsv, multipartFileTxt};
    }
}
