package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.entity.Period;
import com.softserve.entity.Schedule;
import com.softserve.entity.Semester;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Set;

public interface SemesterService extends BasicService<Semester, Long> {
    Semester getCurrentSemester();
    List<Semester> getDisabled();
    Semester changeCurrentSemester(Long semesterId);
    Semester getDefaultSemester();
    Semester changeDefaultSemester(Long semesterId);
    Semester addGroupToSemester(Semester semester, Group group);
    Semester addGroupsToSemester(Semester semester,  List<Long> groupIds);
    Semester addDaysOfWeekToSemester(Semester semester, Set<DayOfWeek> daysOfWeek);
    Semester addPeriodsToSemester(Semester semester, Set<Period> periods);
    Semester deleteGroupFromSemester(Semester semester, Group group);
    Semester deleteAllContentFromSemester(Semester semester);
    Semester deleteGroupsFromSemester(Semester semester, List<Group> group);
    Semester copySemester(Long fromSemesterId,Long toSemesterId);
}
