package com.softserve.service.impl;


import com.softserve.dto.*;
import com.softserve.dto.CreateScheduleInfoDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Lesson;
import com.softserve.entity.Period;
import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.ScheduleConflictException;
import com.softserve.repository.ScheduleRepository;
import com.softserve.service.GroupService;
import com.softserve.service.LessonService;
import com.softserve.service.RoomService;
import com.softserve.service.ScheduleService;
import com.softserve.service.mapper.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Transactional
@Service
@Slf4j
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;

    private final LessonService lessonService;
    private final RoomService roomService;
    private final GroupService groupService;

    private final GroupMapper groupMapper;
    private final PeriodMapper periodMapper;
    private final LessonsInScheduleMapper lessonsInScheduleMapper;
    private final RoomForScheduleMapper roomForScheduleMapper;

    @Autowired
    public ScheduleServiceImpl(ScheduleRepository scheduleRepository, LessonService lessonService, RoomService roomService, GroupService groupService, GroupMapper groupMapper, PeriodMapper periodMapper, LessonsInScheduleMapper lessonsInScheduleMapper, RoomForScheduleMapper roomForScheduleMapper) {
        this.scheduleRepository = scheduleRepository;
        this.lessonService = lessonService;
        this.roomService = roomService;
        this.groupService = groupService;
        this.groupMapper = groupMapper;
        this.periodMapper = periodMapper;
        this.lessonsInScheduleMapper = lessonsInScheduleMapper;
        this.roomForScheduleMapper = roomForScheduleMapper;
    }

    /**
     * Method gets information from Repository for particular Schedule with id parameter
     * @param id Identity number of the Schedule
     * @return Schedule entity
     */
    @Override
    public Schedule getById(Long id) {
        log.info("In getById(id = [{}])",  id);
        return scheduleRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Schedule.class, "id", id.toString()));
    }

    /**
     * Method gets information about all Schedules from Repository
     * @return List of all Schedules
     */
    @Override
    public List<Schedule> getAll() {
        log.info("In getAll()");
        return scheduleRepository.getAll();
    }

    /**
     * Method saves new Schedule to Repository
     * @param object Schedule entity with info to be saved
     * @return saved Schedule entity
     */
    @Override
    public Schedule save(Schedule object) {
        log.info("In save(entity = [{}]", object);
        if (isConflictForGroupInSchedule(object.getSemester().getId(), DayOfWeek.valueOf(object.getDayOfWeek()), object.getEvenOdd(), object.getPeriod().getId(), object.getLesson().getId())) {
            log.error("Schedule for group with id [{}] has conflict with already existing", object.getLesson().getGroup().getId());
            throw new ScheduleConflictException("You can't create schedule item for this group, because one already exists");
        } else
        {
            return scheduleRepository.save(object);
        }
    }

    /**
     * Method updates information for an existing Schedule in Repository
     * @param object Schedule entity with info to be updated
     * @return updated Schedule entity
     */
    @Override
    public Schedule update(Schedule object) {
        log.info("In update(entity = [{}]", object);
        if (isConflictForGroupInSchedule(object.getSemester().getId(), DayOfWeek.valueOf(object.getDayOfWeek()), object.getEvenOdd(), object.getPeriod().getId(), object.getLesson().getId())) {
            throw new ScheduleConflictException("You can't update schedule item for this group, because it violates already existing");
        } else {
            return scheduleRepository.update(object);
        }
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
            createScheduleInfoDTO.setRooms(roomService.getAllRoomsForCreatingSchedule(semesterId,dayOfWeek, evenOdd, classId));
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

    @Override
    public List<ScheduleForGroupDTO> getFullSchedule(Long semesterId, Long groupId) {
        List<ScheduleForGroupDTO> scheduleForGroupDTOList = new ArrayList<>();
        List<Group> groupsForSchedule = new ArrayList<>();
        if (semesterId != null && groupId != null){
            if (groupHasScheduleInSemester(semesterId, groupId)) {
                groupsForSchedule.add(groupService.getById(groupId));
                ScheduleForGroupDTO scheduleForGroupDTO = new ScheduleForGroupDTO();
                scheduleForGroupDTO.setGroup(groupMapper.groupToGroupDTO(groupsForSchedule.get(0)));
                scheduleForGroupDTO.setDays(fillDaysOfWeekWithClassesDTO(semesterId, groupId));
                scheduleForGroupDTOList.add(scheduleForGroupDTO);
            }
            return scheduleForGroupDTOList;
        }
        else {
            groupsForSchedule.addAll(scheduleRepository.uniqueGroupsInScheduleBySemester(semesterId));
            for (Group group : groupsForSchedule) {
                ScheduleForGroupDTO scheduleForGroupDTO = new ScheduleForGroupDTO();
                scheduleForGroupDTO.setGroup(groupMapper.groupToGroupDTO(group));
                scheduleForGroupDTO.setDays(fillDaysOfWeekWithClassesDTO(semesterId, group.getId()));
                scheduleForGroupDTOList.add(scheduleForGroupDTO);
            }
            return scheduleForGroupDTOList;
        }
    }

  private List<DaysOfWeekWithClassesDTO> fillDaysOfWeekWithClassesDTO(Long semesterId, Long groupId){

      List<DaysOfWeekWithClassesDTO> daysOfWeekWithClassesDTOList = new ArrayList<>();
      List<DayOfWeek> weekList = new ArrayList<>();

      scheduleRepository.getDaysWhenGroupHasClassesBySemester(semesterId, groupId).forEach(day -> weekList.add(DayOfWeek.valueOf(day)));

      weekList.sort(Comparator.comparingInt(DayOfWeek::getValue));
      for (DayOfWeek day: weekList) {
            DaysOfWeekWithClassesDTO  daysOfWeekWithClassesDTO = new DaysOfWeekWithClassesDTO();
            daysOfWeekWithClassesDTO.setDay(day);
            daysOfWeekWithClassesDTO.setClasses(fillClassesInScheduleDTO(semesterId, groupId, day));
            daysOfWeekWithClassesDTOList.add(daysOfWeekWithClassesDTO);

      }

      return daysOfWeekWithClassesDTOList;
  }


  private List<ClassesInScheduleDTO> fillClassesInScheduleDTO(Long semesterId, Long groupId, DayOfWeek day){
        //get Classes in that Day for group
        List<Period> uniquePeriods = scheduleRepository.periodsForGroupByDayBySemester(semesterId, groupId, day);
       List<ClassesInScheduleDTO> classesInScheduleDTOList = new ArrayList<>();

      for (Period period: uniquePeriods) {
          ClassesInScheduleDTO classesInScheduleDTO = new ClassesInScheduleDTO();
          classesInScheduleDTO.setPeriod(periodMapper.convertToDto(period));
          classesInScheduleDTO.setWeeks(fillLessonsForGroupBySemesterAndDay(semesterId, groupId, period.getId(), day));
          classesInScheduleDTOList.add(classesInScheduleDTO);
      }

      return classesInScheduleDTOList;
  }

  private LessonInScheduleByWeekDTO fillLessonsForGroupBySemesterAndDay(Long semesterId, Long groupId, Long periodId, DayOfWeek day){
      LessonInScheduleByWeekDTO lessonInScheduleByWeekDTO = new LessonInScheduleByWeekDTO();
      Lesson lesson = scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semesterId, groupId, periodId, day, EvenOdd.EVEN).orElse(null);
      LessonsInScheduleDTO even = lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(lesson);

    if (lesson != null) {
        even.setRoom(roomForScheduleMapper.roomToRoomForScheduleDTO(scheduleRepository.getRoomForLesson(semesterId, periodId, lesson.getId(),  day, EvenOdd.EVEN)));
        lessonInScheduleByWeekDTO.setEven(even);
    }

      Lesson lesson2 = scheduleRepository.lessonForGroupByDayBySemesterByPeriodByWeek(semesterId, groupId, periodId, day, EvenOdd.ODD).orElse(null);
      LessonsInScheduleDTO odd = lessonsInScheduleMapper.lessonToLessonsInScheduleDTO(lesson2);
   if(lesson2 != null) {
       odd.setRoom(roomForScheduleMapper.roomToRoomForScheduleDTO(scheduleRepository.getRoomForLesson(semesterId,  periodId, lesson2.getId(), day, EvenOdd.ODD)));
       lessonInScheduleByWeekDTO.setOdd(odd);
   }

      return lessonInScheduleByWeekDTO;
  }

  private boolean groupHasScheduleInSemester(Long semesterId, Long groupId){
        return scheduleRepository.countSchedulesForGroupInSemester(semesterId, groupId) != 0;
  }

}





