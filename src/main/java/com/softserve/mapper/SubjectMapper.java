package com.softserve.mapper;

import com.softserve.dto.GroupDTO;
import com.softserve.dto.SubjectDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Subject;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SubjectMapper {
    SubjectDTO subjectToSubjectDTO(Subject subject);
    Subject subjectDTOToSubject(SubjectDTO subjectDTO);

    List<SubjectDTO> subjectsToSubjectDTOs (List<Subject> subjects);
}
