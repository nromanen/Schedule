package com.softserve.repository.impl;

import com.softserve.dto.ScheduleFullForArchiveDTO;
import com.softserve.repository.ArchiveRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class ArchiveRepositoryImpl implements ArchiveRepository {

    private final MongoOperations mongoOperations;

    @Autowired
    public ArchiveRepositoryImpl(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    /**
     * The method used for getting Optional of schedule from mongo database by semesterId
     *
     * @param semesterId Semester id for getting schedule by this id from mongo db
     * @return Optional of schedule
     */
    @Override
    public Optional<ScheduleFullForArchiveDTO> getArchiveScheduleBySemesterId(Long semesterId) {
        log.info("In getArchiveScheduleBySemesterId with semesterId = {}", semesterId);
        return Optional.ofNullable(
                mongoOperations.findOne(new Query().addCriteria(Criteria.where("semesterDTO.id").is(semesterId)), ScheduleFullForArchiveDTO.class));
    }

    /**
     * The method used for getting all of archived schedules from mongo database
     *
     * @return list of schedules
     */
    @Override
    public List<ScheduleFullForArchiveDTO> getAllArchiveSchedule() {
        log.info("In getAllArchiveSchedule");
        return mongoOperations.findAll(ScheduleFullForArchiveDTO.class);
    }

    /**
     * The method used for save schedule in mongo database
     *
     * @param fullForArchiveDTO object ScheduleFullForArchiveDTO for save schedule in mongo db
     * @return ScheduleFullForArchiveDTO object
     */
    @Override
    public ScheduleFullForArchiveDTO saveScheduleForArchive(ScheduleFullForArchiveDTO fullForArchiveDTO) {
        log.info("In saveScheduleForArchive with scheduleForArchiveDTO = {}", fullForArchiveDTO);
        return mongoOperations.insert(fullForArchiveDTO);
    }

    /**
     * The method used for delete schedule from mongo database by semesterId
     *
     * @param semesterId Semester id use for delete schedule by this id from mongo db
     */
    @Override
    public void deleteArchiveScheduleBySemesterId(Long semesterId) {
        log.info("In removeArchiveScheduleBySemesterId with semesterId = {}", semesterId);
        mongoOperations.remove(new Query().addCriteria(Criteria.where("semesterDTO.id").is(semesterId)), ScheduleFullForArchiveDTO.class);
    }
}
