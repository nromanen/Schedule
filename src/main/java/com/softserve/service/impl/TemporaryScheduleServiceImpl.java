package com.softserve.service.impl;

import com.softserve.entity.Semester;
import com.softserve.entity.TemporarySchedule;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.repository.TemporaryScheduleRepository;
import com.softserve.service.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.util.*;

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
    private final LessonService lessonService;



    @Autowired
    public TemporaryScheduleServiceImpl(TemporaryScheduleRepository temporaryScheduleRepository, SemesterService semesterService, GroupService groupService,
                                        RoomService roomService, PeriodService periodService, SubjectService subjectService, TeacherService teacherService,
                                        LessonService lessonService) {
        this.temporaryScheduleRepository = temporaryScheduleRepository;
        this.semesterService = semesterService;
        this.groupService = groupService;
        this.roomService = roomService;
        this.periodService = periodService;
        this.subjectService = subjectService;
        this.teacherService = teacherService;
        this.lessonService = lessonService;
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
        Hibernate.initialize(temporarySchedule.getTeacher());
//        Hibernate.initialize(temporarySchedule.getTeacher().getSurname());
//        Hibernate.initialize(temporarySchedule.getSubject());
//        Hibernate.initialize(temporarySchedule.getRoom());
//        Hibernate.initialize(temporarySchedule.getGroup());
//        Hibernate.initialize(temporarySchedule.getPeriod());
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
    public List<TemporarySchedule> getAllByTeacher(Long teacherId) {
        log.info("Enter into getAllByTeacher of TemporaryScheduleServiceImpl");
        return temporaryScheduleRepository.getAllByTeacher(teacherId, semesterService.getCurrentSemester().getId());
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
        Semester semester = new Semester();
        semester.setId(semesterService.getCurrentSemester().getId());
        object.setSemester(semester);
        if(object.isVacation()){
            if(isExistVacationByDate(object.getDate(), object.getSemester().getId())){
                throw new EntityAlreadyExistsException("Vacation with this date already exists");
            }
        } else{
            if(isExistTemporarySchedule(object)){
                throw new EntityAlreadyExistsException("Entity with this parameters already exists");
            }else{
                checkReferencedElement(object);
            }
        }
        TemporarySchedule entity = temporaryScheduleRepository.save(object);
            return this.getById(entity.getId());
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
        Semester semester = new Semester();
        semester.setId(semesterService.getCurrentSemester().getId());
        object.setSemester(semester);
        if(object.isVacation()){
            if(isExistVacationByDate(object.getDate(), object.getSemester().getId())){
                throw new EntityAlreadyExistsException("Vacation with this date already exists");
            }
        } else{
            if(isExistTemporaryScheduleWithIgnoreId(object)){
                throw new EntityAlreadyExistsException("Entity with this parameters already exists");
            }else{
                checkReferencedElement(object);
            }
        }
        TemporarySchedule entity = temporaryScheduleRepository.update(object);
        return this.getById(entity.getId());
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


    private boolean isExistVacationByDate(LocalDate date, Long semesterId) {
        log.info("In isVacationByDate(date = [{}])", date);
        return temporaryScheduleRepository.isExistVacationByDate(date, semesterId) != 0;
    }

    private boolean isExistTemporarySchedule(TemporarySchedule object) {
        log.info("In isExistTemporarySchedule(object = [{}])", object);
        return temporaryScheduleRepository.isExistTemporarySchedule(object) != 0;
    }

    private boolean isExistTemporaryScheduleWithIgnoreId(TemporarySchedule object) {
        log.info("In isExistTemporarySchedule(object = [{}])", object);
        return temporaryScheduleRepository.isExistTemporaryScheduleWithIgnoreId(object) != 0;
    }


    private void checkReferencedElement(TemporarySchedule object) {
        log.info("In checkReferenceExist(object = [{}])", object);
        lessonService.getById(object.getLessonId());
        subjectService.getById(object.getSubject().getId());
        roomService.getById(object.getRoom().getId());
        groupService.getById(object.getGroup().getId());
        teacherService.getById(object.getTeacher().getId());
        periodService.getById(object.getPeriod().getId());
    }
}



