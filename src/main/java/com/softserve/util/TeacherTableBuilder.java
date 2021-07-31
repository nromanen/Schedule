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
     * Method used for generating teacher schedule table in pdf
     *
     * @param schedule for selected teacher and semester
     * @param language for selected language
     * @return PdfPTable schedule for teacher
     * @throws DocumentException when creating table failed
     * @throws IOException       when there's no needed resource (font file)
     */
    public PdfPTable createTeacherTable(ScheduleForTeacherDTO schedule, Locale language) throws DocumentException, IOException {
        log.info("Enter into createTeacherTable method with schedule {}", schedule);

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
        table.addCell(createTableTitleCell(baseFont, table, schedule, language));

        //creating header cells
        Font headFont = new Font(baseFont, 12, Font.BOLD, BaseColor.BLACK);
        PdfPCell header = new PdfPCell(
                new Phrase(StringUtils.capitalize(Translator.getInstance().getTranslation("period", language))
                , headFont)
        );
        style.headerCellStyle(header);
        table.addCell(header);
        // getting all days from schedule, putting em into cells
        for (DaysOfWeekWithClassesForTeacherDTO days : schedule.getDays()) {
            String day = Translator.getInstance().getTranslation(days.getDay().toString().toLowerCase(), language);
            header = new PdfPCell(new Phrase(StringUtils.capitalize(day), headFont));
            style.headerCellStyle(header);
            table.addCell(header);
        }

        //getting all unique periods
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
            for (DaysOfWeekWithClassesForTeacherDTO day : schedule.getDays()) {
                //getting odd and even classes by day and period
                ClassForTeacherScheduleDTO oddClasses = getClassByPeriod(day.getOddWeek().getPeriods(), period);
                ClassForTeacherScheduleDTO evenClasses = getClassByPeriod(day.getEvenWeek().getPeriods(), period);
                // building cells
                table.addCell(cellBuilder(oddClasses, evenClasses, cellFont));
            }
        }
        return table;
    }

    // generating schedule text in table's cell
    private void generateCellStringValue(StringBuilder baseText, List<LessonForTeacherScheduleDTO> lessons) {
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

    // getting ClassForTeacherScheduleDTO by period
    private ClassForTeacherScheduleDTO getClassByPeriod(List<ClassForTeacherScheduleDTO> classes, PeriodDTO period) {
        log.info("Enter into getClassByPeriod method with classes {} and period {}", classes, period);

        ClassForTeacherScheduleDTO classForTeacherScheduleDTO = new ClassForTeacherScheduleDTO();
        classForTeacherScheduleDTO.setLessons(Collections.emptyList());
        for (ClassForTeacherScheduleDTO clazz : classes) {
            if (clazz.getPeriod().equals(period))
                return clazz;
        }
        return classForTeacherScheduleDTO;
    }

    // creating table title cell
    private PdfPCell createTableTitleCell(BaseFont baseFont, PdfPTable table, ScheduleForTeacherDTO schedule, Locale language) {
        log.info("Enter into createTableTitleCell method with baseFont {} table {} and schedule {}", baseFont, table, schedule);
        Font titleFont = new Font(baseFont, 14, Font.BOLD, BaseColor.WHITE);
        String scheduleTitle = MessageFormat.format("{0} {1} {2} {3}, {4}",
                StringUtils.capitalize(Translator.getInstance().getTranslation("schedule for", language)) ,
                schedule.getTeacher().getSurname(), schedule.getTeacher().getName(),
                schedule.getTeacher().getPatronymic(), schedule.getTeacher().getPosition());
        PdfPCell cellTitle = new PdfPCell(new Phrase(scheduleTitle, titleFont));
        cellTitle.setColspan(table.getNumberOfColumns());
        style.titleCellStyle(cellTitle);
        return cellTitle;
    }

    // getting all periods from schedule using TreeSet to avoid duplicating values, then sorting them by start time
    private TreeSet<PeriodDTO> getAllPeriods(ScheduleForTeacherDTO schedule) {
        log.info("Enter into getAllPeriods method with schedule {}", schedule);

        return schedule.getDays().stream()
                .flatMap(s -> Stream.of(s.getEvenWeek().getPeriods(), s.getOddWeek().getPeriods()))
                .flatMap(Collection::stream)
                .map(ClassForTeacherScheduleDTO::getPeriod)
                .collect(Collectors.toCollection(
                        () -> new TreeSet<>(
                                Comparator.comparing(PeriodDTO::getStartTime)
                        )
                        )
                );
    }

    // creating main table cells depending on whether they are odd or even
    private PdfPCell cellBuilder(ClassForTeacherScheduleDTO oddClasses, ClassForTeacherScheduleDTO evenClasses, Font cellFont) {
        log.info("Enter into cellBuilder method with oddClasses {} evenClasses {} and cellFont {}", oddClasses, evenClasses, cellFont);

        PdfPCell cell;
        StringBuilder daySchedule = new StringBuilder("");
        // creating one whole empty cell, if both odd and even lists of lessons r empty
        if (oddClasses.getLessons().isEmpty() && evenClasses.getLessons().isEmpty()) {
            cell = new PdfPCell(new Phrase(EMPTY_CELL, cellFont));
        }
        // creating one whole cell, if odd and even lists of lessons r equal
        else if (oddClasses.getLessons().equals(evenClasses.getLessons())) {
            generateCellStringValue(daySchedule, oddClasses.getLessons());
            cell = new PdfPCell(new Phrase(String.valueOf(daySchedule), cellFont));
        }
        // dividing one cell into odd (upper) and even (lower) cells and filling them
        else {
            // creating new inner table with two cells - odd and even
            PdfPTable inner = new PdfPTable(1);
            StringBuilder upperInnerCellString = new StringBuilder("");
            StringBuilder lowerInnerCellString = new StringBuilder("");
            PdfPCell upperInnerCell = new PdfPCell(new Phrase(EMPTY_CELL, cellFont));
            PdfPCell lowerInnerCell = new PdfPCell(new Phrase(EMPTY_CELL, cellFont));
            // upper (odd) cell
            if (!oddClasses.getLessons().isEmpty()) {
                generateCellStringValue(upperInnerCellString, oddClasses.getLessons());
                upperInnerCell = new PdfPCell(new Phrase(String.valueOf(upperInnerCellString), cellFont));
            }
            style.innerValueCellStyle(upperInnerCell);
            upperInnerCell.setBorderWidthBottom(0.5f);
            inner.addCell(upperInnerCell);
            // lower (even) cell
            if (!evenClasses.getLessons().isEmpty()) {
                generateCellStringValue(lowerInnerCellString, evenClasses.getLessons());
                lowerInnerCell = new PdfPCell(new Phrase(String.valueOf(lowerInnerCellString), cellFont));
            }
            style.innerValueCellStyle(lowerInnerCell);
            inner.addCell(lowerInnerCell);
            // adding inner table to main table's cell
            cell = new PdfPCell(inner);
        }
        style.valueCellStyle(cell);
        return cell;
    }
}

