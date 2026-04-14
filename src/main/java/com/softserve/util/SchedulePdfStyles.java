package com.softserve.util;

import com.softserve.dto.LessonForTeacherScheduleDTO;
import com.softserve.dto.LessonsInScheduleDTO;
import com.softserve.dto.PeriodDTO;
import com.softserve.entity.enums.LessonType;

import java.util.ResourceBundle;

/**
 * Shared CSS styles and reusable HTML building blocks for schedule PDF generation.
 * Uses rowspan-based layout: each period = 2 rows (even + odd week).
 */
public final class SchedulePdfStyles {

    private SchedulePdfStyles() {
    }

    /**
     * Returns the CSS stylesheet for the schedule PDF.
     *
     * @param fullWidth   true for group schedule (table fills full page width),
     *                    false for teacher schedule (table width auto-fits active days)
     * @param columnCount number of day columns (excluding the time column),
     *                    used to determine table width strategy
     * @return CSS string to be embedded in the HTML head
     */
    public static String get(boolean fullWidth, int columnCount) {
        String tableWidth = fullWidth ? "100%" : (columnCount <= 3 ? "auto" : "100%");
        String cellMinWidth = !fullWidth && columnCount <= 3 ? ".schedule th, .schedule td { min-width: 45mm; }\n" : "";
        return """
            @page {
                size: A4 landscape;
                margin: 12mm;
            }
            body {
                font-family: 'Liberation Sans', sans-serif;
                font-size: 9pt;
                color: #1a1d26;
                background: #ffffff;
                margin: 0;
                padding: 0;
            }
            .header__title {
                font-size: 14pt;
                font-weight: bold;
                color: #1a1d26;
                margin-bottom: 1mm;
            }
            .legend { margin-bottom: 3mm; }
            .legend__item { font-size: 8pt; color: #5c6478; margin-right: 10pt; }
            .legend__dot {
                display: inline-block;
                width: 7pt; height: 7pt;
                margin-right: 3pt;
                vertical-align: middle;
            }"""
                + ".legend__dot--lecture   { background-color: " + LessonType.LECTURE.getMain() + "; }\n"
                + ".legend__dot--practical { background-color: " + LessonType.PRACTICAL.getMain() + "; }\n"
                + ".legend__dot--lab       { background-color: " + LessonType.LABORATORY.getMain() + "; }\n"
                + ".legend__dot--exam   { background-color: " + LessonType.EXAM.getMain() + "; }\n"
                + ".legend__dot--credit { background-color: " + LessonType.CREDIT.getMain() + "; }\n"
                + ".schedule { width: " + tableWidth + "; border-collapse: collapse; }\n"
                + cellMinWidth
                + """
            .schedule th {
                background-color: #f0f2f6;
                padding: 2.5mm 2mm;
                font-size: 7pt;
                font-weight: bold;
                letter-spacing: 1pt;
                text-transform: uppercase;
                color: #8b93a6;
                border-bottom: 0.5pt solid #dde0e8;
                text-align: center;
            }
            .schedule td {
                vertical-align: middle;
                border-right: 0.5pt solid #e0e3ea;
                padding: 1.5mm;
                overflow: hidden;
            }
            .schedule td:last-child { border-right: none; }
            tr.even td {
                border-bottom: 0.5pt solid #d0d4de;
            }
            tr.odd td {
                border-bottom: 1.5pt solid #c0c4ce;
            }
            td.time-cell {
                vertical-align: middle;
                text-align: center;
                padding: 0;
                border-bottom: 1.5pt solid #c0c4ce;
            }
            .time__pair {
                font-size: 14pt;
                font-weight: bold;
                color: #bcc3d2;
            }
            .time__range {
                font-size: 7pt;
                color: #8b93a6;
            }
            .card {
                padding: 1.5mm 2mm;
            }
            """
                + ".card--lecture   { background-color: " + LessonType.LECTURE.getLight() + ";"
                + " border-left: 2pt solid " + LessonType.LECTURE.getMain() + ";"
                + " border-top: 0.3pt solid " + LessonType.LECTURE.getBorder() + ";"
                + " border-right: 0.3pt solid " + LessonType.LECTURE.getBorder() + ";"
                + " border-bottom: 0.3pt solid " + LessonType.LECTURE.getBorder() + "; }\n"
                + ".card--practical { background-color: " + LessonType.PRACTICAL.getLight() + ";"
                + " border-left: 2pt solid " + LessonType.PRACTICAL.getMain() + ";"
                + " border-top: 0.3pt solid " + LessonType.PRACTICAL.getBorder() + ";"
                + " border-right: 0.3pt solid " + LessonType.PRACTICAL.getBorder() + ";"
                + " border-bottom: 0.3pt solid " + LessonType.PRACTICAL.getBorder() + "; }\n"
                + ".card--lab       { background-color: " + LessonType.LABORATORY.getLight() + ";"
                + " border-left: 2pt solid " + LessonType.LABORATORY.getMain() + ";"
                + " border-top: 0.3pt solid " + LessonType.LABORATORY.getBorder() + ";"
                + " border-right: 0.3pt solid " + LessonType.LABORATORY.getBorder() + ";"
                + " border-bottom: 0.3pt solid " + LessonType.LABORATORY.getBorder() + "; }\n"
                + ".card--lecture .card__room   { background-color: " + LessonType.LECTURE.getRoomBg() + ";"
                + " color: " + LessonType.LECTURE.getRoomFg() + "; }\n"
                + ".card--practical .card__room { background-color: " + LessonType.PRACTICAL.getRoomBg() + ";"
                + " color: " + LessonType.PRACTICAL.getRoomFg() + "; }\n"
                + ".card--lab .card__room       { background-color: " + LessonType.LABORATORY.getRoomBg() + ";"
                + " color: " + LessonType.LABORATORY.getRoomFg() + "; }\n"
                + ".card--exam      { background-color: " + LessonType.EXAM.getLight() + ";"
                + " border-left: 2pt solid " + LessonType.EXAM.getMain() + ";"
                + " border-top: 0.3pt solid " + LessonType.EXAM.getBorder() + ";"
                + " border-right: 0.3pt solid " + LessonType.EXAM.getBorder() + ";"
                + " border-bottom: 0.3pt solid " + LessonType.EXAM.getBorder() + "; }\n"
                + ".card--credit    { background-color: " + LessonType.CREDIT.getLight() + ";"
                + " border-left: 2pt solid " + LessonType.CREDIT.getMain() + ";"
                + " border-top: 0.3pt solid " + LessonType.CREDIT.getBorder() + ";"
                + " border-right: 0.3pt solid " + LessonType.CREDIT.getBorder() + ";"
                + " border-bottom: 0.3pt solid " + LessonType.CREDIT.getBorder() + "; }\n"
                + ".card--exam .card__room      { background-color: " + LessonType.EXAM.getRoomBg() + ";"
                + " color: " + LessonType.EXAM.getRoomFg() + "; }\n"
                + ".card--credit .card__room    { background-color: " + LessonType.CREDIT.getRoomBg() + ";"
                + " color: " + LessonType.CREDIT.getRoomFg() + "; }\n"
                + """
                .card__footer { margin-top: 0.5mm; }
                .card__room {
                    display: inline-block;
                    border-radius: 10pt;
                    padding: 0.5mm 2mm;
                    font-size: 6.5pt;
                }
                .card__subject {
                    font-size: 7.5pt;
                    font-weight: bold;
                    color: #1a1d26;
                    margin-bottom: 0.5mm;
                }
                .card__info { font-size: 6.5pt; color: #5c6478; }
                .empty {
                    text-align: center;
                    color: #c8cdd8;
                    font-size: 9pt;
                }
                .card__link { font-size: 6pt; color: #4a6cf7; text-decoration: underline; }
                tr.even td {
                    -fs-keep-with-next: always;
                }
                """;
    }

    // ==================== HTML snippets ====================

    /**
     * Renders the color-coded legend for lesson types.
     *
     * @param bundle resource bundle for localized labels
     * @return HTML string for the legend block
     */
    public static String legendHtml(ResourceBundle bundle) {
        return "<div class=\"legend\">"
                + legendItem("lecture", bundle.getString("schedule.lecture"))
                + legendItem("practical", bundle.getString("schedule.practical"))
                + legendItem("lab", bundle.getString("schedule.laboratory"))
                + legendItem("exam", bundle.getString("schedule.exam"))
                + legendItem("credit", bundle.getString("schedule.credit"))
                + "</div>";
    }

    /**
     * Renders a time cell with rowspan=2 for even+odd rows.
     *
     * @param period the period data (number, start time, end time)
     * @return HTML string for the time cell
     */
    public static String timeCellHtml(PeriodDTO period) {
        return "<td class=\"time-cell\" rowspan=\"2\">"
                + "<div class=\"time__pair\">" + ScheduleHtmlUtils.esc(period.getName()) + "</div>"
                + "<div class=\"time__range\">"
                + period.getStartTime() + " \u2013 " + period.getEndTime()
                + "</div></td>";
    }

    /**
     * Renders a lesson card for group schedule (shows teacher, room, and optional link).
     *
     * @param lesson lesson data
     * @param bundle resource bundle for localized labels
     * @return HTML string for the lesson card, or empty placeholder
     */
    public static String lessonCardHtml(LessonsInScheduleDTO lesson, ResourceBundle bundle) {
        if (lesson == null || lesson.getSubjectForSite() == null || lesson.getSubjectForSite().isBlank()) {
            return emptyHtml();
        }
        String cssType = LessonType.valueOf(lesson.getLessonType()).getCssClass();
        String room = lesson.getRoom() != null ? lesson.getRoom().getName() : "";
        String link = lesson.getLinkToMeeting();
        boolean hasRoom = !room.isEmpty();
        boolean hasLink = link != null && !link.isBlank();

        StringBuilder sb = new StringBuilder();
        sb.append("<div class=\"card card--").append(cssType).append("\">");
        sb.append("<div class=\"card__subject\">").append(ScheduleHtmlUtils.esc(lesson.getSubjectForSite())).append("</div>");
        if (lesson.getTeacher() != null) {
            sb.append("<div class=\"card__info\">")
                    .append(ScheduleHtmlUtils.esc(ScheduleHtmlUtils.formatTeacherShort(lesson.getTeacher())))
                    .append("</div>");
        }
        if (hasRoom || hasLink) {
            sb.append("<div class=\"card__footer\">");
            if (hasRoom) {
                sb.append("<span class=\"card__room\">").append(ScheduleHtmlUtils.esc(room)).append("</span>");
            }
            if (hasLink) {
                sb.append(" <a class=\"card__link\" href=\"")
                        .append(ScheduleHtmlUtils.esc(link))
                        .append("\">").append(ScheduleHtmlUtils.esc(bundle.getString("schedule.link")))
                        .append("</a>");
            }
            sb.append("</div>");
        }
        sb.append("</div>");
        return sb.toString();
    }

    /**
     * Renders a lesson card for teacher schedule (shows group, room, and optional link).
     *
     * @param lesson lesson data
     * @param bundle resource bundle for localized labels
     * @return HTML string for the lesson card
     */
    public static String teacherLessonCardHtml(LessonForTeacherScheduleDTO lesson, ResourceBundle bundle) {
        String cssType = lesson.getLessonType() != null
                ? lesson.getLessonType().getCssClass()
                : LessonType.LECTURE.getCssClass();
        String room = lesson.getRoom();
        String link = lesson.getLinkToMeeting();
        boolean hasRoom = room != null && !room.isBlank();
        boolean hasLink = link != null && !link.isBlank();

        StringBuilder sb = new StringBuilder();
        sb.append("<div class=\"card card--").append(cssType).append("\">");
        sb.append("<div class=\"card__subject\">").append(ScheduleHtmlUtils.esc(lesson.getSubjectForSite())).append("</div>");
        if (lesson.getGroup() != null && lesson.getGroup().getTitle() != null) {
            sb.append("<div class=\"card__info\">")
                    .append(ScheduleHtmlUtils.esc(lesson.getGroup().getTitle()))
                    .append("</div>");
        }
        if (hasRoom || hasLink) {
            sb.append("<div class=\"card__footer\">");
            if (hasRoom) {
                sb.append("<span class=\"card__room\">").append(ScheduleHtmlUtils.esc(room)).append("</span>");
            }
            if (hasLink) {
                sb.append(" <a class=\"card__link\" href=\"")
                        .append(ScheduleHtmlUtils.esc(link))
                        .append("\">").append(ScheduleHtmlUtils.esc(bundle.getString("schedule.link")))
                        .append("</a>");
            }
            sb.append("</div>");
        }
        sb.append("</div>");
        return sb.toString();
    }

    /**
     * Renders an empty cell placeholder.
     *
     * @return HTML string with an em-dash
     */
    public static String emptyHtml() {
        return "<div class=\"empty\">\u2014</div>";
    }


    // ==================== Internal ====================

    /**
     * Renders a single legend item with a colored dot and label.
     *
     * @param type  CSS class suffix for the dot color
     * @param label localized lesson type label
     * @return HTML string for one legend item
     */
    private static String legendItem(String type, String label) {
        return "<span class=\"legend__item\">"
                + "<span class=\"legend__dot legend__dot--" + type + "\"></span> "
                + ScheduleHtmlUtils.esc(label) + "</span>";
    }
}


