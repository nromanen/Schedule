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
}
