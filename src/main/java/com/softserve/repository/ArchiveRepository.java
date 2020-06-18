package com.softserve.repository;


import com.softserve.dto.ScheduleForArchiveDTO;

import java.util.List;
import java.util.Optional;

public interface ArchiveRepository {
    Optional<ScheduleForArchiveDTO> getArchiveScheduleBySemesterId(Long semesterId);

    List<ScheduleForArchiveDTO> getAllArchiveSchedule();

    ScheduleForArchiveDTO saveScheduleForArchive(ScheduleForArchiveDTO scheduleForArchiveDTO);

    void deleteArchiveScheduleBySemesterId(Long semesterId);
}
