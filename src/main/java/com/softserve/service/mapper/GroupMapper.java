package com.softserve.service.mapper;

import com.softserve.dto.GroupDTO;
import com.softserve.entity.Group;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GroupMapper {
    GroupDTO groupToGroupDTO(Group group);
    Group groupDTOToGroup(GroupDTO groupDTO);
}
