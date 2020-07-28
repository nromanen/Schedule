package com.softserve.service;

import com.softserve.dto.ScheduleFullForArchiveDTO;
import com.softserve.dto.SemesterDTO;

import java.util.List;

public interface ArchiveService {
    ScheduleFullForArchiveDTO getArchiveScheduleBySemesterId(Long semesterId);

    List<SemesterDTO> getAllSemestersInArchiveSchedule();

    ScheduleFullForArchiveDTO saveScheduleForArchive(ScheduleFullForArchiveDTO fullScheduleForArchiveDTO);

    void deleteArchiveScheduleBySemesterId(Long semesterId);
}
