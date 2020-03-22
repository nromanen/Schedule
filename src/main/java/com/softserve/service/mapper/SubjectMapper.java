package com.softserve.service.mapper;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.SubjectDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Subject;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SubjectMapper {
    SubjectDTO subjectToSubjectDTO(Subject subject);
    Subject subjectDTOToSubject(SubjectDTO subjectDTO);
}
