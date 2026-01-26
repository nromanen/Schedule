package com.softserve.service.impl;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.GroupWithStudentsDTO;
import com.softserve.dto.SemesterWithGroupsDTO;
import com.softserve.entity.Group;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.mapper.GroupMapper;
import com.softserve.mapper.StudentMapper;
import com.softserve.repository.GroupRepository;
import com.softserve.repository.SortOrderRepository;
import com.softserve.service.GroupService;
import com.softserve.service.SemesterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@Transactional(readOnly = true)
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final SemesterService semesterService;
    private final SortOrderRepository<Group> sortOrderRepository;
    private final GroupMapper groupMapper;
    private final StudentMapper studentMapper;

    public GroupServiceImpl(GroupRepository groupRepository,
                            SemesterService semesterService,
                            SortOrderRepository<Group> sortOrderRepository,
                            GroupMapper groupMapper,
                            StudentMapper studentMapper) {
        this.groupRepository = groupRepository;
        this.semesterService = semesterService;
        this.sortOrderRepository = sortOrderRepository;
        this.groupMapper = groupMapper;
        this.sortOrderRepository.settClass(Group.class);
        this.studentMapper = studentMapper;
    }

    @Override
    public GroupDTO getById(Long id) {
        log.info("In getById(id = [{}])", id);
        Group group = findGroupById(id);
        return groupMapper.groupToGroupDTO(group);
    }

    @Override
    public Group getGroupEntityById(Long id) {
        log.info("In getGroupEntityById(id = [{}])", id);
        return findGroupById(id);
    }

    @Override
    public GroupWithStudentsDTO getWithStudentsById(Long id) {
        log.info("In getWithStudentsById(id = [{}])", id);
        Group group = groupRepository.getWithStudentsById(id)
                .orElseThrow(() -> new EntityNotFoundException(Group.class, "id", id.toString()));

        GroupWithStudentsDTO dto = groupMapper.groupToGroupWithStudentsDTO(group);

        if (group.getStudents() != null) {
            dto.setStudents(
                    group.getStudents().stream()
                            .map(studentMapper::studentToStudentWithoutGroupDTO)
                            .toList()
            );
        }

        return dto;
    }

    @Override
    public List<GroupDTO> getAll() {
        log.info("In getAll()");
        return groupMapper.groupsToGroupDTOs(groupRepository.getAll());
    }

    @Override
    @Cacheable(value = "groupsList")
    public List<GroupDTO> getAllBySortOrder() {
        log.debug("In getAllBySortOrder()");
        List<Group> groups = groupRepository.getAllBySortOrder();
        log.debug("Retrieved groups. Size: {}", groups.size());
        return groupMapper.groupsToGroupDTOs(groups);
    }

    @Override
    @Transactional
    @CacheEvict(value = "groupsList", allEntries = true)
    public GroupDTO save(GroupDTO groupDTO) {
        log.info("In save(groupDTO = [{}])", groupDTO);
        Group group = groupMapper.groupDTOToGroup(groupDTO);
        checkTitleForUniqueness(group.getTitle());
        Group savedGroup = groupRepository.save(group);
        return groupMapper.groupToGroupDTO(savedGroup);
    }

    @Override
    @Transactional
    @CacheEvict(value = "groupsList", allEntries = true)
    public GroupDTO update(GroupDTO groupDTO) {
        log.info("In update(groupDTO = [{}])", groupDTO);
        Group group = groupMapper.groupDTOToGroup(groupDTO);
        checkTitleForUniquenessIgnoringId(group.getTitle(), group.getId());
        group.setSortOrder(sortOrderRepository.getSortOrderById(group.getId()).orElse(null));
        Group updatedGroup = groupRepository.update(group);
        return groupMapper.groupToGroupDTO(updatedGroup);
    }

    @Override
    @Transactional
    @CacheEvict(value = "groupsList", allEntries = true)
    public void delete(Long id) {
        log.info("In delete(id = [{}])", id);
        Group group = findGroupById(id);
        groupRepository.delete(group);
    }

    @Override
    @Transactional
    @CacheEvict(value = "groupsList", allEntries = true)
    public GroupDTO createAfterOrder(GroupDTO groupDTO, Long afterId) {
        log.debug("In createAfterOrder(groupDTO = [{}], afterId = [{}])", groupDTO, afterId);
        Group group = groupMapper.groupDTOToGroup(groupDTO);
        Group createdGroup = sortOrderRepository.createAfterOrder(group, afterId);
        return groupMapper.groupToGroupDTO(createdGroup);
    }

    @Override
    @Transactional
    @CacheEvict(value = "groupsList", allEntries = true)
    public GroupDTO updateAfterOrder(GroupDTO groupDTO, Long afterId) {
        log.debug("In updateAfterOrder(groupDTO = [{}], afterId = [{}])", groupDTO, afterId);
        Group group = groupMapper.groupDTOToGroup(groupDTO);
        Group updatedGroup = sortOrderRepository.updateAfterOrder(group, afterId);
        return groupMapper.groupToGroupDTO(updatedGroup);
    }

    @Override
    public boolean isExistsById(Long id) {
        log.info("In isExistsById(id = [{}])", id);
        return groupRepository.isExistsById(id);
    }

    @Override
    public List<GroupDTO> getDisabled() {
        log.info("In getDisabled()");
        return groupMapper.groupsToGroupDTOs(groupRepository.getDisabled());
    }

    @Override
    public List<GroupDTO> getByTeacherId(Long teacherId) {
        log.info("In getByTeacherId(teacherId = [{}])", teacherId);
        return groupMapper.groupsToGroupDTOs(groupRepository.getByTeacherId(teacherId));
    }

    @Override
    public Set<GroupDTO> getGroupsForDefaultSemester() {
        log.info("In getGroupsForDefaultSemester()");
        SemesterWithGroupsDTO semesterDTO = semesterService.getDefaultSemester();
        return new LinkedHashSet<>(semesterDTO.getGroups());
    }

    @Override
    public Set<GroupDTO> getGroupsForCurrentSemester() {
        log.info("In getGroupsForCurrentSemester()");
        SemesterWithGroupsDTO semesterDTO = semesterService.getCurrentSemester();
        return new LinkedHashSet<>(semesterDTO.getGroups());
    }

    @Override
    public Set<GroupDTO> getGroupsBySemesterId(Long semesterId) {
        log.info("In getGroupsBySemesterId(semesterId = [{}])", semesterId);
        SemesterWithGroupsDTO semesterDTO = semesterService.getById(semesterId);
        return new LinkedHashSet<>(semesterDTO.getGroups());
    }

    @Override
    public List<GroupDTO> getGroupsByGroupIds(List<Long> groupIds) {
        log.info("In getGroupsByGroupIds(groupIds = [{}])", groupIds);
        return groupMapper.groupsToGroupDTOs(groupRepository.getGroupsByGroupIds(groupIds));
    }

    private Group findGroupById(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Group.class, "id", id.toString()));
    }

    private void checkTitleForUniqueness(String title) {
        if (groupRepository.isExistsByTitle(title)) {
            throw new FieldAlreadyExistsException(Group.class, "title", title);
        }
    }

    private void checkTitleForUniquenessIgnoringId(String title, Long id) {
        if (groupRepository.isExistsByTitleIgnoringId(title, id)) {
            throw new FieldAlreadyExistsException(Group.class, "title", title);
        }
    }
}
