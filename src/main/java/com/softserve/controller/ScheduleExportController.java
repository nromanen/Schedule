package com.softserve.controller;

import com.softserve.dto.ScheduleFullDTO;
import com.softserve.service.ScheduleExcelExportService;
import com.softserve.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/schedules")
@RequiredArgsConstructor
public class ScheduleExportController {

    private final ScheduleExcelExportService excelExportService;

    private final ScheduleService scheduleService;

    /**
     * Export schedule as XLSX file.
     *
     * @param semesterId the semester ID
     * @return XLSX file as byte array
     * @throws Exception if export fails
     */
    @GetMapping("/export/xlsx")
    public ResponseEntity<byte[]> exportXlsx(@RequestParam Long semesterId) throws Exception {
        ScheduleFullDTO data = scheduleService.getFullScheduleForSemester(semesterId);

        byte[] xlsx = excelExportService.exportToXlsx(data);

        String filename = "schedule_" + semesterId + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .contentLength(xlsx.length)
                .body(xlsx);
    }
}
