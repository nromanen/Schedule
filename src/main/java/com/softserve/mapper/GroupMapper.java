package com.softserve.mapper;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.GroupForUpdateDTO;
import com.softserve.entity.Group;
import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface GroupMapper {

    GroupDTO groupToGroupDTO(Group group);
    Group groupDTOToGroup(GroupDTO groupDTO);
    GroupForUpdateDTO groupToGroupForUpdateDTO(Group group);
    Group groupForUpdateDTOToGroup(GroupForUpdateDTO groupForUpdateDTO);

    List<GroupDTO> groupsToGroupDTOs(List<Group> groups);
}
