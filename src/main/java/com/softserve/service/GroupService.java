package com.softserve.service;

import com.softserve.entity.Group;
import java.util.List;
import java.util.Set;

public interface GroupService extends BasicService<Group, Long> {
    Group getWithStudentsById(Long id);

    boolean isExistsById(Long id);

    List<Group> getDisabled();

    Set<Group> getGroupsBySemesterId(Long semesterId);

    Set<Group> getGroupsForCurrentSemester();

    Set<Group> getGroupsForDefaultSemester();

    List<Group> getGroupsByGroupIds(List<Long> groupId);

    List<Group> getByTeacherId(Long id);

    List<Group> getAllBySortingOrder();

    Group saveAfterOrder(Group group, Long afterId);

    Group updateGroupOrder(Group group, Long afterId);
}
