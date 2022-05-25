package com.softserve.service.impl;

import com.softserve.entity.RoomType;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.RoomTypeRepository;
import com.softserve.service.RoomTypeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional
@Service
public class RoomTypeServiceImpl implements RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    @Autowired
    public RoomTypeServiceImpl(RoomTypeRepository roomTypeRepository) {
        this.roomTypeRepository = roomTypeRepository;
    }

    /**
     * Method gets information from Repository for particular RoomType with id parameter
     *
     * @param id Identity number of the RoomType
     * @return RoomType entity
     */
    @Override
    public RoomType getById(Long id) {
        log.info("In getById(id = [{}])", id);
        return roomTypeRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(RoomType.class, "id", id.toString()));
    }

    /**
     * Method gets information about all RoomTypes from Repository
     *
     * @return List of all RoomTypes
     */
    @Override
    public List<RoomType> getAll() {
        log.info("In getAll()");
        return roomTypeRepository.getAll();
    }

    /**
     * Method saves new RoomType to Repository
     *
     * @param object RoomType entity with info to be saved
     * @return saved RoomType entity
     */
    @Override
    public RoomType save(RoomType object) {
        log.info("In save(entity = [{}]", object);
        if (isRoomTypeExistsWithDescription(object.getDescription())) {
            throw new FieldAlreadyExistsException(RoomType.class, "description", object.getDescription());
        }
        return roomTypeRepository.save(object);
    }

    /**
     * Method updates information for an existing group in  Repository
     *
     * @param object Group entity with info to be updated
     * @return updated Group entity
     */
    @Override
    public RoomType update(RoomType object) {
        log.info("In update(entity = [{}]", object);
        if (isExistsWithId(object.getId())) {
            if (isRoomTypeExistsWithDescription(object.getDescription())) {
                log.error("RoomType with Description [{}] already exists", object.getDescription());
                throw new FieldAlreadyExistsException(RoomType.class, "description", object.getDescription());
            }
            return roomTypeRepository.update(object);
        } else {
            throw new EntityNotFoundException(RoomType.class, "id", object.getId().toString());
        }
    }

    /**
     * Method deletes an existing RoomType from Repository
     *
     * @param object RoomType entity to be deleted
     * @return deleted RoomType entity
     */
    @Override
    public RoomType delete(RoomType object) {
        log.info("In delete(entity = [{}])", object);
        return roomTypeRepository.delete(object);
    }

    /**
     * Method finds if RoomType with description already exists
     *
     * @param description
     * @return true if RoomType with such description already exist
     */
    @Override
    public boolean isRoomTypeExistsWithDescription(String description) {
        log.info("In isRoomTypeExistsWithDescription(description = [{}])", description);
        return roomTypeRepository.countRoomTypesWithDescription(description) != 0;
    }

    /**
     * Method verifies if RoomType with id param exist in repository
     *
     * @param id
     * @return true if RoomType with id param exist
     */
    @Override
    public boolean isExistsWithId(Long id) {
        log.info("In isExistsWithId(id = [{}])", id);
        return roomTypeRepository.countByRoomTypeId(id) != 0;
    }
}
