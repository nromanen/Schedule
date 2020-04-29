package com.softserve.service;

import com.softserve.entity.Semester;
import java.util.List;

public interface SemesterService extends BasicService<Semester, Long> {
    Semester isSemesterExists(Semester semester);
    Semester getCurrentSemester();
    List<Semester> getDisabled();
    Semester changeCurrentSemester(Long semesterId);

}
