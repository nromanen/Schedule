package com.softserve.service;

import com.softserve.entity.Department;
import com.softserve.entity.Teacher;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.DepartmentRepository;
import com.softserve.service.impl.DepartmentServiceImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(MockitoJUnitRunner.class)
public class DepartmentServiceTest {
    @Mock
    private DepartmentRepository repository;

    @InjectMocks
    private DepartmentServiceImpl service;

    private Department department;

    @Before
    public void setUp() {
        department = new Department();
        department.setId(1L);
        department.setName("some department");
    }

    @Test
    public void testGetAll() {
        List<Department> expected = Arrays.asList(department);
        when(repository.getAll()).thenReturn(expected);

        List<Department> actual = service.getAll();
        assertThat(actual).hasSameSizeAs(expected)
                .hasSameElementsAs(expected);
        verify(repository, times(1)).getAll();
    }

    @Test
    public void testDelete() {
        when(repository.delete(department)).thenReturn(department);
        assertThat(service.delete(department)).isEqualTo(department);
        verify(repository, times(1)).delete(department);
    }

    @Test
    public void testGetById() {
        when(repository.findById(1L)).thenReturn(Optional.of(department));

        Department result = service.getById(1L);
        assertNotNull(result);
        assertEquals(department.getId(), result.getId());
        verify(repository, times(1)).findById(anyLong());
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionIfDepartmentNotFoundedById() {
        service.getById(2L);
        verify(repository, times(1)).findById(2L);
    }

    @Test
    public void saveIfNameIsUnique() {
        when(repository.isNameExists(anyString())).thenReturn(false);
        when(repository.save(department)).thenReturn(department);

        Department result = service.save(department);
        assertNotNull(result);
        assertEquals(department.getName(), result.getName());
        verify(repository, times(1)).save(department);
        verify(repository, times(1)).isNameExists(anyString());
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionIfNameAlreadyExists() {
        when(repository.isNameExists(anyString())).thenReturn(true);

        service.save(department);
        verify(repository, times(1)).save(department);
        verify(repository, times(1)).isNameExists(anyString());
    }

    @Test
    public void updateIfNameDoesNotExists() {
        when(repository.findById(anyLong())).thenReturn(Optional.of(department));
        when(repository.isNameExistsIgnoringId(anyString(), anyLong()))
                .thenReturn(false);
        when(repository.update(department)).thenReturn(department);

        Department actualDepartment = service.update(department);
        assertNotNull(actualDepartment);
        assertEquals(department, actualDepartment);
        verify(repository, times(1)).update(actualDepartment);
        verify(repository, times(1))
                .isNameExistsIgnoringId(anyString(), anyLong());
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionIfUpdatedNameAlreadyExists() {
        when(repository.findById(anyLong())).thenReturn(Optional.of(department));
        when(repository.isNameExistsIgnoringId(anyString(), anyLong()))
                .thenReturn(true);

        service.update(department);
        verify(repository, times(1))
                .isNameExistsIgnoringId(anyString(), anyLong());
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionIfTryToUpdateNotFoundedDepartment() {
        when(repository.findById(anyLong())).thenReturn(Optional.empty());
        service.update(department);
    }

    @Test
    public void testGetAllTeachers() {
        Teacher firstTeacher = new Teacher();
        firstTeacher.setName("Myroniuk");
        firstTeacher.setSurname("Ihor");
        firstTeacher.setPatronymic("Stepanovych");
        firstTeacher.setPosition("professor");

        Teacher secondTeacher = new Teacher();
        secondTeacher.setName("Adamovych");
        secondTeacher.setSurname("Svitlana");
        secondTeacher.setPatronymic("Petrivna");
        secondTeacher.setPosition("docent");

        List<Teacher> expectedTeachers = Arrays.asList(firstTeacher, secondTeacher);
        when(repository.getAllTeachers(3L)).thenReturn(expectedTeachers);

        List<Teacher> actualTeachers = service.getAllTeachers(3L);

        assertThat(actualTeachers).hasSameSizeAs(expectedTeachers).hasSameElementsAs(expectedTeachers);
        verify(repository).getAllTeachers(3L);
    }
}
