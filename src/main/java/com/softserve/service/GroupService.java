package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.exception.EntityNotFoundException;

import java.util.List;
import java.util.Set;

public interface GroupService extends BasicService<Group, Long> {

    /**
     * Method gets by id group with students from Repository
     *
     * @param id Identity number of the group
     * @return Group entity
     * @throws EntityNotFoundException if Group with id doesn't exist
     */
    Group getWithStudentsById(Long id);

    /**
     * Method verifies if Group with id param exist in repository
     *
     * @param id Long id of Group
     * @return true if Group with id param exists, else - false
     */
    boolean isExistsById(Long id);

    /**
     * The method used for getting all disabled groups
     *
     * @return list of disabled groups
     */
    List<Group> getDisabled();

    /**
     * The method used for getting all groups for semester
     *
     * @return list of groups for semester
     */
    Set<Group> getGroupsBySemesterId(Long semesterId);

    /**
     * The method used for getting all groups for current semester
     *
     * @return list of groups for current semester
     */
    Set<Group> getGroupsForCurrentSemester();

    /**
     * The method used for getting all groups for default semester
     *
     * @return list of groups for default semester
     */
    Set<Group> getGroupsForDefaultSemester();

    /**
     * The method used for getting all groups by group Ids
     *
     * @return list of groups by Ids
     */
    List<Group> getGroupsByGroupIds(List<Long> groupId);

    /**
     * The method used for getting groups by teacher id for default semester
     *
     * @param id Long id of a teacher
     * @return List of groups
     */
    List<Group> getByTeacherId(Long id);

    /**
     * The method is used to retrieve groups by set sorting order
     *
     * @return the list of groups sorted by set sorting order
     */
    List<Group> getAllBySortingOrder();

    /**
     * The method is used to save group after the specific group to get desired order
     *
     * @param group   the group that must be saved
     * @param afterId the id of the group after which must be saved the new one
     * @return saved group with set order and id
     */
    Group saveAfterOrder(Group group, Long afterId);

    /**
     * Method updates group order position
     *
     * @param group   group that will be replaced
     * @param afterId id of the group after which will be placed
     * @return group with new position
     */
    Group updateGroupOrder(Group group, Long afterId);
}
