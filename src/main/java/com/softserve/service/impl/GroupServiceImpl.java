package com.softserve.service.impl;

import com.softserve.entity.Group;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.GroupRepository;
import com.softserve.service.GroupService;
import com.softserve.service.SemesterService;
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
    private final SemesterService semesterService;


    @Autowired
    public GroupServiceImpl(GroupRepository groupRepository, SemesterService semesterService) {
        this.groupRepository = groupRepository;
        this.semesterService = semesterService;
    }

    /**
     * Method gets information from Repository for particular group with id parameter
     * @param id Identity number of the group
     * @return Group entity
     */
    @Override
    public Group getById(Long id) {
        log.info("In getById(id = [{}])",  id);
        return groupRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Group.class, "id", id.toString()));
    }

    /**
     * Method gets information about all groups from Repository
     * @return List of all groups
     */
    @Override
    public List<Group> getAll() {
        log.info("In getAll()");
        return groupRepository.getAll();
    }

    /**
     * Method saves new group to Repository
     * @param object Group entity with info to be saved
     * @return saved Group entity
     */
    @Override
    public Group save(Group object) {
        log.info("In save(entity = [{}]", object);
        if (isGroupExistsWithTitle(object.getTitle())){
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
        log.info("In update(entity = [{}]", object);
        if (isExistsWithId(object.getId())){
            if (isGroupExistsWithTitleAndIgnoreWithId(object.getId(), object.getTitle())){
                log.error("Group with title [{}] already exists", object.getTitle());
                throw new FieldAlreadyExistsException(Group.class, "title", object.getTitle());
            }
            return groupRepository.update(object);
        }
        else {
            throw new EntityNotFoundException(Group.class, "id", object.getId().toString());
        }
    }

    /**
     * Method deletes an existing group from Repository
     * @param object Group entity to be deleted
     * @return deleted Group entity
     */
    @Override
    public Group delete(Group object) {
        log.info("In delete(entity = [{}])",  object);
        return groupRepository.delete(object);
    }

    /**
     * Method finds if Group with title already exists
     * @param id
     * @param title
     * @return true if Group with such title already exist
     */
    @Override
    public boolean isGroupExistsWithTitleAndIgnoreWithId(Long id, String title) {
        log.info("In isGroupExistsWithTitleAndIgnoreWithId(id = [{}], title = [{}])", id, title);
        return groupRepository.countGroupsWithTitleAndIgnoreWithId(id, title) != 0;
    }


    /**
     * Method finds if Group with title already exists
     * @param title
     * @return true if Group with such title already exist
     */
    @Override
    public boolean isGroupExistsWithTitle(String title) {
        log.info("In isGroupExistsWithTitle(title = [{}])",  title);
        return groupRepository.countGroupsWithTitle(title) != 0;
    }

    /**
     * Method verifies if Group with id param exist in repository
     * @param id
     * @return true if Group with id param exist
     */
    @Override
    public boolean isExistsWithId(Long id) {
        log.info("In isExistsWithId(id = [{}])",  id);
        return groupRepository.countByGroupId(id)!=0;
    }
    /**
     * The method used for getting all disabled groups
     *
     * @return list of disabled groups
     */
    @Override
    public List<Group> getDisabled() {
        log.info("Enter into getAll of getDisabled");
        return groupRepository.getDisabled();
    }

    /**
     * The method used for getting all groups for semester
     *
     * @return list of groups for semester
     */
    @Override
    public List<Group> getGroupsBySemesterId(Long semesterId){
        log.info("Enter into getGroupsBySemesterId");
        return semesterService.getById(semesterId).getGroups();
    }

    /**
     * The method used for getting all groups for current semester
     *
     * @return list of groups for current semester
     */
    @Override
    public List<Group> getGroupsByCurrentSemester(){
        log.info("Enter into getGroupsByCurrentSemester");
        return semesterService.getCurrentSemester().getGroups();
    }
}
