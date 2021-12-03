package com.softserve.repository;

import com.softserve.entity.Group;

import java.util.List;
import java.util.Optional;

public interface GroupRepository extends BasicRepository<Group, Long> {
    Optional<Group> getWithStudentsById(Long id);

    boolean isExistsByTitleIgnoringId(String string, Long id);

    boolean isExistsByTitle(String title);

    boolean isExistsById(Long id);

    List<Group> getByTeacherId(Long id);

    List<Group> getGroupsByGroupIds(List<Long> groupIds);
    
    List<Group> getAllBySortingOrder();

    Optional<Integer> getMaxSortingOrder();

    void changeGroupOrderOffset(Integer lowerBound, Integer upperBound);

    Optional<Integer> getSortingOrderById(Long id);
}
