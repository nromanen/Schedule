package com.softserve.util;

import com.itextpdf.text.Chunk;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.softserve.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.text.MessageFormat;
import java.time.DayOfWeek;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Slf4j
public class TeacherTableBuilder extends BaseTableBuilder {

    /**
     * Constructs a TeacherTableBuilder.
     *
     * @throws IOException if the font file could not be read
     * @throws DocumentException if the font is invalid, or when size of table is wrong
     */
    protected TeacherTableBuilder() throws DocumentException, IOException {
        super();
    }

    /**
     * Method used for creating group schedule table in pdf
     *
     * @param schedule the schedule of teacher
     * @param language the selected language
     * @return PdfPTable schedule for group
     * @throws DocumentException if the table could not be created
     */
    public PdfPTable createTeacherTable(ScheduleForTeacherDTO schedule, Locale language) throws DocumentException, IOException {
        log.info("Enter into createTeacherTable method with schedule {} and language {}", schedule, language);

        // getting amount of columns, setting columns width when creating main table
        int tableWidth = schedule.getDays().size() + 1;
        PdfPTable table = generateEmptyTable(tableWidth);

        //creating table title cell
        table.addCell(createTitleCell(tableWidth, schedule, language));

        //creating table header cell
        List<DayOfWeek> days = schedule.getDays()
                .stream()
                .map(DaysOfWeekWithClassesForTeacherDTO::getDay)
                .collect(Collectors.toList());
        PdfPCell[] cells = createHeaderCells(days, language);
        Arrays.stream(cells).forEach(table::addCell);

        //getting all unique periods
        TreeSet<PeriodDTO> periods = getAllPeriods(schedule);

        // creating table cells with values
        PdfPCell cell;

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
                table.addCell(createInnerCell(oddClasses, evenClasses));
            }
        }
        return table;
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

    /**
     *  Method used for getting all periods from schedule using TreeSet to avoid
     *  duplicating values, then sorting them by start time
     *
     * @param schedule the schedule of teacher
     * @return sorted treeSet of periodDTO
     */
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

    /**
     * Method used for creating title cell for table
     *
     * @param tableWidth the width of table
     * @param schedule the schedule of teacher
     * @param language the selected language
     * @return PdfPTable schedule for group
     */
    private PdfPCell createTitleCell(int tableWidth, ScheduleForTeacherDTO schedule, Locale language) {
        log.info("Enter into createTableTitleCell method with tableWidth {} and schedule {} and language {}", tableWidth, schedule, language);

        String scheduleTitle = MessageFormat.format("{0} {1} {2} {3}, {4}",
                StringUtils.capitalize(Translator.getInstance().getTranslation("schedule for", language)) ,
                schedule.getTeacher().getSurname(), schedule.getTeacher().getName(),
                schedule.getTeacher().getPatronymic(), schedule.getTeacher().getPosition());
        PdfPCell cellTitle = new PdfPCell(new Phrase(scheduleTitle, titleFont));
        cellTitle.setColspan(tableWidth);
        style.titleCellStyle(cellTitle);
        return cellTitle;
    }

    /**
     * Method used for creating  main table cells
     * depending on whether they are odd or even
     *
     * @param oddClasses the upper (odd) cell of table
     * @param evenClasses the lover (even) cell of table
     * @return inner PdfPCell for table
     */
    private PdfPCell createInnerCell(ClassForTeacherScheduleDTO oddClasses, ClassForTeacherScheduleDTO evenClasses) {
        log.info("Enter into cellBuilder method with oddClasses {} evenClasses {}", oddClasses, evenClasses);

        PdfPCell cell;
        // creating one whole empty cell, if both odd and even lists of lessons r empty
        if (oddClasses.getLessons().isEmpty() && evenClasses.getLessons().isEmpty()) {
            cell = new PdfPCell(new Phrase(EMPTY_CELL, cellFont));
        }
        // creating one whole cell, if odd and even lists of lessons r equal
        else if (oddClasses.getLessons().equals(evenClasses.getLessons())) {
            cell = generateCell(oddClasses.getLessons());
        }
        // dividing one cell into odd (upper) and even (lower) cells and filling them
        else {
            // creating new inner table with two cells - odd and even
            PdfPTable inner = new PdfPTable(1);
            inner.addCell(createUpperInnerCell(oddClasses));
            inner.addCell(createLowerInnerCell(evenClasses));
            // adding inner table to main table's cell
            cell = new PdfPCell(inner);
        }
        style.valueCellStyle(cell);
        return cell;
    }

    /**
     *  Method used for creating upper (odd) cell of table
     *
     * @param oddClasses the classes for teacher
     * @return inner PdfPCell for table
     */
    private PdfPCell createUpperInnerCell(ClassForTeacherScheduleDTO oddClasses) {
        PdfPCell upperInnerCell = new PdfPCell(new Phrase(EMPTY_CELL, cellFont));
        if (!oddClasses.getLessons().isEmpty()) {
            upperInnerCell = generateCell(oddClasses.getLessons());
        }
        style.innerValueCellStyle(upperInnerCell);
        upperInnerCell.setBorderWidthBottom(0.5f);
        return upperInnerCell;
    }

    /**
     *  Method used for creating lower (even) cell of table
     *
     * @param evenClasses the classes for teacher
     * @return inner PdfPCell for table
     */
    private PdfPCell createLowerInnerCell(ClassForTeacherScheduleDTO evenClasses) {
        PdfPCell lowerInnerCell = new PdfPCell(new Phrase(EMPTY_CELL, cellFont));
        // lower (even) cell
        if (!evenClasses.getLessons().isEmpty()) {
            lowerInnerCell = generateCell(evenClasses.getLessons());
        }
        style.innerValueCellStyle(lowerInnerCell);
        return lowerInnerCell;
    }



    /**
     *  Method used for generating schedule text in table's cell
     *
     * @param lessons the lessons of schedule
     * @return inner PdfPCell for table
     */
    private PdfPCell generateCell(List<LessonForTeacherScheduleDTO> lessons) {
        String baseText = getBaseTextFromLessonsInScheduleDTOs(lessons);
        String linkText = getLinkTextFromLessonsInScheduleDTOs(lessons);
        Phrase phrase = new Phrase(baseText, cellFont);
        Chunk chunk = new Chunk("follow the link", linkFont);
        chunk.setAnchor(linkText);
        phrase.add(chunk);
        return new PdfPCell(phrase);
    }

    /**
     *  Method used for get group's title, getSubject for site, Lesson type
     *  and room from lessons
     *
     * @param lessons the lessons of schedule
     * @return text of group's title, getSubject for site, Lesson type and room from lessons
     */
    private String getBaseTextFromLessonsInScheduleDTOs(List<LessonForTeacherScheduleDTO> lessons) {
        StringBuilder stringBuilder = new StringBuilder();

        String group = lessons.stream()
                .map(LessonForTeacherScheduleDTO::getGroup)
                .map(GroupDTO::getTitle)
                .collect(Collectors.joining(", "));
        String subjectName = lessons.stream()
                .map(LessonForTeacherScheduleDTO::getSubjectForSite)
                .collect(Collectors.joining(", "));
        String lessonType = lessons.stream()
                .map(LessonForTeacherScheduleDTO::getLessonType)
                .map(Object::toString)
                .collect(Collectors.joining(", "));
        String room = lessons.stream()
                .map(LessonForTeacherScheduleDTO::getRoom)
                .collect(Collectors.joining(", "));

        stringBuilder.append(group).append(",\n")
                .append(subjectName).append(",\n")
                .append(lessonType).append(",\n")
                .append(room).append(",\n");
        return stringBuilder.toString();
    }

    /**
     *  Method used for get link from lessons
     *
     * @param lessons the lessons of schedule
     * @return text of link from lessons
     */
    private String getLinkTextFromLessonsInScheduleDTOs(List<LessonForTeacherScheduleDTO> lessons) {
        StringBuilder stringBuilder = new StringBuilder();

        String link = lessons.stream()
                .map(LessonForTeacherScheduleDTO::getLinkToMeeting)
                .collect(Collectors.joining(", "));

        stringBuilder.append(link);
        return stringBuilder.toString();
    }
}