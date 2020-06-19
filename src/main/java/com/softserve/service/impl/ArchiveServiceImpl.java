package com.softserve.service.impl;

import com.softserve.dto.ScheduleForArchiveDTO;
import com.softserve.dto.SemesterDTO;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.ArchiveRepository;
import com.softserve.service.ArchiveService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Transactional
@Service
@Slf4j
public class ArchiveServiceImpl implements ArchiveService {

    private final ArchiveRepository archiveRepository;

    @Autowired
    public ArchiveServiceImpl(ArchiveRepository archiveRepository) {
        this.archiveRepository = archiveRepository;
    }

    /**
     * The method used for getting schedule from mongo database by semesterId
     *
     * @param semesterId Semester id for getting schedule by this id from mongo db
     * @return ScheduleForArchiveDTO
     * @throws EntityNotFoundException if schedule by current semesterId not found
     */
    @Override
    public ScheduleForArchiveDTO getArchiveScheduleBySemesterId(Long semesterId) {
        log.info("In getArchiveScheduleBySemesterId with semesterId = {}", semesterId);
        return archiveRepository.getArchiveScheduleBySemesterId(semesterId).orElseThrow(
                () -> new EntityNotFoundException(ScheduleForArchiveDTO.class, "semesterId", semesterId.toString())
        );
    }

    /**
     * The method used for getting all of archived schedules from mongo database
     *
     * @return list of schedules
     */
    @Override
    public List<SemesterDTO> getAllSemestersInArchiveSchedule() {
        log.info("In getAllSemestersInArchiveSchedule");
        List<ScheduleForArchiveDTO> schedules = archiveRepository.getAllArchiveSchedule();
        List<SemesterDTO> semesters = new ArrayList<>();
        for (ScheduleForArchiveDTO schedule: schedules) {
            semesters.add(schedule.getSemesterDTO());
        }
        return semesters;
    }

    /**
     * The method used for save schedule in mongo database
     *
     * @param scheduleForArchiveDTO object ScheduleForArchiveDTO for save schedule in mongo db
     * @return ScheduleForArchiveDTO object
     */
    @Override
    public ScheduleForArchiveDTO saveScheduleForArchive(ScheduleForArchiveDTO scheduleForArchiveDTO) {
        log.info("In saveScheduleForArchive with scheduleForArchiveDTO = {}", scheduleForArchiveDTO);
        return archiveRepository.saveScheduleForArchive(scheduleForArchiveDTO);
    }

    /**
     * The method used for delete schedule from mongo database by semesterId
     *
     * @param semesterId Semester id use for delete schedule by this id from mongo db
     */
    @Override
    public void deleteArchiveScheduleBySemesterId(Long semesterId) {
        log.info("In removeArchiveScheduleBySemesterId with semesterId = {}", semesterId);
        archiveRepository.deleteArchiveScheduleBySemesterId(semesterId);
    }
}
