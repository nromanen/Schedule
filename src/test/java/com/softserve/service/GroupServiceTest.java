package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.entity.Semester;
import com.softserve.entity.Student;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.GroupRepository;
import com.softserve.service.impl.GroupServiceImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static java.util.Collections.singletonList;
import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(MockitoJUnitRunner.class)
public class GroupServiceTest {
    @Mock
    private GroupRepository groupRepository;

    @Mock
    private SemesterService semesterService;

    @InjectMocks
    private GroupServiceImpl groupService;

    private Group group;

    private Student student;

    @Before
    public void setUp() {
        group = new Group();
        group.setTitle("some group");
        group.setId(1L);

        student = new Student();
        student.setId(1L);
        student.setGroup(group);
    }

    @Test
    public void getAll() {
        List<Group> expected = singletonList(group);
        when(groupRepository.getAll()).thenReturn(expected);

        List<Group> actual = groupService.getAll();

        assertThat(actual).hasSameSizeAs(expected).isEqualTo(expected);
        verify(groupRepository).getAll();
    }

    @Test
    public void getDisabled() {
        List<Group> expected = singletonList(group);
        when(groupRepository.getDisabled()).thenReturn(expected);

        List<Group> actual = groupService.getDisabled();

        assertThat(actual).hasSameSizeAs(expected).isEqualTo(expected);
        verify(groupRepository).getDisabled();
    }

    @Test
    public void getGroupById() {
        Group expected = group;
        when(groupRepository.findById(expected.getId())).thenReturn(Optional.of(expected));

        Group actual = groupService.getById(expected.getId());

        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(groupRepository).findById(expected.getId());
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionIfGroupNotFoundedById() {
        Long id = 1L;
        when(groupRepository.findById(id)).thenReturn(Optional.empty());
        groupService.getById(id);
        verify(groupRepository).findById(id);
    }

    @Test
    public void isExistsGroupById() {
        boolean expected = true;
        Long id = 1L;
        when(groupRepository.isExistsById(id)).thenReturn(expected);

        boolean actual = groupService.isExistsById(id);

        assertThat(actual).isTrue();
        verify(groupRepository).isExistsById(id);
    }

    @Test
    public void getGroupWithStudentsById() {
        Group expected = group;
        group.getStudents().add(student);
        when(groupRepository.findById(expected.getId())).thenReturn(Optional.of(expected));

        Group actual = groupService.getById(expected.getId());

        assertThat(actual.getStudents()).hasSize(expected.getStudents().size());
        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(groupRepository).findById(expected.getId());
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionIfGroupWithStudentsNotFoundedById() {
        Long id = 1L;
        when(groupRepository.getWithStudentsById(id)).thenReturn(Optional.empty());
        groupService.getWithStudentsById(id);
        verify(groupRepository).getWithStudentsById(id);
    }

    @Test
    public void saveGroup() {
        Group expected = group;
        when(groupRepository.isExistsByTitle(expected.getTitle())).thenReturn(false);
        when(groupRepository.save(expected)).thenReturn(expected);

        Group actual = groupService.save(expected);

        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(groupRepository).save(expected);
        verify(groupRepository).isExistsByTitle(expected.getTitle());
    }

    @Test
    public void updateGroup() {
        Group expected = group;
        when(groupRepository.isExistsByTitleIgnoringId(expected.getTitle(), expected.getId())).thenReturn(false);
        when(groupRepository.update(expected)).thenReturn(expected);

        Group actual = groupService.update(expected);

        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(groupRepository).isExistsByTitleIgnoringId(expected.getTitle(), expected.getId());
        verify(groupRepository, times(1)).update(expected);
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionIfTitleAlreadyExistsOnSave() {
        when(groupRepository.isExistsByTitle(anyString())).thenReturn(true);
        groupService.save(group);
        verify(groupRepository).isExistsByTitle(group.getTitle());
    }

    @Test
    public void deleteGroup() {
        Group expected = group;
        when(groupRepository.delete(group)).thenReturn(group);

        Group actual = groupService.delete(expected);

        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(groupRepository).delete(expected);
    }

    @Test
    public void getGroupsBySemesterId() {
        List<Group> groupList = new ArrayList<>();
        groupList.add(group);
        Semester semester = new Semester();
        semester.setId(1L);
        semester.setGroups(groupList);
        when(semesterService.getById(1L)).thenReturn(semester);
        assertEquals(groupService.getGroupsBySemesterId(1L), semester.getGroups());
        verify(semesterService, times(1)).getById(1L);
    }

    @Test
    public void getGroupsForCurrentSemester() {
        List<Group> groupList = new ArrayList<>();
        groupList.add(group);
        Semester semester = new Semester();
        semester.setCurrentSemester(true);
        semester.setGroups(groupList);
        when(semesterService.getCurrentSemester()).thenReturn(semester);
        assertEquals(groupService.getGroupsForCurrentSemester(), semester.getGroups());
        verify(semesterService, times(1)).getCurrentSemester();
    }

    @Test
    public void getGroupsForDefaultSemester() {
        List<Group> groupList = new ArrayList<>();
        groupList.add(group);
        Semester semester = new Semester();
        semester.setDefaultSemester(true);
        semester.setGroups(groupList);
        when(semesterService.getDefaultSemester()).thenReturn(semester);
        assertEquals(groupService.getGroupsForDefaultSemester(), semester.getGroups());
        verify(semesterService, times(1)).getDefaultSemester();
    }

    @Test
    public void getGroupsByGroupIds() {
        Group group1 = new Group();
        group1.setTitle("some group1");
        group1.setId(1L);
        Group group2 = new Group();
        group2.setTitle("some group2");
        group2.setId(2L);
        List<Group> groupList = new ArrayList<>();
        groupList.add(group1);
        groupList.add(group2);
        Semester semester = new Semester();
        semester.setDefaultSemester(true);
        semester.setGroups(groupList);
        Long[] groupIds = {1L, 2L};

        when(groupRepository.findById(1L)).thenReturn(Optional.of(group1));
        when(groupRepository.findById(2L)).thenReturn(Optional.of(group2));

        assertEquals(groupService.getGroupsByGroupIds(groupIds), groupList);
    }
}
