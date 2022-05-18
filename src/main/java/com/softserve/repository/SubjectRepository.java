package com.softserve.repository;

import com.softserve.dto.SubjectWithTypeDTO;
import com.softserve.entity.Subject;

import java.util.List;

public interface SubjectRepository extends BasicRepository<Subject, Long> {

    /**
     * The method used for getting number of subjects with name from database
     *
     * @param name String name used to find Subject
     * @return Long number of records with name
     */
    Long countSubjectsWithName(String name);

    /**
     * The method used for getting number of subjects with name from database
     *
     * @param id   Long id used to ignore Subject
     * @param name String name used to find Subject
     * @return Long number of records with name
     */
    Long countSubjectsWithNameAndIgnoreWithId(Long id, String name);

    /**
     * Method used to verify if Subject with such id exists
     *
     * @param id of the Subject
     * @return 0 if there is no Subject with such id, 1 if record with id exists
     */
    Long countBySubjectId(Long id);

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
