package com.softserve.util;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.softserve.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.text.MessageFormat;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.Objects;
import java.util.TreeSet;
import java.util.stream.Collectors;


@Slf4j
public class GroupTableBuilder {

    private static final String EMPTY_CELL = "--//--";
    private Style style = new Style();

    /**
     * Method used for generating group schedule table in pdf
     *
     * @param schedule for selected group and semester
     * @return PdfPTable schedule for group
     * @throws DocumentException when creating table failed
     * @throws IOException       when there's no needed resource (font file)
     */
    public PdfPTable createGroupTable(ScheduleForGroupDTO schedule) throws DocumentException, IOException {
        log.info("Enter into createGroupTable method with schedule {}", schedule);

        // getting number of columns, setting columns width when creating main table
        int numColumns = schedule.getDays().size() + 1;
        PdfPTable table = new PdfPTable(numColumns);
        table.setWidthPercentage(100);
        float columnWidthAverage = 7f / table.getNumberOfColumns();
        //1st column width is about twice less than the others
        float firstColumnWidth = columnWidthAverage / 1.5f;
        float otherColumnWidth = (7f - firstColumnWidth) / (table.getNumberOfColumns() - 1);
        float[] columnsWidth = new float[numColumns];
        columnsWidth[0] = firstColumnWidth;
        for (int i = 1; i < numColumns; i++) {
            columnsWidth[i] = otherColumnWidth;
        }
        table.setWidths(columnsWidth);

        //loading Times new roman font from sources
        BaseFont baseFont = BaseFont.createFont(Objects.requireNonNull(getClass().getClassLoader()
                .getResource("font/times.ttf")).toString(), BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);

        //creating table title cell
        table.addCell(createTableTitleCell(baseFont, table, schedule));

        //creating header cells
        Font headFont = new Font(baseFont, 12, Font.BOLD, BaseColor.BLACK);
        PdfPCell header = new PdfPCell(new Phrase("Period", headFont));
        style.headerCellStyle(header);
        table.addCell(header);

        // getting all days from schedule, putting em into cells
        for (DaysOfWeekWithClassesForGroupDTO days : schedule.getDays()) {
            header = new PdfPCell(new Phrase(StringUtils.capitalize(days.getDay().toString().toLowerCase()), headFont));
            style.headerCellStyle(header);
            table.addCell(header);
        }

        // getting all unique periods from schedule
        TreeSet<PeriodDTO> periods = getAllPeriods(schedule);

        // creating table cells with values
        PdfPCell cell;
        Font cellFont = new Font(baseFont, 11, Font.NORMAL, BaseColor.BLACK);

        //getting in first loop layer - iterating every period
        for (PeriodDTO period : periods) {
            //first column is period
            cell = new PdfPCell(new Phrase(period.getName() + "\n\n" +
                    period.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm"))
                    + "-" + period.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm")), headFont));
            style.periodCellStyle(cell);
            table.addCell(cell);
            //getting in second loop layer - iterating days
            for (DaysOfWeekWithClassesForGroupDTO day : schedule.getDays()) {
                cell = cellBuilder(day, period, cellFont);
                table.addCell(cell);
            }
        }
        return table;
    }

    // generating schedule text in table's cell
    private void generateCellStringValue(StringBuilder baseText, LessonsInScheduleDTO lessons) {
        String subjectName = lessons.getSubjectForSite();
        String lessonType = lessons.getLessonType().toLowerCase();
        String teacher = lessons.getTeacherForSite();
        String room = lessons.getRoom().getName();
        baseText.append(subjectName).append(",\n")
                .append(lessonType).append(",\n")
                .append(teacher).append(",\n")
                .append(room);
    }

    // creating table title cell
    private PdfPCell createTableTitleCell(BaseFont baseFont, PdfPTable table, ScheduleForGroupDTO schedule) {
        log.info("Enter into createTableTitleCell method with baseFont {} table {} and schedule {}", baseFont, table, schedule);

        Font titleFont = new Font(baseFont, 14, Font.BOLD, BaseColor.WHITE);
        String scheduleTitle = MessageFormat.format("Schedule for {0} group", schedule.getGroup().getTitle());
        PdfPCell cellTitle = new PdfPCell(new Phrase(scheduleTitle, titleFont));
        cellTitle.setColspan(table.getNumberOfColumns());
        style.titleCellStyle(cellTitle);
        return cellTitle;
    }

    // getting all periods from schedule using TreeSet to avoid duplicating values, then sorting them by start time
    private TreeSet<PeriodDTO> getAllPeriods(ScheduleForGroupDTO schedule) {
        log.info("Enter into getAllPeriods method with schedule {}", schedule);

        return schedule.getDays().stream()
                .flatMap(s -> s.getClasses().stream())
                .map(ClassesInScheduleForGroupDTO::getPeriod)
                .collect(Collectors.toCollection(
                        () -> new TreeSet<>(
                                Comparator.comparing(PeriodDTO::getStartTime)
                        )
                        )
                );
    }

    // creating main table cells depending on whether they are odd or even
    private PdfPCell cellBuilder(DaysOfWeekWithClassesForGroupDTO day, PeriodDTO period, Font cellFont) {
        log.info("Enter into cellBuilder method with day {} period {} and cellFont {}", day, period, cellFont);

        PdfPCell cell = new PdfPCell(new Phrase(EMPTY_CELL, cellFont));
        StringBuilder daySchedule = new StringBuilder("");
        for (int k = 0; k < day.getClasses().size(); k++) {
            // filling in column raws checking needed period
            if (day.getClasses().get(k).getPeriod().equals(period)) {
                //checking if odd and even lessons r equal
                if (day.getClasses().get(k).getWeeks().getEven() != null &&
                        day.getClasses().get(k).getWeeks().getEven().equals(day.getClasses().get(k).getWeeks().getOdd())) {
                    generateCellStringValue(daySchedule, day.getClasses().get(k).getWeeks().getEven());
                    cell = new PdfPCell(new Phrase(String.valueOf(daySchedule), cellFont));
                } else {
                    // creating new inner table with two cells - odd and even
                    PdfPTable inner = new PdfPTable(1);
                    StringBuilder upperInnerCellString = new StringBuilder("");
                    StringBuilder lowerInnerCellString = new StringBuilder("");
                    PdfPCell upperInnerCell;
                    PdfPCell lowerInnerCell;
                    //upper (odd) cell
                    if (day.getClasses().get(k).getWeeks().getOdd() == null) {
                        upperInnerCell = new PdfPCell(new Phrase(EMPTY_CELL, cellFont));
                    } else {
                        generateCellStringValue(upperInnerCellString, day.getClasses().get(k).getWeeks().getOdd());
                        upperInnerCell = new PdfPCell(new Phrase(String.valueOf(upperInnerCellString), cellFont));
                    }
                    style.innerValueCellStyle(upperInnerCell);
                    upperInnerCell.setBorderWidthBottom(0.5f);
                    inner.addCell(upperInnerCell);
                    //lower (even) cell
                    if (day.getClasses().get(k).getWeeks().getEven() == null) {
                        lowerInnerCell = new PdfPCell(new Phrase(EMPTY_CELL, cellFont));
                    } else {
                        generateCellStringValue(lowerInnerCellString, day.getClasses().get(k).getWeeks().getEven());
                        lowerInnerCell = new PdfPCell(new Phrase(String.valueOf(lowerInnerCellString), cellFont));
                    }
                    style.innerValueCellStyle(lowerInnerCell);
                    inner.addCell(lowerInnerCell);
                    // adding inner table to main table's cell
                    cell = new PdfPCell(inner);
                }
            }
        }
        style.valueCellStyle(cell);
        return cell;
    }
}
