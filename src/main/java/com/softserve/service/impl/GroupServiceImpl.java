package com.softserve.service.impl;

import com.softserve.entity.Group;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.GroupRepository;
import com.softserve.service.GroupService;
import com.softserve.util.NullAwareBeanUtils;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.beanutils.BeanUtilsBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Slf4j
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
     * @throws EntityNotFoundException if Group with id doesn't exist
     */
    @Transactional(readOnly = true)
    @Override
    public Group getById(Long id) {
        log.info("In getById(id = [{}])",  id);
        Group group = groupRepository.getById(id);
        if (Objects.isNull(group)) {
            throw new EntityNotFoundException(Group.class, "id", id.toString());
        }
        return group;
    }

    /**
     * Method gets information about all groups from Repository
     * @return List of all groups
     */
    @Transactional(readOnly = true)
    @Override
    public List<Group> getAll() {
        log.info("In getAll()");
        return groupRepository.getAll();
    }

    /**
     * Method saves new group to Repository
     *
     * @param object Group entity with info to be saved
     * @return saved Group entity
     * @throws FieldAlreadyExistsException if Group with input title already exists
     */
    @Transactional
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
    @SneakyThrows
    @Transactional
    @Override
    public Group update(Group object) {
        log.info("In update(entity = [{}]", object);
        BeanUtilsBean beanUtils = new NullAwareBeanUtils();
        Group foundGroup = getById(object.getId());
        beanUtils.copyProperties(foundGroup, object);
        return groupRepository.update(foundGroup);
    }

    /**
     * Method deletes an existing group from Repository
     * @param object Group entity to be deleted
     * @return deleted Group entity
     */
    @Transactional
    @Override
    public Group delete(Group object) {
        log.info("In delete(entity = [{}])",  object);
        return groupRepository.delete(getById(object.getId()));
    }

    /**
     * Method finds if Group with title already exists
     * @param id Long id of Group
     * @param title String title of Group
     * @return true if Group with such title already exist
     */
    @Transactional(readOnly = true)
    @Override
    public boolean isGroupExistsWithTitleAndIgnoreWithId(Long id, String title) {
        log.info("In isGroupExistsWithTitleAndIgnoreWithId(id = [{}], title = [{}])", id, title);
        return groupRepository.countGroupsWithTitleAndIgnoreWithId(id, title) != 0;
    }


    /**
     * Method finds if Group with title already exists
     * @param title String title of Group
     * @return true if Group with such title already exist
     */
    @Transactional(readOnly = true)
    @Override
    public boolean isGroupExistsWithTitle(String title) {
        log.info("In isGroupExistsWithTitle(title = [{}])",  title);
        return groupRepository.countGroupsWithTitle(title) != 0;
    }

    /**
     * Method verifies if Group with id param exist in repository
     * @param id Long id of Group
     * @return true if Group with id param exist
     */
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
    @Override
    public List<Group> getDisabled() {
        log.info("Enter into getAll of getDisabled");
        return groupRepository.getDisabled();
    }
}
