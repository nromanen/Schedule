package com.softserve.service;

import com.softserve.dto.SubjectWithTypeDTO;
import com.softserve.entity.Subject;

import java.util.List;

public interface SubjectService extends BasicService<Subject, Long> {

    /**
     * Method finds if Subject with name already exists
     *
     * @param name subject name
     * @return true if Subject with such name already exist
     */
    boolean isSubjectExistsWithName(String name);

    /**
     * Method finds if Subject with name already exists
     *
     * @param id   subject id
     * @param name subject name
     * @return true if Subject with such name already exist
     */
    boolean isSubjectExistsWithNameAndIgnoreWithId(Long id, String name);

    /**
     * Method verifies if Subject with id param exist in repository
     *
     * @param id subject id
     * @return true if Subject with id param exist
     */
    boolean isExistsWithId(Long id);

    /**
     * The method used for getting all disabled subjects
     *
     * @return list of disabled subjects
     */
    List<Subject> getDisabled();

    /**
     * The method used for getting subjects with their types from database
     *
     * @param semesterId Long semester from which subjects will be taken
     * @param teacherId  Long teacher who teaches subjects
     * @return List of subjects with their types
     */
    List<SubjectWithTypeDTO> getSubjectsWithTypes(Long semesterId, Long teacherId);

}
