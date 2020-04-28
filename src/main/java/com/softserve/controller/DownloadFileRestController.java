package com.softserve.controller;

import com.softserve.dto.ScheduleForGroupDTO;
import com.softserve.entity.Schedule;
import com.softserve.service.ScheduleService;
import com.softserve.util.PdfReportGenerator;
import io.swagger.annotations.Api;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@AllArgsConstructor
@RestController
@Api(tags = "Download files API")
@RequestMapping("/download")
@Slf4j
public class DownloadFileRestController {

    private final ScheduleService scheduleService;

    @GetMapping(value = "/schedule-for-teacher-in-pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> teacherSchedulesReport(@RequestParam(required = false) Long teacherId, @RequestParam(required = false) Long semesterId) {
        List<Schedule> schedules = scheduleService.getAllSchedulesByTeacherIdAndSemesterId(teacherId, semesterId);

        PdfReportGenerator generatePdfReport = new PdfReportGenerator();
        ByteArrayOutputStream bis = generatePdfReport.teacherScheduleReport(schedules);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=schedule.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(new ByteArrayInputStream(bis.toByteArray())));
    }

    @GetMapping(value = "/schedule-for-group-in-pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> groupSchedulesReport(@RequestParam Long groupId, @RequestParam Long semesterId) {
        List<ScheduleForGroupDTO> schedules = scheduleService.getFullScheduleForGroup(semesterId, groupId);
        ScheduleForGroupDTO schedule = schedules.get(0);
        PdfReportGenerator generatePdfReport = new PdfReportGenerator();
        ByteArrayOutputStream bis = generatePdfReport.groupScheduleReport(schedule);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=schedule.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(new ByteArrayInputStream(bis.toByteArray())));
    }
}