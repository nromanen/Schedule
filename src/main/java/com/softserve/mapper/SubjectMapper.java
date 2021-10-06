package com.softserve.mapper;

import com.softserve.dto.SubjectWithTypeDTO;
import com.softserve.dto.SubjectDTO;
import com.softserve.dto.SubjectNameWithTypesDTO;
import com.softserve.entity.Subject;
import com.softserve.entity.enums.LessonType;
import org.mapstruct.Mapper;

import java.util.*;

@Mapper(componentModel = "spring")
public abstract class SubjectMapper {
    public abstract SubjectDTO subjectToSubjectDTO(Subject subject);
    public abstract Subject subjectDTOToSubject(SubjectDTO subjectDTO);

    public abstract List<SubjectDTO> subjectsToSubjectDTOs (List<Subject> subjects);

    public List<SubjectNameWithTypesDTO> subjectWithTypeDTOsToSubjectNameWithTypesDTOs(List<SubjectWithTypeDTO> subjects) {

        List<SubjectNameWithTypesDTO> subjectsNamesWithTypes = new ArrayList<>();

        for (SubjectWithTypeDTO subject : subjects) {
            SubjectNameWithTypesDTO subjectWithType = new SubjectNameWithTypesDTO();

            subjectWithType.setId(subject.getSubject().getId());
            subjectWithType.setName(subject.getSubject().getName());

            if (subjectsNamesWithTypes.contains(subjectWithType)) {
                subjectsNamesWithTypes.get(subjectsNamesWithTypes.indexOf(subjectWithType))
                        .getTypes().add(subject.getLessonType());

            } else {
                Set<LessonType> lessonTypes = new TreeSet<>();
                lessonTypes.add(subject.getLessonType());
                subjectWithType.setTypes(lessonTypes);
                subjectsNamesWithTypes.add(subjectWithType);
            }

        }
        return subjectsNamesWithTypes;
    }
}
