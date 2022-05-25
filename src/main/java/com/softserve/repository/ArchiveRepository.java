package com.softserve.repository;

import com.softserve.dto.ScheduleFullForArchiveDTO;

import java.util.List;
import java.util.Optional;


public interface ArchiveRepository {
    Optional<ScheduleFullForArchiveDTO> getArchiveScheduleBySemesterId(Long semesterId);

    List<ScheduleFullForArchiveDTO> getAllArchiveSchedule();

    ScheduleFullForArchiveDTO saveScheduleForArchive(ScheduleFullForArchiveDTO fullScheduleForArchiveDTO);

    void deleteArchiveScheduleBySemesterId(Long semesterId);
}
