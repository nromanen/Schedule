package com.softserve.service.impl;

import com.softserve.entity.Group;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.exception.SortingOrderNotExistsException;
import com.softserve.repository.GroupRepository;
import com.softserve.service.GroupService;
import com.softserve.service.SemesterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class GroupServiceImpl  implements GroupService {
    private final GroupRepository groupRepository;
    private final SemesterService semesterService;

    @Autowired
    public GroupServiceImpl(GroupRepository groupRepository, SemesterService semesterService) {
        this.groupRepository = groupRepository;
        this.semesterService = semesterService;
    }

    /**
     * Method gets by id group from Repository
     * @param id Identity number of the group
     * @return Group entity
     * @throws EntityNotFoundException if Group with id doesn't exist
     */
    @Transactional(readOnly = true)
    @Override
    public Group getById(Long id) {
        log.info("In getById(id = [{}])",  id);
        return groupRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Group.class, "id", id.toString()));
    }

    /**
     * Method gets by id group with students from Repository
     * @param id Identity number of the group
     * @return Group entity
     * @throws EntityNotFoundException if Group with id doesn't exist
     */
    @Transactional(readOnly = true)
    @Override
    public Group getWithStudentsById(Long id) {
        log.info("In getWithStudentsById(id = [{}])",  id);
        return groupRepository.getWithStudentsById(id)
                .orElseThrow(() -> new EntityNotFoundException(Group.class, "id", id.toString()));
    }


    /**
     * Method gets information about all groups from Repository
     * @return List of all groups
     */
    @Transactional(readOnly = true)
    @Override
    public List<Group> getAll() {
        log.info("In getAll()");
        return groupRepository.getAll();
    }

    /**
     * The method used for getting groups by teacher id for default semester
     * @param id Long id of a teacher
     * @return List of groups
     */
    @Transactional(readOnly = true)
    @Override
    public List<Group> getByTeacherId(Long id) {
        log.info("In service getByTeacherId(id = [{}])", id);
        return groupRepository.getByTeacherId(id);
    }

    /**
     * The method is used to retrieve groups by set sorting order
     *
     * @return the list of groups sorted by set sorting order
     */
    @Transactional(readOnly = true)
    @Override
    public List<Group> getAllBySortingOrder() {
        log.debug("Entered getAllBySortingOrder() method");
        List<Group> groups = groupRepository.getAllBySortingOrder();
        log.debug("Retrieved groups. Size: {}", groups.size());
        return groups;
    }

    /**
     * The method is used to save group after the specific group to get desired order
     * @param group the group that must be saved
     * @param afterId the id of the group after which must be saved the new one
     * @return saved group with set order and id
     */
    @Transactional
    @Override
    public Group saveAfterOrder(Group group, Long afterId) {
        log.info("Entered getAllBySortingOrder({},{})", afterId, group);
        Integer maxOrder = groupRepository.getMaxSortingOrder().orElse(0);
        Integer order;
        if (afterId != null) {
            order = getSortingOrderById(afterId)+1;
            group.setSortingOrder(order);
            groupRepository.changeGroupOrderOffset(order, maxOrder+1);
        } else {
            group.setSortingOrder(1);
            groupRepository.changeGroupOrderOffset(0, maxOrder+1);
        }
        return groupRepository.save(group);
    }

    /**
     * Method updates group order position
     * @param group group that will be replaced
     * @param afterId id of the group after which will be placed
     * @return group with new position
     */
    @Transactional
    @Override
    public Group updateGroupOrder(Group group, Long afterId) {
        log.info("Entered updateGroupOrder({}, {})", group, afterId);
        if (!groupRepository.isExistsById(group.getId())) {
            throw new EntityNotFoundException(Group.class, "id", group.getId().toString());
        }
        Integer maxOrder = groupRepository.getMaxSortingOrder().orElse(0);
        if (afterId != null) {
            Integer lowerBound = getSortingOrderById(afterId)+1;
            Integer upperBound = Optional.ofNullable(group.getSortingOrder()).orElse(maxOrder+1)+1;
            group.setSortingOrder(lowerBound);
            groupRepository.changeGroupOrderOffset(lowerBound, upperBound);
        } else {
            group.setSortingOrder(1);
            groupRepository.changeGroupOrderOffset(0, maxOrder+1);
        }
        return groupRepository.update(group);
    }

    private Integer getSortingOrderById(Long id) {
        log.debug("Entered getSortingOrderById({})", id);
        return groupRepository.getSortingOrderById(id)
                .orElseThrow(() -> new SortingOrderNotExistsException(Group.class, id));
    }

    /**
     * Method saves new group to Repository
     *
     * @param group Group entity with info to be saved
     * @return saved Group entity
     * @throws FieldAlreadyExistsException if Group with input title already exists
     */
    @Transactional
    @Override
    public Group save(Group group) {
        log.info("In save(entity = [{}]", group);
        checkTitleForUniqueness(group.getTitle());
        return groupRepository.save(group);
    }

    /**
     * Method updates information for an existing group in  Repository
     * @param group Group entity with info to be updated
     * @return updated Group entity
     */
    @Transactional
    @Override
    public Group update(Group group) {
        log.info("In update(entity = [{}]", group);
        checkTitleForUniquenessIgnoringId(group.getTitle(), group.getId());
        group.setSortingOrder(groupRepository.getSortingOrderById(group.getId()).orElse(null));
        return groupRepository.update(group);
    }

    /**
     * Method deletes an existing group from Repository
     * @param group Group entity to be deleted
     * @return deleted Group entity
     */
    @Transactional
    @Override
    public Group delete(Group group) {
        log.info("In delete(entity = [{}])",  group);
        return groupRepository.delete(group);
    }

    /**
     * Method verifies if Group with id param exist in repository
     * @param id Long id of Group
     * @return true if Group with id param exists, else - false
     */
    @Transactional(readOnly = true)
    @Override
    public boolean isExistsById(Long id) {
        log.info("In isExistsById(id = [{}])",  id);
        return groupRepository.isExistsById(id);
    }

    /**
     * The method used for getting all disabled groups
     *
     * @return list of disabled groups
     */
    @Transactional(readOnly = true)
    @Override
    public List<Group> getDisabled() {
        log.info("Enter into getAll of getDisabled");
        return groupRepository.getDisabled();
    }

    /**
     * The method used for getting all groups for semester
     *
     * @return list of groups for semester
     */
    @Override
    public Set<Group> getGroupsBySemesterId(Long semesterId) {
        log.info("Enter into getGroupsBySemesterId");
        return semesterService.getById(semesterId).getGroups();
    }

    /**
     * The method used for getting all groups for current semester
     *
     * @return list of groups for current semester
     */
    @Override
    public Set<Group> getGroupsForCurrentSemester() {
        log.info("Enter into getGroupsByCurrentSemester");
        return semesterService.getCurrentSemester().getGroups();
    }

    /**
     * The method used for getting all groups for default semester
     *
     * @return list of groups for default semester
     */
    @Override
    public Set<Group> getGroupsForDefaultSemester() {
        log.info("Enter into getGroupsByCurrentSemester");
        return semesterService.getDefaultSemester().getGroups();
    }

    /**
     * The method used for getting all groups by group Ids
     *
     * @return list of groups by Ids
     */
    @Override
    @Transactional
    public List<Group> getGroupsByGroupIds(List<Long> groupIds) {
        log.info("Enter into getGroupsByGroupIds");
        return groupRepository.getGroupsByGroupIds(groupIds);
    }

    private void checkTitleForUniqueness(String title) {
        if (groupRepository.isExistsByTitle(title)){
            throw new FieldAlreadyExistsException(Group.class, "title", title);
        }
    }

    private void checkTitleForUniquenessIgnoringId(String title, Long id) {
        if (groupRepository.isExistsByTitleIgnoringId(title, id)){
            throw new FieldAlreadyExistsException(Group.class, "title", title);
        }
    }
}
