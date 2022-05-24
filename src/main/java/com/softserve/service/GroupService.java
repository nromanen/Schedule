package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.exception.EntityNotFoundException;

import java.util.List;
import java.util.Set;

public interface GroupService extends BasicService<Group, Long> {

    /**
     * Returns group with students from the repository by the given id.
     *
     * @param id the id of the of the group
     * @return the group with the given id with students
     * @throws EntityNotFoundException if group with given id not found
     */
    Group getWithStudentsById(Long id);

    /**
     * Checks if group with given id exists in the repository.
     *
     * @param id the id of the group
     * @return {@code true} if group with given id exists, otherwise {@code false}
     */
    boolean isExistsById(Long id);

    /**
     * Returns all disabled groups.
     *
     * @return the list of disabled groups
     */
    List<Group> getDisabled();

    /**
     * Returns all groups with given semester id.
     *
     * @param semesterId the id of the semester
     * @return the set of groups with given semester id
     */
    Set<Group> getGroupsBySemesterId(Long semesterId);

    /**
     * Returns all groups for current semester.
     *
     * @return the set of groups for current semester
     */
    Set<Group> getGroupsForCurrentSemester();

    /**
     * Returns all groups for default semester.
     *
     * @return the set of groups for default semester
     */
    Set<Group> getGroupsForDefaultSemester();

    /**
     * Returns all groups with id specified in the given list.
     *
     * @param groupId the list of groups ids
     * @return the list of groups
     */
    List<Group> getGroupsByGroupIds(List<Long> groupId);

    /**
     * Returns all groups with the given teacher id for default semester.
     *
     * @param id the id of the teacher
     * @return the list of groups with the given teacher id
     */
    List<Group> getByTeacherId(Long id);

    /**
     * Returns the list of groups sorted according to the established sort order.
     *
     * @return the list of groups sorted according to the established sort order
     */
    List<Group> getAllBySortingOrder();

    /**
     * Saves group after the specific group to get desired order.
     *
     * @param group   the group that must be saved
     * @param afterId the id of the group after which must be saved the new one
     * @return the saved group with set order and id
     */
    Group saveAfterOrder(Group group, Long afterId);

    /**
     * Updates the given group order position.
     *
     * @param group   group that will be replaced
     * @param afterId id of the group after which will be placed
     * @return the updated group with new position
     * @throws EntityNotFoundException if given group not found
     */
    Group updateGroupOrder(Group group, Long afterId);
}
