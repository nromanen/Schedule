package com.softserve.service;

import com.softserve.dto.*;
import com.softserve.entity.Group;
import com.softserve.entity.Student;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.mapper.GroupMapper;
import com.softserve.mapper.StudentMapper;
import com.softserve.repository.GroupRepository;
import com.softserve.repository.SortOrderRepository;
import com.softserve.service.impl.GroupServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@Tag("unit")
@ExtendWith(MockitoExtension.class)
class GroupServiceTest {
    @Mock
    private GroupRepository groupRepository;

    @Mock
    private SortOrderRepository<Group> sortOrderRepository;

    @Mock
    private SemesterService semesterService;

    @Mock
    private GroupMapper groupMapper;

    @Mock
    private StudentMapper studentMapper;

    @InjectMocks
    private GroupServiceImpl groupService;

    private Group group;
    private Group group1;
    private Group group2;
    private GroupDTO groupDTO;
    private GroupDTO groupDTO1;
    private GroupDTO groupDTO2;
    private Student student;
    private SemesterWithGroupsDTO semesterDTO;

    @BeforeEach
    void setUp() {
        group = new Group();
        group.setTitle("some group");
        group.setId(1L);

        groupDTO = new GroupDTO();
        groupDTO.setId(1L);
        groupDTO.setTitle("some group");

        student = new Student();
        student.setId(1L);
        student.setGroup(group);

        sortOrderRepository.settClass(Group.class);

        group1 = new Group();
        group1.setTitle("Group 1");
        group1.setId(1L);

        group2 = new Group();
        group2.setTitle("Group 2");
        group2.setId(2L);

        groupDTO1 = new GroupDTO();
        groupDTO1.setId(1L);
        groupDTO1.setTitle("Group 1");

        groupDTO2 = new GroupDTO();
        groupDTO2.setId(2L);
        groupDTO2.setTitle("Group 2");

        semesterDTO = new SemesterWithGroupsDTO();
        semesterDTO.setId(1L);
        semesterDTO.setGroups(new LinkedList<>(List.of(groupDTO1, groupDTO2)));
    }

    @Test
    void getAll() {
        List<Group> groups = singletonList(group);
        List<GroupDTO> expected = singletonList(groupDTO);

        when(groupRepository.getAll()).thenReturn(groups);
        when(groupMapper.groupsToGroupDTOs(groups)).thenReturn(expected);

        List<GroupDTO> actual = groupService.getAll();

        assertThat(actual).hasSameSizeAs(expected).isEqualTo(expected);
        verify(groupRepository).getAll();
        verify(groupMapper).groupsToGroupDTOs(groups);
    }

    @Test
    void getByTeacherId() {
        List<Group> groups = singletonList(group);
        List<GroupDTO> expected = singletonList(groupDTO);

        when(groupRepository.getByTeacherId(1L)).thenReturn(groups);
        when(groupMapper.groupsToGroupDTOs(groups)).thenReturn(expected);

        List<GroupDTO> actual = groupService.getByTeacherId(1L);

        assertThat(actual).hasSameSizeAs(expected).isEqualTo(expected);
        verify(groupRepository).getByTeacherId(1L);
        verify(groupMapper).groupsToGroupDTOs(groups);
    }

    @Test
    void getDisabled() {
        List<Group> groups = singletonList(group);
        List<GroupDTO> expected = singletonList(groupDTO);

        when(groupRepository.getDisabled()).thenReturn(groups);
        when(groupMapper.groupsToGroupDTOs(groups)).thenReturn(expected);

        List<GroupDTO> actual = groupService.getDisabled();

        assertThat(actual).hasSameSizeAs(expected).isEqualTo(expected);
        verify(groupRepository).getDisabled();
        verify(groupMapper).groupsToGroupDTOs(groups);
    }

    @Test
    void getGroupById() {
        when(groupRepository.findById(group.getId())).thenReturn(Optional.of(group));
        when(groupMapper.groupToGroupDTO(group)).thenReturn(groupDTO);

        GroupDTO actual = groupService.getById(group.getId());

        assertThat(actual).usingRecursiveComparison().isEqualTo(groupDTO);
        verify(groupRepository).findById(group.getId());
        verify(groupMapper).groupToGroupDTO(group);
    }

    @Test
    void getGroupEntityById() {
        when(groupRepository.findById(group.getId())).thenReturn(Optional.of(group));

        Group actual = groupService.getGroupEntityById(group.getId());

        assertThat(actual).usingRecursiveComparison().isEqualTo(group);
        verify(groupRepository).findById(group.getId());
    }

    @Test
    void throwEntityNotFoundExceptionIfGroupNotFoundedById() {
        Long id = 1L;
        when(groupRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> groupService.getById(id));

        verify(groupRepository).findById(id);
    }

    @Test
    void throwEntityNotFoundExceptionIfGroupEntityNotFoundedById() {
        Long id = 1L;
        when(groupRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> groupService.getGroupEntityById(id));

        verify(groupRepository).findById(id);
    }

    @Test
    void isExistsGroupById() {
        boolean expected = true;
        Long id = 1L;
        when(groupRepository.isExistsById(id)).thenReturn(expected);

        boolean actual = groupService.isExistsById(id);

        assertThat(actual).isTrue();
        verify(groupRepository).isExistsById(id);
    }

    @Test
    void getGroupWithStudentsById() {
        Student student = new Student();
        student.setId(1L);

        group.setStudents(List.of(student));

        StudentWithoutGroupDTO studentDTO = new StudentWithoutGroupDTO();
        studentDTO.setId(1L);

        GroupWithStudentsDTO mappedGroup = new GroupWithStudentsDTO();
        mappedGroup.setId(1L);
        mappedGroup.setTitle("some group");

        GroupWithStudentsDTO expected = new GroupWithStudentsDTO();
        expected.setId(1L);
        expected.setTitle("some group");
        expected.setStudents(List.of(studentDTO));

        when(groupRepository.getWithStudentsById(group.getId())).thenReturn(Optional.of(group));
        when(groupMapper.groupToGroupWithStudentsDTO(group)).thenReturn(mappedGroup);
        when(studentMapper.studentToStudentWithoutGroupDTO(student)).thenReturn(studentDTO);

        GroupWithStudentsDTO actual = groupService.getWithStudentsById(group.getId());

        assertThat(actual).usingRecursiveComparison().isEqualTo(expected);
    }

    @Test
    void throwEntityNotFoundExceptionIfGroupWithStudentsNotFoundedById() {
        Long id = 1L;
        when(groupRepository.getWithStudentsById(id)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> groupService.getWithStudentsById(id));
        verify(groupRepository).getWithStudentsById(id);
    }

    @Test
    void saveGroup() {
        when(groupMapper.groupDTOToGroup(groupDTO)).thenReturn(group);
        when(groupRepository.isExistsByTitle(group.getTitle())).thenReturn(false);
        when(groupRepository.save(group)).thenReturn(group);
        when(groupMapper.groupToGroupDTO(group)).thenReturn(groupDTO);

        GroupDTO actual = groupService.save(groupDTO);

        assertThat(actual).usingRecursiveComparison().isEqualTo(groupDTO);
        verify(groupMapper).groupDTOToGroup(groupDTO);
        verify(groupRepository).isExistsByTitle(group.getTitle());
        verify(groupRepository).save(group);
        verify(groupMapper).groupToGroupDTO(group);
    }

    @Test
    void updateGroup() {
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(1L);
        groupDTO.setTitle("some group");

        when(groupMapper.groupDTOToGroup(groupDTO)).thenReturn(group);
        when(groupRepository.isExistsByTitleIgnoringId(group.getTitle(), group.getId())).thenReturn(false);
        when(sortOrderRepository.getSortOrderById(group.getId())).thenReturn(Optional.empty());
        when(groupRepository.update(group)).thenReturn(group);
        when(groupMapper.groupToGroupDTO(group)).thenReturn(groupDTO);

        GroupDTO actual = groupService.update(groupDTO);

        assertThat(actual).usingRecursiveComparison().isEqualTo(groupDTO);
        verify(groupMapper).groupDTOToGroup(groupDTO);
        verify(groupRepository).isExistsByTitleIgnoringId(group.getTitle(), group.getId());
        verify(groupRepository).update(group);
        verify(groupMapper).groupToGroupDTO(group);
    }

    @Test
    void throwFieldAlreadyExistsExceptionIfTitleAlreadyExistsOnSave() {
        when(groupMapper.groupDTOToGroup(groupDTO)).thenReturn(group);
        when(groupRepository.isExistsByTitle(anyString())).thenReturn(true);

        assertThrows(FieldAlreadyExistsException.class, () -> groupService.save(groupDTO));
        verify(groupMapper).groupDTOToGroup(groupDTO);
        verify(groupRepository).isExistsByTitle(group.getTitle());
    }

    @Test
    void deleteGroup() {
        Long id = 1L;
        when(groupRepository.findById(id)).thenReturn(Optional.of(group));

        groupService.delete(id);

        verify(groupRepository).findById(id);
        verify(groupRepository).delete(group);
    }

    @Test
    void throwEntityNotFoundExceptionOnDeleteIfGroupNotFound() {
        Long id = 1L;
        when(groupRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> groupService.delete(id));
        verify(groupRepository).findById(id);
    }

    @Test
    void getGroupsBySemesterId() {
        when(semesterService.getById(1L)).thenReturn(semesterDTO);

        Set<GroupDTO> result = groupService.getGroupsBySemesterId(1L);

        assertEquals(2, result.size());
        assertTrue(result.contains(groupDTO1));
        assertTrue(result.contains(groupDTO2));
        verify(semesterService).getById(1L);
    }

    @Test
    void getGroupsForCurrentSemester() {
        when(semesterService.getCurrentSemester()).thenReturn(semesterDTO);

        Set<GroupDTO> result = groupService.getGroupsForCurrentSemester();

        assertEquals(2, result.size());
        assertTrue(result.contains(groupDTO1));
        assertTrue(result.contains(groupDTO2));
        verify(semesterService).getCurrentSemester();
    }

    @Test
    void getGroupsForDefaultSemester() {
        when(semesterService.getDefaultSemester()).thenReturn(semesterDTO);

        Set<GroupDTO> result = groupService.getGroupsForDefaultSemester();

        assertEquals(2, result.size());
        assertTrue(result.contains(groupDTO1));
        assertTrue(result.contains(groupDTO2));
        verify(semesterService).getDefaultSemester();
    }

    @Test
    void getGroupsByGroupIds() {
        List<Long> groupIds = List.of(1L, 2L);
        List<Group> groups = List.of(group1, group2);
        List<GroupDTO> expected = List.of(groupDTO1, groupDTO2);

        when(groupRepository.getGroupsByGroupIds(groupIds)).thenReturn(groups);
        when(groupMapper.groupsToGroupDTOs(groups)).thenReturn(expected);

        List<GroupDTO> actual = groupService.getGroupsByGroupIds(groupIds);

        assertEquals(expected, actual);
        verify(groupRepository).getGroupsByGroupIds(groupIds);
        verify(groupMapper).groupsToGroupDTOs(groups);
    }

    @Test
    void getAllBySortOrder() {
        List<Group> groups = singletonList(group);
        List<GroupDTO> expected = singletonList(groupDTO);

        when(groupRepository.getAllBySortOrder()).thenReturn(groups);
        when(groupMapper.groupsToGroupDTOs(groups)).thenReturn(expected);

        List<GroupDTO> actual = groupService.getAllBySortOrder();

        assertThat(actual).hasSameSizeAs(expected).isEqualTo(expected);
        verify(groupRepository).getAllBySortOrder();
        verify(groupMapper).groupsToGroupDTOs(groups);
    }

    @Test
    void createAfterOrder() {
        Long afterId = 1L;

        when(groupMapper.groupDTOToGroup(groupDTO)).thenReturn(group);
        when(sortOrderRepository.createAfterOrder(group, afterId)).thenReturn(group);
        when(groupMapper.groupToGroupDTO(group)).thenReturn(groupDTO);

        GroupDTO actual = groupService.createAfterOrder(groupDTO, afterId);

        assertEquals(groupDTO, actual);
        verify(groupMapper).groupDTOToGroup(groupDTO);
        verify(sortOrderRepository).createAfterOrder(group, afterId);
        verify(groupMapper).groupToGroupDTO(group);
    }

    @Test
    void updateAfterOrder() {
        Long afterId = 1L;

        when(groupMapper.groupDTOToGroup(groupDTO)).thenReturn(group);
        when(sortOrderRepository.updateAfterOrder(group, afterId)).thenReturn(group);
        when(groupMapper.groupToGroupDTO(group)).thenReturn(groupDTO);

        GroupDTO actual = groupService.updateAfterOrder(groupDTO, afterId);

        assertEquals(groupDTO, actual);
        verify(groupMapper).groupDTOToGroup(groupDTO);
        verify(sortOrderRepository).updateAfterOrder(group, afterId);
        verify(groupMapper).groupToGroupDTO(group);
    }

    @Test
    void throwFieldAlreadyExistsExceptionIfTitleAlreadyExistsOnUpdate() {
        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(1L);
        groupDTO.setTitle("existing title");

        Group groupToUpdate = new Group();
        groupToUpdate.setId(1L);
        groupToUpdate.setTitle("existing title");

        when(groupMapper.groupDTOToGroup(groupDTO)).thenReturn(groupToUpdate);
        when(groupRepository.isExistsByTitleIgnoringId(groupToUpdate.getTitle(), groupToUpdate.getId())).thenReturn(true);

        assertThrows(FieldAlreadyExistsException.class, () -> groupService.update(groupDTO));

        verify(groupMapper).groupDTOToGroup(groupDTO);
        verify(groupRepository).isExistsByTitleIgnoringId(groupToUpdate.getTitle(), groupToUpdate.getId());
        verify(groupRepository, never()).update(any());
        verify(sortOrderRepository, never()).getSortOrderById(any());
    }
}
