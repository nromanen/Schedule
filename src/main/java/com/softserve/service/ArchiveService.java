package com.softserve.service;

import com.softserve.dto.ScheduleFullForArchiveDTO;
import com.softserve.dto.SemesterDTO;
import com.softserve.dto.SemesterWithGroupsDTO;

import java.util.List;

public interface ArchiveService {
    ScheduleFullForArchiveDTO getArchiveScheduleBySemesterId(Long semesterId);

    SemesterWithGroupsDTO getArchiveSemester(Long semesterId);

    List<SemesterDTO> getAllSemestersInArchiveSchedule();

    ScheduleFullForArchiveDTO saveScheduleForArchive(ScheduleFullForArchiveDTO fullScheduleForArchiveDTO);

    SemesterWithGroupsDTO saveSemesterWithGroupDTO(SemesterWithGroupsDTO semesterWithGroupsDTO);

    void deleteArchiveScheduleBySemesterId(Long semesterId);

    void deleteArchiveSemester(Long semesterId);
}
