package com.softserve.service.impl;

import com.softserve.dto.SubjectDTO;
import com.softserve.dto.SubjectNameWithTypesDTO;
import com.softserve.entity.Subject;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.mapper.SubjectMapper;
import com.softserve.repository.SubjectRepository;
import com.softserve.service.SubjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final SubjectMapper subjectMapper;

    @Override
    @Transactional(readOnly = true)
    public SubjectDTO getById(Long id) {
        log.info("Getting subject by id: {}", id);
        Subject subject = findSubjectById(id);
        return subjectMapper.subjectToSubjectDTO(subject);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectDTO> getAll() {
        log.info("Getting all subjects");
        List<Subject> subjects = subjectRepository.getAll();
        return subjectMapper.subjectsToSubjectDTOs(subjects);
    }

    @Override
    public SubjectDTO save(SubjectDTO subjectDTO) {
        log.info("Saving subject: {}", subjectDTO);

        if (isSubjectExistsWithName(subjectDTO.getName())) {
            log.error("Subject with name {} already exists", subjectDTO.getName());
            throw new FieldAlreadyExistsException(Subject.class, "name", subjectDTO.getName());
        }

        Subject subject = subjectMapper.subjectDTOToSubject(subjectDTO);
        Subject saved = subjectRepository.save(subject);
        return subjectMapper.subjectToSubjectDTO(saved);
    }

    @Override
    public SubjectDTO update(SubjectDTO subjectDTO) {
        log.info("Updating subject: {}", subjectDTO);

        if (!isExistsWithId(subjectDTO.getId())) {
            throw new EntityNotFoundException(Subject.class, "id", subjectDTO.getId().toString());
        }

        if (isSubjectExistsWithNameAndIgnoreWithId(subjectDTO.getId(), subjectDTO.getName())) {
            log.error("Subject with name {} already exists", subjectDTO.getName());
            throw new FieldAlreadyExistsException(Subject.class, "name", subjectDTO.getName());
        }

        Subject subject = subjectMapper.subjectDTOToSubject(subjectDTO);
        Subject updated = subjectRepository.update(subject);
        return subjectMapper.subjectToSubjectDTO(updated);
    }

    @Override
    public void deleteById(Long id) {
        log.info("Deleting subject by id: {}", id);
        Subject subject = findSubjectById(id);
        subjectRepository.delete(subject);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectDTO> getDisabled() {
        log.info("Getting disabled subjects");
        List<Subject> subjects = subjectRepository.getDisabled();
        return subjectMapper.subjectsToSubjectDTOs(subjects);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectNameWithTypesDTO> getSubjectsWithTypes(Long semesterId, Long teacherId) {
        log.info("Getting subjects with types for semester: {} and teacher: {}", semesterId, teacherId);
        return subjectMapper.subjectWithTypeDTOsToSubjectNameWithTypesDTOs(
                subjectRepository.getSubjectsWithTypes(semesterId, teacherId));
    }

    // ==================== Private Helper Methods ====================

    private Subject findSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Subject.class, "id", id.toString()));
    }

    private boolean isSubjectExistsWithName(String name) {
        return subjectRepository.countSubjectsWithName(name) != 0;
    }

    private boolean isSubjectExistsWithNameAndIgnoreWithId(Long id, String name) {
        return subjectRepository.countSubjectsWithNameAndIgnoreWithId(id, name) != 0;
    }

    private boolean isExistsWithId(Long id) {
        return subjectRepository.countBySubjectId(id) != 0;
    }
}
