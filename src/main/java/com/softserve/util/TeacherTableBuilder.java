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
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Slf4j
public class TeacherTableBuilder {

    private Style style = new Style();
    private static final String EMPTY_CELL = "--//--";

    /**
     * Method used for generating tables (teacher schedule) in pdf
     *
     * @param schedule for selected teacher and semester
     * @return PdfPTable schedule for teacher
     * @throws DocumentException when creating table failed
     * @throws IOException       when there's no needed resource (font file)
     */
    public PdfPTable createTeacherTable(ScheduleForTeacherDTO schedule) throws DocumentException, IOException {
        log.info("Enter into createGroupTable method with list of schedules {}", schedule);

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
        Font titleFont = new Font(baseFont, 14, Font.BOLD, BaseColor.WHITE);
        String scheduleTitle = MessageFormat.format("Schedule for {0} {1} {2}, {3}",
                schedule.getTeacher().getSurname(), schedule.getTeacher().getName(),
                schedule.getTeacher().getPatronymic(), schedule.getTeacher().getPosition());
        PdfPCell cellTitle = new PdfPCell(new Phrase(scheduleTitle, titleFont));
        cellTitle.setColspan(table.getNumberOfColumns());
        style.titleCellStyle(cellTitle);
        table.addCell(cellTitle);

        //creating header cells
        Font headFont = new Font(baseFont, 12, Font.BOLD, BaseColor.BLACK);
        PdfPCell header = new PdfPCell(new Phrase("Period", headFont));
        style.headerCellStyle(header);
        table.addCell(header);

        // getting all days from schedule, putting em into cells
        for (DaysOfWeekWithClassesForTeacherDTO days : schedule.getDays()) {
            header = new PdfPCell(new Phrase(StringUtils.capitalize(days.getDay().toString().toLowerCase()), headFont));
            style.headerCellStyle(header);
            table.addCell(header);
        }

        // getting all periods from schedule using TreeSet to avoid duplicating values, then sorting them by start time
        TreeSet<PeriodDTO> periods = schedule.getDays().stream()
                .flatMap(s -> Stream.of(s.getEvenWeek().getPeriods(), s.getOddWeek().getPeriods()))
                .flatMap(Collection::stream)
                .map(ClassForTeacherScheduleDTO::getPeriod)
                .collect(Collectors.toCollection(
                        () -> new TreeSet<>(
                                Comparator.comparing(PeriodDTO::getStartTime)
                        )
                        )
                );

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
            for (DaysOfWeekWithClassesForTeacherDTO day : schedule.getDays()) {
                StringBuilder daySchedule = new StringBuilder("");
                //getting odd and even classes by day and period
                ClassForTeacherScheduleDTO oddClasses = getClassByPeriod(day.getOddWeek().getPeriods(), period);
                ClassForTeacherScheduleDTO evenClasses = getClassByPeriod(day.getEvenWeek().getPeriods(), period);
                // building cells
                if (oddClasses == null && evenClasses == null) {
                    cell = new PdfPCell(new Phrase(EMPTY_CELL, cellFont));
                } else if (oddClasses != null && evenClasses != null && oddClasses.getLessons().equals(evenClasses.getLessons())) {
                    cellStringValue(daySchedule, oddClasses.getLessons());
                    cell = new PdfPCell(new Phrase(String.valueOf(daySchedule), cellFont));
                } else {
                    // creating new inner table with two cells - odd and even
                    PdfPTable inner = new PdfPTable(1);
                    StringBuilder upperInnerCellString = new StringBuilder("");
                    StringBuilder lowerInnerCellString = new StringBuilder("");
                    PdfPCell upperInnerCell = new PdfPCell(new Phrase(EMPTY_CELL, cellFont));
                    PdfPCell lowerInnerCell = new PdfPCell(new Phrase(EMPTY_CELL, cellFont));
                    // upper (odd) cell
                    if (oddClasses != null && oddClasses.getPeriod().equals(period) && !oddClasses.getLessons().isEmpty()) {
                        cellStringValue(upperInnerCellString, oddClasses.getLessons());
                        upperInnerCell = new PdfPCell(new Phrase(String.valueOf(upperInnerCellString), cellFont));
                    }
                    style.innerValueCellStyle(upperInnerCell);
                    upperInnerCell.setBorderWidthBottom(0.5f);
                    inner.addCell(upperInnerCell);
                    // lower (even) cell
                    if (evenClasses != null && evenClasses.getPeriod().equals(period) && !evenClasses.getLessons().isEmpty()) {
                        cellStringValue(lowerInnerCellString, evenClasses.getLessons());
                        lowerInnerCell = new PdfPCell(new Phrase(String.valueOf(lowerInnerCellString), cellFont));
                    }
                    style.innerValueCellStyle(lowerInnerCell);
                    inner.addCell(lowerInnerCell);
                    // adding inner table to main table's cell
                    cell = new PdfPCell(inner);
                }
                // formatting and adding cell to table
                style.valueCellStyle(cell);
                table.addCell(cell);
            }
        }
        return table;
    }

    /**
     * Method used for generating schedule text in table's cell
     *
     * @param baseText empty string, which we update
     * @param lessons  from which we take needed string values
     */
    private void cellStringValue(StringBuilder baseText, List<LessonForTeacherScheduleDTO> lessons) {
        HashSet<String> groups = new HashSet<>();
        HashSet<String> subjectNames = new HashSet<>();
        HashSet<String> lessonTypes = new HashSet<>();
        HashSet<String> rooms = new HashSet<>();

        for (LessonForTeacherScheduleDTO lesson : lessons) {
            groups.add(lesson.getGroup().getTitle());
            subjectNames.add(lesson.getSubjectForSite());
            lessonTypes.add(lesson.getLessonType().toString().toLowerCase());
            rooms.add(lesson.getRoom());
        }

        String group = String.join(", ", groups);
        String subjectName = String.join(", ", subjectNames);
        String lessonType = String.join(", ", lessonTypes);
        String room = String.join(", ", rooms);

        baseText.append(group).append(",\n")
                .append(subjectName).append(",\n")
                .append(lessonType).append(",\n")
                .append(room);
    }

    /**
     * Method used for getting ClassForTeacherScheduleDTO by period
     *
     * @param classes list of all teacher's classes
     * @param period  we r using to filter list
     * @return ClassForTeacherScheduleDTO class by period
     */
    private ClassForTeacherScheduleDTO getClassByPeriod(List<ClassForTeacherScheduleDTO> classes, PeriodDTO period) {
        for (ClassForTeacherScheduleDTO clazz : classes) {
            if (clazz.getPeriod().equals(period))
                return clazz;
        }
        return null;
    }
}