package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.entity.Student;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.StudentRepository;
import com.softserve.service.impl.StudentServiceImpl;
import junitparams.JUnitParamsRunner;
import junitparams.Parameters;
import org.junit.Before;
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
import java.util.List;
import java.util.Optional;
import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@Category(UnitTestCategory.class)
@RunWith(JUnitParamsRunner.class)
public class StudentServiceTest {
    @Rule
    public MockitoRule mockitoRule = MockitoJUnit.rule();

    @Mock
    StudentRepository studentRepository;

    @InjectMocks
    StudentServiceImpl studentService;

    Student studentWithId1L;

    @Before
    public void setUp() {
        studentWithId1L = new Student();
        studentWithId1L.setName("Name");
        studentWithId1L.setSurname("Surname");
        studentWithId1L.setPatronymic("Patronymic");
        studentWithId1L.setEmail("tempStudent@gmail.com");
    }

    @Test
    public void getAll() {
        List<Student> expected = singletonList(studentWithId1L);
        when(studentRepository.getAll()).thenReturn(expected);

        List<Student> actual = studentService.getAll();

        assertThat(actual).hasSameSizeAs(expected).hasSameElementsAs(expected);
        verify(studentRepository).getAll();
    }

    @Test
    public void getById() {
        Student expected = studentWithId1L;
        when(studentRepository.findById(expected.getId())).thenReturn(Optional.of(expected));

        Student actual = studentService.getById(expected.getId());

        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(studentRepository).findById(expected.getId());
    }

    @Test
    public void save() {
        Student expected = studentWithId1L;
        when(studentRepository.save(expected)).thenReturn(expected);
        when(studentRepository.isExistsByEmail(expected.getEmail())).thenReturn(false);

        Student actual = studentService.save(expected);

        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(studentRepository).save(expected);
        verify(studentRepository).isExistsByEmail(expected.getEmail());
    }

    @Test
    public void update() {
        Student expected= studentWithId1L;
        when(studentRepository.update(expected)).thenReturn(expected);
        when(studentRepository.isExistsByEmailIgnoringId(expected.getEmail(), expected.getId())).thenReturn(false);

        Student actual = studentService.update(expected);

        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(studentRepository).update(expected);
        verify(studentRepository).isExistsByEmailIgnoringId(expected.getEmail(), expected.getId());
    }

    @Test
    public void delete() {
        Student expected = studentWithId1L;
        when(studentRepository.delete(expected)).thenReturn(expected);

        Student actual = studentService.delete(expected);

        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(studentRepository).delete(expected);
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionWhenGetById() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());
        studentService.getById(1L);
        verify(studentRepository).findById(1L);
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionWhenSave() {
        Student expected = studentWithId1L;
        when(studentRepository.isExistsByEmail(expected.getEmail())).thenReturn(true);
        studentService.save(expected);
        verify(studentRepository).isExistsByEmail(expected.getEmail());
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionWhenUpdate() {
        Student expected = studentWithId1L;
        when(studentRepository.isExistsByEmailIgnoringId(expected.getEmail(), expected.getId())).thenReturn(true);
        studentService.update(expected);
        verify(studentRepository).isExistsByEmailIgnoringId(expected.getEmail(), expected.getId());
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

        when(studentRepository.isExistsByEmail(student1.getEmail())).thenReturn(false);
        when(studentRepository.isExistsByEmail(student2.getEmail())).thenReturn(false);
        when(studentRepository.isExistsByEmail(student2.getEmail())).thenReturn(false);

        when(studentRepository.save(student1)).thenReturn(student1);
        when(studentRepository.save(student2)).thenThrow(RuntimeException.class);
        when(studentRepository.save(student3)).thenReturn(student3);

        List<Student> actualStudents = studentService.saveFromFile(multipartFile, 4L);
        assertNotNull(actualStudents);
        assertEquals(expectedStudents, actualStudents);
        verify(studentRepository).save(student1);
        verify(studentRepository).save(student2);
        verify(studentRepository).save(student3);
        verify(studentRepository).isExistsByEmail(student1.getEmail());
        verify(studentRepository).isExistsByEmail(student2.getEmail());
        verify(studentRepository).isExistsByEmail(student3.getEmail());
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
