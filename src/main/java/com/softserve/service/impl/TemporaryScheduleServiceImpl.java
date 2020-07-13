package com.softserve.service.impl;

import com.softserve.entity.Semester;
import com.softserve.entity.TemporarySchedule;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.TemporaryScheduleRepository;
import com.softserve.service.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.SerializationUtils;
import org.hibernate.Hibernate;
import org.joda.time.Days;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Transactional
@Service
@Slf4j
public class TemporaryScheduleServiceImpl implements TemporaryScheduleService {

    private final TemporaryScheduleRepository temporaryScheduleRepository;

    private final SemesterService semesterService;
    private final GroupService groupService;
    private final RoomService roomService;
    private final PeriodService periodService;
    private final SubjectService subjectService;
    private final TeacherService teacherService;
    private final ScheduleService scheduleService;



    @Autowired
    public TemporaryScheduleServiceImpl(TemporaryScheduleRepository temporaryScheduleRepository, SemesterService semesterService, GroupService groupService,
                                        RoomService roomService, PeriodService periodService, SubjectService subjectService, TeacherService teacherService, @Lazy ScheduleService scheduleService) {
        this.temporaryScheduleRepository = temporaryScheduleRepository;
        this.semesterService = semesterService;
        this.groupService = groupService;
        this.roomService = roomService;
        this.periodService = periodService;
        this.subjectService = subjectService;
        this.teacherService = teacherService;
        this.scheduleService = scheduleService;
    }

    /**
     * The method used for getting room by id
     *
     * @param id Identity number of temporary schedule
     * @return target temporary schedule
     * @throws EntityNotFoundException if temporary schedule doesn't exist
     */
    @Override
    public TemporarySchedule getById(Long id) {
        log.info("Enter into getById of TemporaryScheduleServiceImpl with id {}", id);
        TemporarySchedule temporarySchedule = temporaryScheduleRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(TemporarySchedule.class, "id", id.toString()));
      //  Hibernate.initialize(temporarySchedule.getTeacher());
//        Hibernate.initialize(temporarySchedule.getTeacher().getSurname());
//        Hibernate.initialize(temporarySchedule.getSubject());
//        Hibernate.initialize(temporarySchedule.getRoom());
//        Hibernate.initialize(temporarySchedule.getGroup());
        Hibernate.initialize(temporarySchedule.getSemester().getPeriods());
        return temporarySchedule;

    }


    /**
     * The method used for getting all temporary schedules
     *
     * @return list of  temporary schedules
     */
    @Override
    public List<TemporarySchedule> getAll() {
        log.info("Enter into getAll of TemporaryScheduleServiceImpl");
        return temporaryScheduleRepository.getAll();
    }

    /**
     * The method used for getting all temporary schedules
     *
     * @return list of  temporary schedules
     */
    @Override
    public List<TemporarySchedule> getAllByTeacherAndRange(LocalDate fromDate, LocalDate toDate, Long teacherId) {
        log.info("Enter into getAllByTeacherAndRange of TemporaryScheduleServiceImpl");
        return temporaryScheduleRepository.getAllByTeacherAndRange(fromDate, toDate, teacherId);
    }

    /**
     * The method used for getting all temporary schedules
     *
     * @return list of  temporary schedules
     */
    @Override
    public List<TemporarySchedule> getAllBySemester() {
        log.info("Enter into getAllBySemester of TemporaryScheduleServiceImpl");
        List<TemporarySchedule> temporarySchedules=  temporaryScheduleRepository.getAllBySemester(semesterService.getCurrentSemester().getId());
        for (TemporarySchedule temporarySchedule: temporarySchedules) {
            Hibernate.initialize(temporarySchedule.getSemester().getPeriods());
        }
        return temporarySchedules;
    }

    /**
     * The method used for getting all temporary schedules
     *
     * @return list of  temporary schedules
     */
    @Override
    public List<TemporarySchedule> getAllByRange(LocalDate fromDate, LocalDate toDate) {
        log.info("Enter into getAllBySemester of TemporaryScheduleServiceImpl");
        return temporaryScheduleRepository.getAllByRange(fromDate, toDate);
    }

    /**
     * The method used for getting all temporary schedules
     *
     * @return list of  temporary schedules
     */
    @Override
    public List<TemporarySchedule> vacationByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate) {
        log.info("Enter into vacationByDateRangeForTeacher of TemporaryScheduleServiceImpl");
        List<TemporarySchedule> temporarySchedules = temporaryScheduleRepository.vacationByDateRangeForTeacher(fromDate, toDate);
        for (TemporarySchedule temporarySchedule: temporarySchedules) {
            Hibernate.initialize(temporarySchedule.getSemester().getPeriods());
        }
        return temporarySchedules;
    }


    /**
     * The method used for saving temporary schedule in database
     *
     * @param object temporary schedule
     * @return save temporary schedule
     */
    @Override
    public List<String>  addRange(LocalDate from, LocalDate to, TemporarySchedule object) {
        log.info("Enter into addRange of TemporaryScheduleServiceImpl with entity:{}", object );
        List<String> messagesList = new ArrayList<>();
        if(object.getSemester() == null) {
            Semester semester = new Semester();
            semester.setId(semesterService.getCurrentSemester().getId());
            object.setSemester(semester);
        }
        List<LocalDate> datesList = from.datesUntil(to.plusDays(1)).collect(Collectors.toList());
        for(LocalDate date : datesList){
            TemporarySchedule temporarySchedule =  SerializationUtils.clone(object);
            temporarySchedule.setDate(date);
            try {
                this.save(temporarySchedule);
            }catch (EntityAlreadyExistsException | EntityNotFoundException  e){
                messagesList.add(temporarySchedule.getDate() + " " + e.getMessage());
            }
        }
            return messagesList;
    }
    /**
     * The method used for saving temporary schedule in database
     *
     * @param object temporary schedule
     * @return save temporary schedule
     */
    @Override
    public TemporarySchedule save(TemporarySchedule object) {
        log.info("Enter into save of TemporaryScheduleServiceImpl with entity:{}", object );
        if(object.getSemester() == null) {
            Semester semester = new Semester();
            semester.setId(semesterService.getCurrentSemester().getId());
            object.setSemester(semester);
        }
        if(object.isVacation()){
            check(object);
        }else {
            if(isExistTemporaryScheduleByVacationByDate(object.getDate(), object.getSemester().getId(), true)){
                throw new EntityAlreadyExistsException("Please remove vacation before");
            }
            if(isExistTemporarySchedule(object, false)){
                throw new EntityAlreadyExistsException("Entity with this parameters already exists");
            }else{
                checkReferencedElement(object);
            }
        }

        return temporaryScheduleRepository.save(object);
    }

    /**
     * The method used for updating existed room in database
     *
     * @param object temporary schedule
     * @return temporary schedule before update
     */
    @Override
    public TemporarySchedule update(TemporarySchedule object) {
        log.info("Enter into update of TemporaryScheduleServiceImpl with entity:{}", object);
        if(object.getSemester() == null) {
            Semester semester = new Semester();
            semester.setId(semesterService.getCurrentSemester().getId());
            object.setSemester(semester);
        }
        if(object.isVacation()){
            checkUpdate(object);
        }else {
            if(isExistTemporaryScheduleByVacationByDate(object.getDate(), object.getSemester().getId(), true)){
                throw new EntityAlreadyExistsException("Please remove vacation before");
            }
            if(isExistTemporaryScheduleWithIgnoreId(object)){
                throw new EntityAlreadyExistsException("Entity with this parameters already exists");
            }else{
                checkReferencedElement(object);
            }
        }
        TemporarySchedule entity = temporaryScheduleRepository.update(object);
        return this.getById(entity.getId());
    }

    private void check(TemporarySchedule object) {
        if(object.getTeacher()!=null && object.getScheduleId()!=null){
            if(isExistTemporaryScheduleByDateAndScheduleId(object, false)){
                throw new EntityAlreadyExistsException("Please remove temporary schedule before add vacation by class");
            }

            if(isExistTemporaryScheduleByDateAndScheduleId(object, true)){
                throw new EntityAlreadyExistsException("Vacation by class already exist");
            }

            if(isExistTemporaryScheduleByVacationByDateAndTeacher(object.getDate(), object.getSemester().getId(), object.getTeacher().getId(), true)){
                throw new EntityAlreadyExistsException("Added vacation  for this teacher by date. We can't add vacation by class");
            }

            if(isExistTemporaryScheduleByVacationByDate(object.getDate(), object.getSemester().getId(), true)){
                throw new EntityAlreadyExistsException("Added vacation by date. We can't add vacation by class");
            }
        }else if(object.getTeacher()!=null){
            if(isExistTemporaryScheduleByVacationByDateAndTeacher(object.getDate(), object.getSemester().getId(), object.getTeacher().getId(), false)){
                throw new EntityAlreadyExistsException("Please remove temporary schedule for this teacher  before add vacation");
            }

            if(isExistTemporaryScheduleByVacationByDateAndTeacher(object.getDate(), object.getSemester().getId(), object.getTeacher().getId(), true)){
                throw new EntityAlreadyExistsException("Vacation for this teacher  already exists");
            }

            if(isExistTemporaryScheduleByVacationByDate(object.getDate(), object.getSemester().getId(), true)){
                throw new EntityAlreadyExistsException("Added vacation by date. We can't add vacation by teacher");
            }
        }else{
            if(isExistTemporaryScheduleByVacationByDate(object.getDate(), object.getSemester().getId(), false)){
                throw new EntityAlreadyExistsException("Please remove temporary schedule before add vacation");
            }

            if(isExistTemporaryScheduleByVacationByDate(object.getDate(), object.getSemester().getId(), true)){
                throw new EntityAlreadyExistsException("Vacation with this date already exists");
            }
        }
    }

    private void checkUpdate(TemporarySchedule object) {
        if(object.getTeacher()!=null && object.getScheduleId()!=null){
            if(isExistTemporaryScheduleByDateAndScheduleIdWithIgnoreId(object, false)){
                throw new EntityAlreadyExistsException("Please remove temporary schedule before add vacation by class");
            }

            if(isExistTemporaryScheduleByDateAndScheduleIdWithIgnoreId(object, true)){
                throw new EntityAlreadyExistsException("Vacation by class already exist");
            }

            if(isExistTemporaryScheduleByVacationByDateAndTeacherWithIgnoreId(object.getId(), object.getDate(), object.getSemester().getId(), object.getTeacher().getId(), true)){
                throw new EntityAlreadyExistsException("Added vacation  for this teacher by date. We can't add vacation by class");
            }

            if(isExistTemporaryScheduleByVacationByDateWithIgnoreId(object.getId(), object.getDate(), object.getSemester().getId(), true)){
                throw new EntityAlreadyExistsException("Added vacation by date. We can't add vacation by class");
            }
        }else if(object.getTeacher()!=null){
            if(isExistTemporaryScheduleByVacationByDateAndTeacherWithIgnoreId(object.getId(), object.getDate(), object.getSemester().getId(), object.getTeacher().getId(), false)){
                throw new EntityAlreadyExistsException("Please remove temporary schedule for this teacher  before add vacation");
            }

            if(isExistTemporaryScheduleByVacationByDateAndTeacherWithIgnoreId(object.getId(), object.getDate(), object.getSemester().getId(), object.getTeacher().getId(), true)){
                throw new EntityAlreadyExistsException("Vacation for this teacher  already exists");
            }

            if(isExistTemporaryScheduleByVacationByDateWithIgnoreId(object.getId(), object.getDate(), object.getSemester().getId(), true)){
                throw new EntityAlreadyExistsException("Added vacation by date. We can't add vacation by teacher");
            }
        }else{
            if(isExistTemporaryScheduleByVacationByDateWithIgnoreId(object.getId(), object.getDate(), object.getSemester().getId(), false)){
                throw new EntityAlreadyExistsException("Please remove temporary schedule before add vacation");
            }

            if(isExistTemporaryScheduleByVacationByDateWithIgnoreId(object.getId(), object.getDate(), object.getSemester().getId(), true)){
                throw new EntityAlreadyExistsException("Vacation with this date already exists");
            }
        }
    }

    /**
     * The method used for deleting existed temporary schedule in database
     *
     * @param object temporary schedule
     * @return deleted temporary schedule
     */
    @Override
    public TemporarySchedule delete(TemporarySchedule object) {
        log.info("Enter into delete of TemporaryScheduleServiceImpl with entity:{}", object);
        return temporaryScheduleRepository.delete(object);
    }


    /**
     * Method scheduleByDateRangeForTeacher get all schedules from db in particular date range
     *
     * @param fromDate  LocalDate from
     * @param toDate    LocalDate to
     * @param teacherId id teacher
     * @return list of schedules
     */
    @Override
    public List<TemporarySchedule> temporaryScheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId) {
        log.info("In scheduleByDateRangeForTeacher with fromDate = {} and toDate = {}", fromDate, toDate);
        List<TemporarySchedule> temporarySchedules = temporaryScheduleRepository.temporaryScheduleByDateRangeForTeacher(fromDate, toDate, teacherId);

        for (TemporarySchedule temporarySchedule: temporarySchedules) {
            Hibernate.initialize(temporarySchedule.getSemester().getPeriods());
        }
        return temporarySchedules;
    }


    private boolean isExistTemporaryScheduleByVacationByDate(LocalDate date, Long semesterId, boolean vacation) {
        log.info("In isExistTemporaryScheduleByVacationByDate(date = [{}], semesterId = [{}] ,vacation = [{}])", date, semesterId, vacation);
        return temporaryScheduleRepository.isExistTemporaryScheduleByVacationByDate(date, semesterId, vacation) != 0;
    }

    private boolean isExistTemporaryScheduleByVacationByDateWithIgnoreId(Long id, LocalDate date, Long semesterId, boolean vacation) {
        log.info("In isExistTemporaryScheduleByVacationByDateWithIgnoreId(date = [{}], semesterId = [{}] ,vacation = [{}])", date, semesterId, vacation);
        return temporaryScheduleRepository.isExistTemporaryScheduleByVacationByDateWithIgnoreId(id, date, semesterId, vacation) != 0;
    }

    private boolean isExistTemporaryScheduleByVacationByDateAndTeacher(LocalDate date, Long semesterId, Long teacherId, boolean vacation) {
        log.info("In isExistTemporaryScheduleByVacationByDateAndTeacher(date = [{}], semesterId = [{}] , teacherId = [{}], vacation = [{}])", date, semesterId, teacherId, vacation);
        return temporaryScheduleRepository.isExistTemporaryScheduleByVacationByDateAndTeacher(date, semesterId,teacherId, vacation) != 0;
    }

    private boolean isExistTemporaryScheduleByVacationByDateAndTeacherWithIgnoreId(Long id, LocalDate date, Long semesterId, Long teacherId, boolean vacation) {
        log.info("In isExistTemporaryScheduleByVacationByDateAndTeacherWithIgnoreId(date = [{}], semesterId = [{}] , teacherId = [{}], vacation = [{}])", date, semesterId, teacherId, vacation);
        return temporaryScheduleRepository.isExistTemporaryScheduleByVacationByDateAndTeacherWithIgnoreId(id, date, semesterId,teacherId, vacation) != 0;
    }

    private boolean isExistTemporarySchedule(TemporarySchedule object, boolean vacation) {
        log.info("In isExistTemporarySchedule(object = [{}])", object);
            return temporaryScheduleRepository.isExistTemporarySchedule(object, vacation) != 0;
    }

    private boolean isExistTemporaryScheduleWithIgnoreId(TemporarySchedule object) {
        log.info("In isExistTemporarySchedule(object = [{}])", object);
        return temporaryScheduleRepository.isExistTemporaryScheduleWithIgnoreId(object) != 0;
    }
    private boolean isExistTemporaryScheduleByDateAndScheduleId(TemporarySchedule object, boolean vacation) {
        log.info("In isExistTemporaryScheduleByDateAndScheduleId(object = [{}])", object);
        return temporaryScheduleRepository.isExistTemporaryScheduleByDateAndScheduleId(object, vacation) != 0;
    }

    private boolean isExistTemporaryScheduleByDateAndScheduleIdWithIgnoreId(TemporarySchedule object, boolean vacation) {
        log.info("In isExistTemporaryScheduleByDateAndScheduleIdWithIgnoreId(object = [{}])", object);
        return temporaryScheduleRepository.isExistTemporaryScheduleByDateAndScheduleIdWithIgnoreId(object, vacation) != 0;
    }


    private void checkReferencedElement(TemporarySchedule object)  throws EntityNotFoundException{
        log.info("In checkReferenceExist(object = [{}])", object);
        //scheduleService.getById(object.getScheduleId());
        subjectService.getById(object.getSubject().getId());
        roomService.getById(object.getRoom().getId());
        groupService.getById(object.getGroup().getId());
        teacherService.getById(object.getTeacher().getId());
        periodService.getById(object.getPeriod().getId());
    }
}



