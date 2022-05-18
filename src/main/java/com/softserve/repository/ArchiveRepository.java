package com.softserve.repository;

import com.softserve.dto.ScheduleFullForArchiveDTO;

import java.util.List;
import java.util.Optional;


public interface ArchiveRepository {

    /**
     * The method used for getting Optional of schedule from mongo database by semesterId
     *
     * @param semesterId Semester id for getting schedule by this id from mongo db
     * @return Optional of schedule
     */
    Optional<ScheduleFullForArchiveDTO> getArchiveScheduleBySemesterId(Long semesterId);

    /**
     * The method used for getting all of archived schedules from mongo database
     *
     * @return list of schedules
     */
    List<ScheduleFullForArchiveDTO> getAllArchiveSchedule();

    /**
     * The method used for save schedule in mongo database
     *
     * @param fullScheduleForArchiveDTO object ScheduleFullForArchiveDTO for save schedule in mongo db
     * @return ScheduleFullForArchiveDTO object
     */
    ScheduleFullForArchiveDTO saveScheduleForArchive(ScheduleFullForArchiveDTO fullScheduleForArchiveDTO);

    /**
     * The method used for delete schedule from mongo database by semesterId
     *
     * @param semesterId Semester id use for delete schedule by this id from mongo db
     */
    void deleteArchiveScheduleBySemesterId(Long semesterId);
}
