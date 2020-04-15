package com.softserve.controller;

import com.softserve.entity.Schedule;
import com.softserve.service.ScheduleService;
import com.softserve.util.GeneratePdfReport;
import io.swagger.annotations.Api;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping(value = "/pdfSchedule/{teacherId}/{semesterId}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> schedulesReport(@PathVariable Long teacherId, @PathVariable Long semesterId) {
        List<Schedule> schedules = scheduleService.getAllSchedulesByTeacherIdAndSemesterId(teacherId, semesterId);

        GeneratePdfReport generatePdfReport = new GeneratePdfReport();
        ByteArrayOutputStream bis = generatePdfReport.schedulesReport(schedules);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=schedule.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(new ByteArrayInputStream(bis.toByteArray())));
    }
}