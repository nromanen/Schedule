package com.softserve.service;

import com.softserve.dto.SubjectWithTypePOJO;
import com.softserve.entity.Subject;
import java.util.List;

public interface SubjectService extends BasicService<Subject, Long> {
    boolean isSubjectExistsWithName(String name);
    boolean isSubjectExistsWithNameAndIgnoreWithId(Long id, String name);
    boolean isExistsWithId(Long id);
    List<Subject> getDisabled();
    List<SubjectWithTypePOJO> getForTeacherBySemesterId(Long semesterId, Long teacherId);

}
