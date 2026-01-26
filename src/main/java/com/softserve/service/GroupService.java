package com.softserve.service;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.GroupWithStudentsDTO;
import com.softserve.entity.Group;

import java.util.List;
import java.util.Set;

public interface GroupService extends SortService<GroupDTO> {

    /**
     * Retrieves a group by the given id.
     *
     * @param id the id of the group
     * @return the group DTO with the given id
     */
    GroupDTO getById(Long id);

    /**
     * Retrieves a group entity by the given id. For internal service use only.
     *
     * @param id the id of the group
     * @return the group entity with the given id
     */
    Group getGroupEntityById(Long id);

    /**
     * Retrieves a group with students by the given id.
     *
     * @param id the id of the group
     * @return the group with students DTO
     */
    GroupWithStudentsDTO getWithStudentsById(Long id);

    /**
     * Returns all groups.
     *
     * @return the list of group DTOs
     */
    List<GroupDTO> getAll();

    /**
     * Returns all groups sorted by sort order.
     *
     * @return the list of group DTOs sorted by sort order
     */
    List<GroupDTO> getAllBySortOrder();

    /**
     * Saves a new group.
     *
     * @param groupDTO the group DTO to be saved
     * @return the saved group DTO
     */
    GroupDTO save(GroupDTO groupDTO);

    /**
     * Updates an existing group.
     *
     * @param groupForUpdateDTO the group DTO to be updated
     * @return the updated group DTO
     */
    GroupDTO update(GroupDTO groupForUpdateDTO);

    /**
     * Deletes a group by id.
     *
     * @param id the id of the group to be deleted
     */
    void delete(Long id);

    /**
     * Creates a group after specified order.
     *
     * @param groupDTO the group DTO to be created
     * @param afterId the id of the group after which to place the new group
     * @return the created group DTO
     */
    GroupDTO createAfterOrder(GroupDTO groupDTO, Long afterId);

    /**
     * Updates group order.
     *
     * @param groupDTO the group DTO to be updated
     * @param afterId the id of the group after which to place the updated group
     * @return the updated group DTO
     */
    GroupDTO updateAfterOrder(GroupDTO groupDTO, Long afterId);

    /**
     * Checks if group with given id exists.
     *
     * @param id the id of the group
     * @return true if group exists, false otherwise
     */
    boolean isExistsById(Long id);

    /**
     * Returns all disabled groups.
     *
     * @return the list of disabled group DTOs
     */
    List<GroupDTO> getDisabled();

    /**
     * Returns all groups by teacher id.
     *
     * @param teacherId the id of the teacher
     * @return the list of group DTOs
     */
    List<GroupDTO> getByTeacherId(Long teacherId);

    /**
     * Returns all groups for default semester.
     *
     * @return the set of group DTOs
     */
    Set<GroupDTO> getGroupsForDefaultSemester();

    /**
     * Returns all groups for current semester.
     *
     * @return the set of group DTOs
     */
    Set<GroupDTO> getGroupsForCurrentSemester();

    /**
     * Returns all groups by semester id.
     *
     * @param semesterId the id of the semester
     * @return the set of group DTOs
     */
    Set<GroupDTO> getGroupsBySemesterId(Long semesterId);

    /**
     * Returns all groups by group ids.
     *
     * @param groupIds the list of group ids
     * @return the list of group DTOs
     */
    List<GroupDTO> getGroupsByGroupIds(List<Long> groupIds);
}
