package com.softserve.mapper;

import com.softserve.dto.SubjectWithTypePOJO;
import com.softserve.dto.SubjectDTO;
import com.softserve.dto.SubjectWithTypesDTO;
import com.softserve.entity.Subject;
import com.softserve.entity.enums.LessonType;
import org.mapstruct.Mapper;

import java.util.*;

@Mapper(componentModel = "spring")
public abstract class SubjectMapper {
    public abstract SubjectDTO subjectToSubjectDTO(Subject subject);
    public abstract Subject subjectDTOToSubject(SubjectDTO subjectDTO);

    public abstract List<SubjectDTO> subjectsToSubjectDTOs (List<Subject> subjects);

    public List<SubjectWithTypesDTO> subjectsToSubjectWithTypeDTOs(List<SubjectWithTypePOJO> subjects) {

        List<SubjectWithTypesDTO> subjectsWithType = new ArrayList<>();

        for (SubjectWithTypePOJO subject : subjects) {
            SubjectWithTypesDTO subjectWithType = new SubjectWithTypesDTO();

            subjectWithType.setId(subject.getSubject().getId());
            subjectWithType.setName(subject.getSubject().getName());

            if (subjectsWithType.contains(subjectWithType)) {
                subjectsWithType.get(subjectsWithType.indexOf(subjectWithType))
                        .getTypes().add(subject.getLessonType());

            } else {
                Set<LessonType> lessonTypes = new TreeSet<>();
                lessonTypes.add(subject.getLessonType());
                subjectWithType.setTypes(lessonTypes);
                subjectsWithType.add(subjectWithType);
            }

        }
        return subjectsWithType;
    }
}
