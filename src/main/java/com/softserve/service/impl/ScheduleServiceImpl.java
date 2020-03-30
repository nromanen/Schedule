package com.softserve.service.impl;


import com.softserve.dto.CreateScheduleInfoDTO;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.ScheduleRepository;
import com.softserve.service.ScheduleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.List;

@Transactional
@Service
@Slf4j
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;

    @Autowired
    public ScheduleServiceImpl(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    /**
     * Method gets information from Repository for particular Schedule with id parameter
     * @param id Identity number of the Schedule
     * @return Schedule entity
     */
    @Override
    public Schedule getById(Long id) {
        log.info("Enter into getById  with id {}",  id);
        return scheduleRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Schedule.class, "id", id.toString()));
    }

    /**
     * Method gets information about all Schedules from Repository
     * @return List of all Schedules
     */
    @Override
    public List<Schedule> getAll() {
        log.info("Enter into getAll method");
        return scheduleRepository.getAll();
    }

    /**
     * Method saves new Schedule to Repository
     * @param object Schedule entity with info to be saved
     * @return saved Schedule entity
     */
    @Override
    public Schedule save(Schedule object) {
        log.info("Enter into save method with entity: {}", object );
        return scheduleRepository.save(object);
    }

    /**
     * Method updates information for an existing Schedule in Repository
     * @param object Schedule entity with info to be updated
     * @return updated Schedule entity
     */
    @Override
    public Schedule update(Schedule object) {
        return scheduleRepository.update(object);
    }

    /**
     * Method deletes an existing Schedule from Repository
     * @param object Schedule entity to be deleted
     * @return deleted Schedule entity
     */
    @Override
    public Schedule delete(Schedule object) {
        return scheduleRepository.delete(object);
    }


    @Override
    public CreateScheduleInfoDTO getInfoForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        log.info("Enter into getInfoForCreatingSchedule with semesterId = {}, dayOfWeek = {}, evenOdd = {}, classId = {}", semesterId, dayOfWeek, evenOdd, classId);
        //checking for missing parameters and wrong types is skipped, because it handles automatically by GlobalExceptionHandler


        isConflictInSchedule(semesterId, dayOfWeek, evenOdd, classId);

        return new CreateScheduleInfoDTO();
    }


    /**
     * Method
     * @param semesterId
     * @param dayOfWeek
     * @param evenOdd
     * @param classId
     * @return true if there is a conflict on 
     */
    private boolean isConflictInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
       log.info("Enter into isConflictInSchedule");
        if (scheduleRepository.conflictInSchedule(semesterId, dayOfWeek, evenOdd, classId) != 0){
            log.error("conflict" );
            return true;
        } else {
            log.error("no conflict");
            return false;
        }
    }

}
