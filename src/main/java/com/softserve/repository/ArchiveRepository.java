package com.softserve.repository;

import com.softserve.dto.ScheduleFullForArchiveDTO;
import com.softserve.dto.SemesterWithGroupsDTO;

import java.util.List;
import java.util.Optional;


public interface ArchiveRepository {
    Optional<ScheduleFullForArchiveDTO> getArchiveScheduleBySemesterId(Long semesterId);

    Optional<SemesterWithGroupsDTO> getArchiveSemester(Long semesterId);

    List<ScheduleFullForArchiveDTO> getAllArchiveSchedule();

    ScheduleFullForArchiveDTO saveScheduleForArchive(ScheduleFullForArchiveDTO fullScheduleForArchiveDTO);

    SemesterWithGroupsDTO saveSemesterWithGroupDTO(SemesterWithGroupsDTO semesterWithGroupsDTO);

    void deleteArchiveScheduleBySemesterId(Long semesterId);

    void deleteArchiveSemester(Long semesterId);
}
