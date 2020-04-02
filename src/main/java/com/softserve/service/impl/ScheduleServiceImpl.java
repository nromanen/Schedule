package com.softserve.service.impl;


import com.softserve.dto.CreateScheduleInfoDTO;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.ScheduleConflictException;
import com.softserve.repository.ScheduleRepository;
import com.softserve.service.LessonService;
import com.softserve.service.RoomService;
import com.softserve.service.ScheduleService;
import com.softserve.service.mapper.RoomMapper;
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
    private final LessonService lessonService;
    private final RoomService roomService;
    private final RoomMapper roomMapper;

    @Autowired
    public ScheduleServiceImpl(ScheduleRepository scheduleRepository,  LessonService lessonService,  RoomService roomService, RoomMapper roomMapper) {
        this.scheduleRepository = scheduleRepository;
        this.lessonService = lessonService;
        this.roomService = roomService;
        this.roomMapper = roomMapper;
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


    /**
     * Method returns necessary info to finish saving schedule
     * @param semesterId the semester id in which schedule have to be saved
     * @param dayOfWeek the semester id in which schedule have to be saved
     * @param evenOdd lesson occurs by EVEN/ODD/WEEKLY
     * @param classId period id in which schedule have to be saved
     * @param lessonId lesson id that pretends t be saved
     * @return  CreateScheduleInfoDTO - necessary info to finish saving schedule
     */
    @Override
    public CreateScheduleInfoDTO getInfoForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId) {
        log.info("Enter into getInfoForCreatingSchedule with semesterId = {}, dayOfWeek = {}, evenOdd = {}, classId = {}, lessonId = {}", semesterId, dayOfWeek, evenOdd, classId, lessonId);
        //checking for missing parameters and wrong types is skipped, because it handles automatically by GlobalExceptionHandler
       if (isConflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, lessonId)){
            throw new ScheduleConflictException("You can't create schedule for this group, because one already exists");
        }
        else  {


            CreateScheduleInfoDTO createScheduleInfoDTO = new CreateScheduleInfoDTO();
            createScheduleInfoDTO.setTeacherAvailable(isTeacherAvailableForSchedule(semesterId, dayOfWeek, evenOdd, classId, lessonId));
            createScheduleInfoDTO.setNotAvailableRooms(roomMapper.convertToDtoList(roomService.getNotAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId)));
            createScheduleInfoDTO.setAvailableRooms(roomMapper.convertToDtoList(roomService.getAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId)));
            createScheduleInfoDTO.setClassSuitsToTeacher(true);
           return createScheduleInfoDTO;

        }

    }


    /**
     * Method checks if there is a conflict in schedule for Group at particular period of time
     * @param semesterId the semester id that the search is performed for
     * @param dayOfWeek the day of the week that the search is performed for
     * @param evenOdd lesson should occur by EVEN/ODD/WEEKLY
     * @param classId id for period that the search is performed for
     * @return true if there is a conflict in the Group schedule, else false
     */
    public boolean isConflictForGroupInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId) {
        log.info("Enter into isConflictForGroupInSchedule with semesterId = {}, dayOfWeek = {}, evenOdd = {}, classId = {}, lessonId = {}", semesterId, dayOfWeek, evenOdd, classId, lessonId);

        //Get group ID from Lesson by lesson ID to search further by group ID
        Long groupId = lessonService.getById(lessonId).getGroup().getId();

        //If Repository doesn't count any records that means there are no conflicts for this group at that point of time
        return scheduleRepository.conflictForGroupInSchedule(semesterId, dayOfWeek, evenOdd, classId, groupId) != 0;
    }

    @Override
    public boolean isTeacherAvailableForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId) {
        log.info("Enter into isTeacherAvailable with semesterId = {}, dayOfWeek = {}, evenOdd = {}, classId = {}, lessonId = {}", semesterId, dayOfWeek, evenOdd, classId, lessonId);
        //Get teacher ID from Lesson by lesson ID to search further by teacher ID
        Long teacherId = lessonService.getById(lessonId).getTeacher().getId();
        return scheduleRepository.conflictForTeacherInSchedule(semesterId, dayOfWeek, evenOdd, classId, teacherId) == 0;
    }
}





