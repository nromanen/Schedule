package com.softserve.service;

import com.softserve.dto.SubjectWithTypeDTO;
import com.softserve.entity.Subject;

import java.util.List;

public interface SubjectService extends BasicService<Subject, Long> {
    boolean isSubjectExistsWithName(String name);

    boolean isSubjectExistsWithNameAndIgnoreWithId(Long id, String name);

    boolean isExistsWithId(Long id);

    List<Subject> getDisabled();

    List<SubjectWithTypeDTO> getSubjectsWithTypes(Long semesterId, Long teacherId);

}
