package com.softserve.service;

import com.softserve.entity.Group;
import java.util.List;

public interface GroupService extends BasicService<Group, Long> {
    Group getWithStudentsById(Long id);

    boolean isExistsById(Long id);

    List<Group> getDisabled();

    List<Group> getGroupsBySemesterId(Long semesterId);

    List<Group> getGroupsForCurrentSemester();

    List<Group> getGroupsForDefaultSemester();

    List<Group> getGroupsByGroupIds(Long[] groupId);
}
