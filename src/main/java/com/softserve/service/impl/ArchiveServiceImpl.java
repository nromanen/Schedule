//package com.softserve.service.impl;
//
//import com.softserve.dto.ScheduleFullForArchiveDTO;
//import com.softserve.dto.SemesterDTO;
//import com.softserve.exception.EntityNotFoundException;
//import com.softserve.repository.ArchiveRepository;
//import com.softserve.service.ArchiveService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//@Service
//@Slf4j
//@RequiredArgsConstructor
//@Transactional(readOnly = true)
//public class ArchiveServiceImpl implements ArchiveService {
//
//    private final ArchiveRepository archiveRepository;
//
//    @Override
//    public ScheduleFullForArchiveDTO getArchiveScheduleBySemesterId(Long semesterId) {
//        log.info("In getArchiveScheduleBySemesterId(semesterId = [{}])", semesterId);
//        return archiveRepository.getArchiveScheduleBySemesterId(semesterId)
//                .orElseThrow(() -> new EntityNotFoundException(
//                        ScheduleFullForArchiveDTO.class, "semesterId", semesterId.toString()));
//    }
//
//    @Override
//    public List<SemesterDTO> getAllSemestersInArchiveSchedule() {
//        log.info("In getAllSemestersInArchiveSchedule()");
//        return archiveRepository.getAllArchiveSchedule().stream()
//                .map(ScheduleFullForArchiveDTO::getSemester)
//                .toList();
//    }
//
//    @Override
//    @Transactional
//    public ScheduleFullForArchiveDTO saveScheduleForArchive(ScheduleFullForArchiveDTO scheduleFullForArchiveDTO) {
//        log.info("In saveScheduleForArchive(scheduleForArchiveDTO = [{}])", scheduleFullForArchiveDTO);
//        return archiveRepository.saveScheduleForArchive(scheduleFullForArchiveDTO);
//    }
//
//    @Override
//    @Transactional
//    public void deleteArchiveScheduleBySemesterId(Long semesterId) {
//        log.info("In deleteArchiveScheduleBySemesterId(semesterId = [{}])", semesterId);
//        archiveRepository.deleteArchiveScheduleBySemesterId(semesterId);
//    }
//}
