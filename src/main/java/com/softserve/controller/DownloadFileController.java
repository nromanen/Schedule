package com.softserve.controller;

import com.softserve.dto.ScheduleForGroupDTO;
import com.softserve.dto.ScheduleForTeacherDTO;
import com.softserve.mapper.TeacherMapper;
import com.softserve.service.ScheduleService;
import com.softserve.util.PdfReportGenerator;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;

@AllArgsConstructor
@RestController
@Tag(name = "Download files API")
@RequestMapping("/download")
@Slf4j
public class DownloadFileController {

    private final ScheduleService scheduleService;

    private String encodeFilename(String filename) {
        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8).replace("+", "%20");
        return "inline; filename=\"schedule.pdf\"; filename*=UTF-8''" + encoded;
    }

    @GetMapping(value = "/schedule-for-teacher-in-pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> teacherSchedulesReport(@RequestParam Long teacherId,
                                                                      @RequestParam Long semesterId,
                                                                      @RequestParam Locale language) {
        ScheduleForTeacherDTO schedule = scheduleService.getScheduleForTeacher(semesterId, teacherId);

        PdfReportGenerator generatePdfReport = new PdfReportGenerator();
        ByteArrayOutputStream bis = generatePdfReport.teacherScheduleReport(schedule, language);

        HttpHeaders headers = new HttpHeaders();
        String fileName = "schedule for "
                .concat(TeacherMapper.teacherDTOToTeacherForSite(schedule.getTeacher()))
                .concat(".pdf");
        headers.add(HttpHeaders.CONTENT_DISPOSITION, encodeFilename(fileName));

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(new ByteArrayInputStream(bis.toByteArray())));
    }

    @GetMapping(value = "/schedule-for-group-in-pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> groupSchedulesReport(@RequestParam Long groupId, @RequestParam Long semesterId,
                                                                    @RequestParam Locale language) {
        List<ScheduleForGroupDTO> schedules = scheduleService.getFullScheduleForGroup(semesterId, groupId);
        ScheduleForGroupDTO schedule = schedules.get(0);
        PdfReportGenerator generatePdfReport = new PdfReportGenerator();
        ByteArrayOutputStream bis = generatePdfReport.groupScheduleReport(schedule, language);

        HttpHeaders headers = new HttpHeaders();
        String fileName = "schedule for "
                .concat(schedule.getGroup().getTitle())
                .concat(" group.pdf");
        headers.add(HttpHeaders.CONTENT_DISPOSITION, encodeFilename(fileName));

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(new ByteArrayInputStream(bis.toByteArray())));
    }
}
