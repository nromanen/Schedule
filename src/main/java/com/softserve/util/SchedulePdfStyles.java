package com.softserve.util;

import com.softserve.dto.LessonForTeacherScheduleDTO;
import com.softserve.dto.LessonsInScheduleDTO;
import com.softserve.dto.PeriodDTO;
import com.softserve.dto.TeacherDTO;

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
     * @return CSS string to be embedded in the HTML head
     */
    public static String get() {
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
                .header__semester { font-size: 9pt; color: #5c6478; margin-bottom: 4mm; }
                .legend { margin-bottom: 3mm; }
                .legend__item { font-size: 8pt; color: #5c6478; margin-right: 10pt; }
                .legend__dot {
                    display: inline-block;
                    width: 7pt; height: 7pt;
                    margin-right: 3pt;
                    vertical-align: middle;
                }
                .legend__dot--lecture   { background-color: #4a6cf7; }
                .legend__dot--practical { background-color: #0fa968; }
                .legend__dot--lab       { background-color: #e08830; }

                .schedule {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }
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
                .col-time { width: 22mm; }
                .schedule td {
                    vertical-align: middle;
                    border-right: 0.5pt solid #e0e3ea;
                    padding: 1.5mm;
                    height: 40pt;
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
                .card--lecture {
                    background-color: #eef1fe;
                    border-left: 2pt solid #4a6cf7;
                    border-top: 0.3pt solid #d4dbf9;
                    border-right: 0.3pt solid #d4dbf9;
                    border-bottom: 0.3pt solid #d4dbf9;
                }
                .card--practical {
                    background-color: #edfcf5;
                    border-left: 2pt solid #0fa968;
                    border-top: 0.3pt solid #c5f0dc;
                    border-right: 0.3pt solid #c5f0dc;
                    border-bottom: 0.3pt solid #c5f0dc;
                }
                .card--lab {
                    background-color: #fef6ed;
                    border-left: 2pt solid #e08830;
                    border-top: 0.3pt solid #f5dfc5;
                    border-right: 0.3pt solid #f5dfc5;
                    border-bottom: 0.3pt solid #f5dfc5;
                }
                .card__type {
                    font-size: 5.5pt;
                    font-weight: bold;
                    letter-spacing: 0.6pt;
                    text-transform: uppercase;
                    margin-bottom: 0.3mm;
                }
                .card--lecture .card__type   { color: #4a6cf7; }
                .card--practical .card__type { color: #0fa968; }
                .card--lab .card__type       { color: #e08830; }
                .card__room {
                    display: inline-block;
                    border-radius: 10pt;
                    padding: 0.5mm 2mm;
                    font-size: 6.5pt;
                    margin-top: 0.5mm;
                }
                .card--lecture .card__room {
                    background-color: #d4dbf9;
                    color: #3a56c7;
                }
                .card--practical .card__room {
                    background-color: #c5f0dc;
                    color: #0b8a54;
                }
                .card--lab .card__room {
                    background-color: #f5dfc5;
                    color: #b36d20;
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
                .card__link { font-size: 6pt; margin-top: 0.5mm; }
                .card__link a { color: #4a6cf7; text-decoration: underline; }
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
                + "<div class=\"time__pair\">" + esc(period.getName()) + "</div>"
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
        String cssType = mapLessonTypeToCss(lesson.getLessonType());
        String typeName = mapLessonTypeToDisplay(lesson.getLessonType(), bundle);
        String room = lesson.getRoom() != null ? lesson.getRoom().getName() : "";

        StringBuilder sb = new StringBuilder();
        sb.append("<div class=\"card card--").append(cssType).append("\">");
        sb.append("<div class=\"card__type\">").append(esc(typeName)).append("</div>");
        sb.append("<div class=\"card__subject\">").append(esc(lesson.getSubjectForSite())).append("</div>");
        if (lesson.getTeacher() != null) {
            sb.append("<div class=\"card__info\">")
                    .append(esc(formatTeacherShort(lesson.getTeacher())))
                    .append("</div>");
        }
        if (!room.isEmpty()) {
            sb.append("<div><span class=\"card__room\">").append(esc(room)).append("</span></div>");
        }
        if (lesson.getLinkToMeeting() != null && !lesson.getLinkToMeeting().isBlank()) {
            sb.append("<div class=\"card__link\"><a href=\"")
                    .append(esc(lesson.getLinkToMeeting()))
                    .append("\">").append(esc(bundle.getString("schedule.link")))
                    .append("</a></div>");
        }
        sb.append("</div>");
        return sb.toString();
    }

    /**
     * Renders a lesson card for teacher schedule (shows group and room).
     *
     * @param lesson lesson data
     * @param bundle resource bundle for localized labels
     * @return HTML string for the lesson card
     */
    public static String teacherLessonCardHtml(LessonForTeacherScheduleDTO lesson, ResourceBundle bundle) {
        String cssType = mapLessonTypeToCss(
                lesson.getLessonType() != null ? lesson.getLessonType().name() : null);
        String typeName = mapLessonTypeToDisplay(
                lesson.getLessonType() != null ? lesson.getLessonType().name() : null, bundle);

        StringBuilder sb = new StringBuilder();
        sb.append("<div class=\"card card--").append(cssType).append("\">");
        sb.append("<div class=\"card__type\">").append(esc(typeName)).append("</div>");
        sb.append("<div class=\"card__subject\">").append(esc(lesson.getSubjectForSite())).append("</div>");
        if (lesson.getGroup() != null && lesson.getGroup().getTitle() != null) {
            sb.append("<div class=\"card__info\">")
                    .append(esc(lesson.getGroup().getTitle()))
                    .append("</div>");
        }
        if (lesson.getRoom() != null && !lesson.getRoom().isBlank()) {
            sb.append("<div><span class=\"card__room\">").append(esc(lesson.getRoom())).append("</span></div>");
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

    // ==================== Mapping helpers ====================

    /**
     * Maps a lesson type string to a CSS class suffix.
     *
     * @param lessonType the lesson type (e.g. "LECTURE", "PRACTICAL", "LABORATORY")
     * @return CSS class suffix: "lecture", "practical", or "lab"
     */
    public static String mapLessonTypeToCss(String lessonType) {
        if (lessonType == null) {
            return "lecture";
        }
        String upper = lessonType.toUpperCase();
        if (upper.contains("LAB") || upper.contains("\u041B\u0410\u0411")) {
            return "lab";
        }
        if (upper.contains("PRAC") || upper.contains("\u041F\u0420\u0410\u041A")) {
            return "practical";
        }
        return "lecture";
    }

    /**
     * Maps a lesson type string to its localized display name.
     *
     * @param lessonType the lesson type
     * @param bundle     resource bundle for localized labels
     * @return localized lesson type name
     */
    public static String mapLessonTypeToDisplay(String lessonType, ResourceBundle bundle) {
        String css = mapLessonTypeToCss(lessonType);
        return switch (css) {
            case "lab" -> bundle.getString("schedule.laboratory");
            case "practical" -> bundle.getString("schedule.practical");
            default -> bundle.getString("schedule.lecture");
        };
    }

    /**
     * Formats a teacher name in short form: "position Surname N. P."
     *
     * @param teacher the teacher DTO
     * @return formatted short name
     */
    public static String formatTeacherShort(TeacherDTO teacher) {
        if (teacher == null) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        if (teacher.getPosition() != null && !teacher.getPosition().isBlank()) {
            sb.append(teacher.getPosition()).append(" ");
        }
        if (teacher.getSurname() != null) {
            sb.append(teacher.getSurname());
        }
        if (teacher.getName() != null && !teacher.getName().isEmpty()) {
            sb.append(" ").append(teacher.getName().charAt(0)).append(".");
        }
        if (teacher.getPatronymic() != null && !teacher.getPatronymic().isEmpty()) {
            sb.append(" ").append(teacher.getPatronymic().charAt(0)).append(".");
        }
        return sb.toString().trim();
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
                + esc(label) + "</span>";
    }

    /**
     * Escapes HTML special characters.
     *
     * @param text the text to escape
     * @return escaped text safe for HTML
     */
    static String esc(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace("\"", "&quot;");
    }
}
