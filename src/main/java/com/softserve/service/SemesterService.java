package com.softserve.service;

import com.softserve.dto.SemesterDTO;
import com.softserve.dto.SemesterWithGroupsDTO;

import java.util.List;

public interface SemesterService {

    SemesterWithGroupsDTO getById(Long id);

    List<SemesterWithGroupsDTO> getAll();

    SemesterWithGroupsDTO save(SemesterWithGroupsDTO semesterDTO);

    SemesterWithGroupsDTO update(SemesterWithGroupsDTO semesterDTO);

    void delete(Long id);

    SemesterWithGroupsDTO getCurrentSemester();

    SemesterWithGroupsDTO getDefaultSemester();

    List<SemesterDTO> getDisabled();

    SemesterDTO changeCurrentSemester(Long semesterId);

    SemesterDTO changeDefaultSemester(Long semesterId);

    SemesterWithGroupsDTO addGroupsToSemester(Long semesterId, List<Long> groupIds);

    SemesterWithGroupsDTO copySemester(Long fromSemesterId, Long toSemesterId);

    /**
     * Returns all semesters that are active during the current week.
     * A semester is considered active if its date range overlaps with
     * the current Monday–Sunday interval.
     *
     * @return list of {@link SemesterWithGroupsDTO} active this week,
     *         or an empty list if none found
     */
    List<SemesterWithGroupsDTO> getSemestersActiveThisWeek();
}
