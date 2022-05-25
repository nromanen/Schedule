package com.softserve.service;

import com.softserve.dto.ScheduleFullForArchiveDTO;
import com.softserve.dto.SemesterDTO;
import com.softserve.exception.EntityNotFoundException;

import java.util.List;

public interface ArchiveService {

    /**
     * The method used for getting schedule from mongo database by semesterId
     *
     * @param semesterId Semester id for getting schedule by this id from mongo db
     * @return ScheduleFullForArchiveDTO
     * @throws EntityNotFoundException if schedule by current semesterId not found
     */
    ScheduleFullForArchiveDTO getArchiveScheduleBySemesterId(Long semesterId);

    /**
     * The method used for getting all of archived schedules from mongo database
     *
     * @return list of semesters
     */
    List<SemesterDTO> getAllSemestersInArchiveSchedule();

    /**
     * The method used for save schedule in mongo database
     *
     * @param scheduleFullForArchiveDTO object ScheduleFullForArchiveDTO for save schedule in mongo db
     * @return ScheduleFullForArchiveDTO object
     */
    ScheduleFullForArchiveDTO saveScheduleForArchive(ScheduleFullForArchiveDTO scheduleFullForArchiveDTO);

    /**
     * The method used for delete schedule from mongo database by semesterId
     *
     * @param semesterId Semester id use for delete schedule by this id from mongo db
     */
    void deleteArchiveScheduleBySemesterId(Long semesterId);
}
