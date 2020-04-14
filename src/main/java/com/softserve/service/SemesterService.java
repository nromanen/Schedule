package com.softserve.service;

import com.softserve.entity.Semester;

public interface SemesterService extends BasicService<Semester, Long> {
    Semester isSemesterExists(Semester semester);
    Semester getCurrentSemester();
}
