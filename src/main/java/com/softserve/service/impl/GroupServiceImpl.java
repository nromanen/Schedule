package com.softserve.service.impl;

import com.softserve.entity.Group;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.GroupRepository;
import com.softserve.service.GroupService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional
@Service
public class GroupServiceImpl  implements GroupService {

    private final GroupRepository groupRepository;

    @Autowired
    public GroupServiceImpl(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    /**
     * Method gets information from Repository for particular group with id parameter
     * @param id Identity number of the group
     * @return Group entity
     */
    @Override
    public Group getById(Long id) {

        log.info("Enter into getById method of {} with id {}", getClass().getName(), id);
        return groupRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Group.class, "id", id.toString()));
    }

    /**
     * Method gets information about all groups from Repository
     * @return List of all groups
     */
    @Override
    public List<Group> getAll() {
        log.info("Enter into getAll method of {}", getClass().getName());
        return groupRepository.getAll();
    }

    /**
     * Method saves new group to Repository
     * @param object Group entity with info to be saved
     * @return saved Group entity
     */
    @Override
    public Group save(Group object) {
        log.info("Enter into save method of {} with entity:{}", getClass().getName(), object );
        if (findByTitle(object.getTitle())){
            throw new FieldAlreadyExistsException(Group.class, "title", object.getTitle());
        }
        return groupRepository.save(object);
    }

    /**
     * Method updates information for an existing group in  Repository
     * @param object Group entity with info to be updated
     * @return updated Group entity
     */
    @Override
    public Group update(Group object) {
        log.info("Enter into update method of {} with entity:{}", getClass().getName(), object);
        if (findByTitle(object.getTitle())){
            throw new FieldAlreadyExistsException(Group.class, "title", object.getTitle());
        }
        return groupRepository.update(object);
    }

    /**
     * Method deletes an existing group from Repository
     * @param object Group entity to be deleted
     * @return deleted Group entity
     */
    @Override
    public Group delete(Group object) {
        log.info("Enter into delete method of {} with entity:{}", getClass().getName(), object);
        return groupRepository.delete(object);
    }

    /**
     * Method finds if Group with title already exists
     * @param title
     * @return true if Group with such title already exist
     */
    @Override
    public boolean findByTitle(String title) {
        log.info("Enter into findByTitle method  of {} with title:{}", getClass().getName(), title);
        return groupRepository.findByTitle(title).isPresent();
    }
}
