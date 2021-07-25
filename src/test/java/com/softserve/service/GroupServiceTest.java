package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.entity.Student;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.GroupRepository;
import com.softserve.service.impl.GroupServiceImpl;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(MockitoJUnitRunner.class)
public class GroupServiceTest {

    @Mock
    private GroupRepository groupRepository;

    @InjectMocks
    private GroupServiceImpl groupService;

    @Test
    public void getAll() {
        Group group = new Group();
        group.setTitle("some group");
        group.setId(1L);

        when(groupRepository.getAll()).thenReturn(Arrays.asList(group));
        List<Group> actualList = groupService.getAll();

        assertEquals(1, actualList.size());
        assertSame(actualList.get(0), group);
    }

    @Test
    public void getGroupById() {
        Group group = new Group();
        group.setTitle("some group");
        group.setId(1L);

        when(groupRepository.getById(1L)).thenReturn(group);

        Group result = groupService.getById(1L);
        assertNotNull(result);
        assertEquals(group.getId(), result.getId());
        verify(groupRepository, times(1)).getById(anyLong());
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionIfGroupNotFoundedById() {
        Group group = new Group();
        group.setTitle("some group");
        group.setId(1L);

        groupService.getById(2L);
        verify(groupRepository, times(1)).getById(2L);
    }

    @Test
    public void saveGroupIfTitleDoestNotExists() {
        Group group = new Group();
        group.setTitle("some group");
        group.setId(1L);

        when(groupRepository.countGroupsWithTitle(anyString())).thenReturn(0L);
        when(groupRepository.save(group)).thenReturn(group);

        Group result = groupService.save(group);
        assertNotNull(result);
        assertEquals(group.getTitle(), result.getTitle());
        verify(groupRepository, times(1)).save(group);
        verify(groupRepository, times(1)).countGroupsWithTitle(anyString());
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionIfSavedGroupAlreadyExists() {
        Group group = new Group();
        group.setTitle("some group");
        group.setId(1L);

        when(groupRepository.countGroupsWithTitle(anyString())).thenReturn(1L);

        groupService.save(group);
        verify(groupRepository, times(1)).save(group);
        verify(groupRepository, times(1)).countGroupsWithTitle(anyString());
    }

    @Test
    public void updateGroupIfTitleDoesNotExists() {
        Group oldGroup = new Group();
        oldGroup.setTitle("some title");
        oldGroup.setId(1L);
        Group updatedGroup = new Group();
        updatedGroup.setTitle("updated title");
        updatedGroup.setId(1L);

        when(groupRepository.update(updatedGroup)).thenReturn(updatedGroup);
        when(groupRepository.getById(anyLong())).thenReturn(oldGroup);

        oldGroup = groupService.update(updatedGroup);
        assertNotNull(oldGroup);
        assertEquals(updatedGroup, oldGroup);
        verify(groupRepository, times(1)).update(oldGroup);
    }

    @Test
    public void delete() {
        Group expectedGroup = new Group();
        expectedGroup.setTitle("some group");
        expectedGroup.setId(1L);

        when(groupRepository.delete(any(Group.class))).thenReturn(expectedGroup);
        when(groupRepository.getById(anyLong())).thenReturn(expectedGroup);
        Group deletedGroup = groupService.delete(expectedGroup);

        assertNotNull(deletedGroup);
        assertEquals(expectedGroup, deletedGroup);
        verify(groupRepository).delete(any());
    }

    @Test
    public void getDisabled() {
        Group expectedGroup = new Group();
        expectedGroup.setId(1L);
        expectedGroup.setTitle("some group");
        expectedGroup.setDisable(true);

        when(groupRepository.getDisabled()).thenReturn(Arrays.asList(expectedGroup));
        List<Group> disabledActual = groupService.getDisabled();

        assertEquals(1, disabledActual.size());
        assertSame(disabledActual.get(0), expectedGroup);
    }

    @Ignore
    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionIfUpdatedTitleAlreadyExists() {
        Group oldGroup = new Group();
        oldGroup.setTitle("some group");
        oldGroup.setId(1L);
        Group updatedSubject = new Group();
        updatedSubject.setTitle("updated group");
        updatedSubject.setId(1L);

        when(groupRepository.countByGroupId(anyLong())).thenReturn(1L);
        when(groupRepository.countGroupsWithTitleAndIgnoreWithId(anyLong(), anyString())).thenReturn(1L);

        oldGroup = groupService.update(updatedSubject);
        verify(groupRepository, times(1)).countByGroupId(anyLong());
        verify(groupRepository, times(1)).countGroupsWithTitleAndIgnoreWithId(anyLong(), anyString());
    }

    @Ignore
    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionIfTryToUpdateNotFoundedGroup() {
        Group group = new Group();
        group.setTitle("some group");
        group.setId(1L);

        when(groupRepository.countByGroupId(anyLong())).thenReturn(0L);

        groupService.update(group);
        verify(groupService, times(1)).update(group);
    }
}
