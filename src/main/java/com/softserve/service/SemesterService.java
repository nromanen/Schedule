package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.entity.Semester;
import java.util.List;

public interface SemesterService extends BasicService<Semester, Long> {
    Semester getCurrentSemester();
    List<Semester> getDisabled();
    Semester changeCurrentSemester(Long semesterId);
    Semester getDefaultSemester();
    Semester changeDefaultSemester(Long semesterId);
    Semester addGroupToSemester(Semester semester, Group group);
    Semester addGroupsToSemester(Semester semester, List<Group> group);
    Semester deleteGroupFromSemester(Semester semester, Group group);
    Semester deleteGroupsFromSemester(Semester semester, List<Group> group);
}
