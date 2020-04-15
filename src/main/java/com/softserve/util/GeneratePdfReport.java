package com.softserve.util;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.softserve.entity.Schedule;
import lombok.extern.slf4j.Slf4j;

import java.io.ByteArrayOutputStream;
import java.util.List;


@Slf4j
public class GeneratePdfReport {

    /**
     * The method used for generating byte array, which we convert into pdf in controller
     *
     * @param schedules for selected teacher and semester
     * @return ByteArrayOutputStream (schedule)
     */
    public ByteArrayOutputStream schedulesReport(List<Schedule> schedules) {
        log.info("Enter into schedulesReport method with list of schedules {}", schedules);

        ByteArrayOutputStream bys = null;
        try {
            Document document = new Document();
            document.setPageSize(PageSize.A4);
            document.setPageSize(PageSize.LETTER.rotate());
            bys = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, bys);
            document.open();
            PdfPTable table = new TableBuilder().createTable(schedules);
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            log.error(e.getMessage());
        }
        return bys;
    }
}

