package com.softserve.util;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.softserve.dto.ScheduleForGroupDTO;
import com.softserve.entity.Schedule;
import lombok.extern.slf4j.Slf4j;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;


@Slf4j
public class PdfReportGenerator {

    /**
     * Method used for generating byte array, which we convert into pdf in controller
     *
     * @param schedules for selected teacher and semester
     * @return ByteArrayOutputStream (schedule)
     */
    public ByteArrayOutputStream teacherScheduleReport(List<Schedule> schedules) {
        log.info("Enter into schedulesReport method with list of schedules {}", schedules);

        ByteArrayOutputStream bys = null;
        try {
            Document document = new Document();
            document.setPageSize(PageSize.A4);
            document.setPageSize(PageSize.LETTER.rotate());
            bys = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, bys);
            document.open();
            PdfPTable table = new TeacherTableBuilder().createTable(schedules);
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            log.error(e.getMessage());
        }
        return bys;
    }

    /**
     * Method used for creating document with converting group schedule pdf table into byte array
     *
     * @param schedule for selected group and semester
     * @return ByteArrayOutputStream group schedule in byte array format
     */
    public ByteArrayOutputStream groupScheduleReport(ScheduleForGroupDTO schedule) {
        log.info("Enter into schedulesReport method with schedule {}", schedule);

        ByteArrayOutputStream bys = null;
        try {
            Document document = new Document();
            document.setPageSize(PageSize.A4);
            document.setPageSize(PageSize.LETTER.rotate());
            bys = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, bys);
            document.open();
            PdfPTable table = new GroupTableBuilder().createGroupTable(schedule);
            document.add(table);
            document.close();
        } catch (DocumentException | IOException e) {
            log.error(e.getMessage());
        }
        return bys;
    }
}

