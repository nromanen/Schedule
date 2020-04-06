package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.GroupRepository;
import com.softserve.service.impl.GroupServiceImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class GroupServiceTest {

    @Mock
    private GroupRepository groupRepository;

    @InjectMocks
    private GroupServiceImpl groupService;

    @Test
    public void testGetById() {
        Group group = new Group();
        group.setTitle("some group");
        group.setId(1L);

        when(groupRepository.findById(anyLong())).thenReturn(Optional.of(group));

        Group result = groupService.getById(1L);
        assertNotNull(result);
        assertEquals(group.getId(), result.getId());
        verify(groupRepository, times(1)).findById(anyLong());
    }

    @Test(expected = EntityNotFoundException.class)
    public void notFoundId() {
        Group group = new Group();
        group.setTitle("some group");
        group.setId(1L);

        groupService.getById(2L);
        verify(groupService, times(1)).getById(2L);
    }

    @Test
    public void testSave() {
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
    public void saveExistsTitle() {
        Group group = new Group();
        group.setTitle("some group");
        group.setId(1L);

        when(groupRepository.countGroupsWithTitle(anyString())).thenReturn(1L);

        groupService.save(group);
        verify(groupRepository, times(1)).save(group);
        verify(groupRepository, times(1)).countGroupsWithTitle(anyString());
    }

    @Test
    public void testUpdate() {
        Group oldGroup = new Group();
        oldGroup.setTitle("some title");
        oldGroup.setId(1L);
        Group updatedGroup = new Group();
        updatedGroup.setTitle("updated title");
        updatedGroup.setId(1L);

        when(groupRepository.existsById(anyLong())).thenReturn(1L);
        when(groupRepository.countGroupsWithTitle(anyString())).thenReturn(0L);
        when(groupRepository.update(updatedGroup)).thenReturn(updatedGroup);

        oldGroup = groupService.update(updatedGroup);
        assertNotNull(oldGroup);
        assertEquals(updatedGroup, oldGroup);
        verify(groupRepository, times(1)).update(oldGroup);
        verify(groupRepository, times(1)).countGroupsWithTitle(anyString());
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void updateWhenNameIsExists() {
        Group oldGroup = new Group();
        oldGroup.setTitle("some group");
        oldGroup.setId(1L);
        Group updatedSubject = new Group();
        updatedSubject.setTitle("updated group");
        updatedSubject.setId(1L);

        when(groupRepository.existsById(anyLong())).thenReturn(1L);
        when(groupRepository.countGroupsWithTitle(anyString())).thenReturn(1L);

        oldGroup = groupService.update(updatedSubject);
        verify(groupRepository, times(1)).update(oldGroup);
        verify(groupRepository, times(1)).countGroupsWithTitle(anyString());
    }

    @Test(expected = EntityNotFoundException.class)
    public void updateWhenSubjectNotFound() {
        Group group = new Group();
        group.setTitle("some group");
        group.setId(1L);

        when(groupRepository.existsById(anyLong())).thenReturn(0L);

        groupService.update(group);
        verify(groupService, times(1)).update(group);
    }
}
