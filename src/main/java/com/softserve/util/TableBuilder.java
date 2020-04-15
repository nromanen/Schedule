package com.softserve.util;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.softserve.entity.Schedule;
import com.softserve.entity.Teacher;
import lombok.extern.slf4j.Slf4j;

import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.time.DayOfWeek;
import java.util.Comparator;
import java.util.List;


@Slf4j
public class TableBuilder {

    private Style style = new Style();
    private static final int NUM_COLUMNS = 8;

    /**
     * The method used for generating pdf tables
     *
     * @param schedules for selected teacher and semester
     * @return PdfPTable schedule for teacher
     * @throws DocumentException when creating table failed
     */
    public PdfPTable createTable(List<Schedule> schedules) throws DocumentException {
        log.info("Enter into createTable method with list of schedules {}", schedules);

        PdfPTable table = new PdfPTable(NUM_COLUMNS);
        table.setWidthPercentage(100);
        float columnWidth = 7f / table.getNumberOfColumns();
        float[] columnWidths = new float[NUM_COLUMNS];
        for (int i = 0; i < NUM_COLUMNS; i++) {
            columnWidths[i] = columnWidth;
        }
        table.setWidths(columnWidths);
//        table.setWidths(new float[]{columnWidth, columnWidth, columnWidth, columnWidth, columnWidth,
//                columnWidth, columnWidth, columnWidth});

//        Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        Font headFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD, BaseColor.BLACK);


        //create table title cell
        Font font = new Font(Font.FontFamily.TIMES_ROMAN, 14, Font.BOLD, BaseColor.WHITE);
        Teacher teacher = schedules.get(0).getLesson().getTeacher();
        String scheduleTitle = MessageFormat.format("Schedule for teacher: {0} {1} {2}, {3}.",
                teacher.getSurname(), teacher.getName(), teacher.getPatronymic(), teacher.getPosition());
        PdfPCell cellTitle = new PdfPCell(new Phrase(scheduleTitle, font));
        cellTitle.setColspan(table.getNumberOfColumns());
        style.headerCellStyle(cellTitle);
        table.addCell(cellTitle);

        //creating header cells
        PdfPCell header;

        header = new PdfPCell(new Phrase("Period", headFont));
        style.labelCellStyle(header);
        table.addCell(header);

        header = new PdfPCell(new Phrase("Monday", headFont));
        style.labelCellStyle(header);
        table.addCell(header);

        header = new PdfPCell(new Phrase("Tuesday", headFont));
        style.labelCellStyle(header);
        table.addCell(header);

        header = new PdfPCell(new Phrase("Wednesday", headFont));
        style.labelCellStyle(header);
        table.addCell(header);

        header = new PdfPCell(new Phrase("Thursday", headFont));
        style.labelCellStyle(header);
        table.addCell(header);

        header = new PdfPCell(new Phrase("Friday", headFont));
        style.labelCellStyle(header);
        table.addCell(header);

        header = new PdfPCell(new Phrase("Saturday", headFont));
        style.labelCellStyle(header);
        table.addCell(header);

        header = new PdfPCell(new Phrase("Sunday", headFont));
        style.labelCellStyle(header);
        table.addCell(header);
        schedules.sort(Comparator.comparing(a -> a.getPeriod().getStartTime()));

        //creating header cells
        for (Schedule schedule : schedules) {

            //period cell
            PdfPCell cell;
            String period = schedule.getPeriod().getName() + "\n" + new SimpleDateFormat("HH:mm").format(schedule.getPeriod().getStartTime())
                    + " - \n" + new SimpleDateFormat("HH:mm").format(schedule.getPeriod().getEndTime());
            cell = new PdfPCell(new Phrase(period, headFont));
            style.valueCellStyle(cell);
            table.addCell(cell);
            //days cells

            for (int i = 0; i < DayOfWeek.values().length; i++) {
                cell = cellBuilder(schedule, DayOfWeek.values()[i].toString());
                table.addCell(cell);
            }
        }
        return table;
    }

    /**
     * The method used for generating table cells
     *
     * @param schedule for selected teacher and semester
     * @param day      of the week
     * @return PdfPTable schedule for teacher
     */
    private PdfPCell cellBuilder(Schedule schedule, String day) {
        StringBuilder daySchedule = new StringBuilder("");
        PdfPCell cell;
        Font cellFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD, BaseColor.BLACK);


        if (schedule.getDayOfWeek().equals(day)) {
            if (schedule.getEvenOdd().toString().equals("WEEKLY")) {
                String groupTitle = "Group: " + schedule.getLesson().getGroup().getTitle();
                String subjectName = schedule.getLesson().getSubjectForSite();
                String lessonType = schedule.getLesson().getLessonType().toString().toLowerCase();
                String room = "Room: " + schedule.getRoom().getName();
                daySchedule.append(groupTitle).append(",\n").append(subjectName).append(",\n").append(lessonType)
                        .append(",\n").append(room);
                cell = new PdfPCell(new Phrase(String.valueOf(daySchedule), cellFont));
                style.valueCellStyle(cell);
                return cell;
            }
            if (schedule.getEvenOdd().toString().equals("ODD")) {
                PdfPTable inner = new PdfPTable(1);

                //odd cell
                String groupTitle = "Group: " + schedule.getLesson().getGroup().getTitle();
                String subjectName = schedule.getLesson().getSubjectForSite();
                String lessonType = schedule.getLesson().getLessonType().toString().toLowerCase();
                String room = "Room: " + schedule.getRoom().getName();
                daySchedule.append(groupTitle).append(",\n").append(subjectName).append(",\n").append(lessonType)
                        .append(",\n").append(room);
                PdfPCell upperInnerCell = new PdfPCell(new Phrase(String.valueOf(daySchedule), cellFont));
                style.valueCellStyle(upperInnerCell);
                inner.addCell(upperInnerCell);
                PdfPCell lowerInnerCell = new PdfPCell(new Phrase("\n\n --//--\n\n ", cellFont));
                lowerInnerCell.setBorderWidth(0);
                style.valueCellStyle(lowerInnerCell);
                inner.addCell(lowerInnerCell);
                cell = new PdfPCell(inner);
                return cell;
            }
            if (schedule.getEvenOdd().toString().equals("EVEN")) {
                PdfPTable inner = new PdfPTable(1);
                //odd cell
                PdfPCell upperInnerCell = new PdfPCell(new Phrase("\n\n --//--\n\n ", cellFont));
                style.valueCellStyle(upperInnerCell);
                inner.addCell(upperInnerCell);
                String groupTitle = "Group: " + schedule.getLesson().getGroup().getTitle();
                String subjectName = schedule.getLesson().getSubjectForSite();
                String lessonType = schedule.getLesson().getLessonType().toString().toLowerCase();
                String room = "Room: " + schedule.getRoom().getName();
                daySchedule.append(groupTitle).append(",\n").append(subjectName).append(",\n").append(lessonType)
                        .append(",\n").append(room);
                PdfPCell lowerInnerCell = new PdfPCell(new Phrase(String.valueOf(daySchedule), cellFont));
                lowerInnerCell.setBorderWidth(0);
                style.valueCellStyle(lowerInnerCell);
                inner.addCell(lowerInnerCell);
                cell = new PdfPCell(inner);
                style.valueCellStyle(cell);
                return cell;
            }
        }
        cell = new PdfPCell(new Phrase(String.valueOf(daySchedule), cellFont));
        style.valueCellStyle(cell);
        return cell;
    }
}
