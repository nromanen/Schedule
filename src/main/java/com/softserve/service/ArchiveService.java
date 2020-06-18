package com.softserve.service;

import com.softserve.dto.ScheduleForArchiveDTO;
import com.softserve.dto.SemesterDTO;

import java.util.List;

public interface ArchiveService {
    ScheduleForArchiveDTO getArchiveScheduleBySemesterId(Long semesterId);

    List<SemesterDTO> getAllSemestersInArchiveSchedule();

    ScheduleForArchiveDTO saveScheduleForArchive(ScheduleForArchiveDTO scheduleForArchiveDTO);

    void deleteArchiveScheduleBySemesterId(Long semesterId);
}
