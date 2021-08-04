package com.softserve.service;

import com.softserve.entity.Group;
import java.util.List;

public interface GroupService extends BasicService<Group, Long> {
    boolean isGroupExistsWithTitleAndIgnoreWithId(Long id, String title);
    boolean isGroupExistsWithTitle(String title);
    boolean isExistsWithId(Long id);
    List<Group> getAllWithoutStudents();
    List<Group> getDisabled();
    List<Group> getGroupsBySemesterId(Long semesterId);
    List<Group> getGroupsForCurrentSemester();
    List<Group> getDisabledWithoutStudents();
}
