package com.softserve.repository;

import com.softserve.entity.Group;

import java.util.List;
import java.util.Optional;

public interface GroupRepository extends BasicRepository<Group, Long> {

    /**
     * The method used for getting by id entity with students
     *
     * @param id Long id of entity
     * @return found entity
     */
    Optional<Group> getWithStudentsById(Long id);

    /**
     * The method used for finding out if group with such title exists ignoring id
     *
     * @param title String title used to find Group
     * @param id    Long id, which is ignored during the search
     * @return true if exists, else - false
     */
    boolean isExistsByTitleIgnoringId(String title, Long id);

    /**
     * The method used for finding out if group with such title exists
     *
     * @param title String title used to find Group
     * @return true if exists, else - false
     */
    boolean isExistsByTitle(String title);

    /**
     * Method used to verify if group with such id exists
     *
     * @param id long id of the Group
     * @return true if there is no group with such id, false if record with id exists
     */
    boolean isExistsById(Long id);

    /**
     * The method used for getting groups by teacher id for default semester
     *
     * @param id Long id of a teacher
     * @return List of groups
     */
    List<Group> getByTeacherId(Long id);

    /**
     * The method used for getting all groups by group Ids
     *
     * @param groupIds ids of the groups that need to be retrieved
     * @return list of the groups
     */
    List<Group> getGroupsByGroupIds(List<Long> groupIds);

    /**
     * The method is used to retrieve groups by set sorting order
     *
     * @return the list of groups sorted by set sorting order
     */
    List<Group> getAllBySortingOrder();

    /**
     * The method is used to retrieve max sorting order
     *
     * @return max sorting order
     */
    Optional<Integer> getMaxSortingOrder();

    /**
     * The method is used to change group's sorting order
     *
     * @param lowerBound the lower bound of sorting order
     * @param upperBound the upper bound of sorting order
     */
    void changeGroupOrderOffset(Integer lowerBound, Integer upperBound);

    /**
     * The method is used to retrieve sorting order by group's id
     *
     * @param id group's id which sorting order needs to be retrieved
     * @return sorting order of the group
     */
    Optional<Integer> getSortingOrderById(Long id);
}
