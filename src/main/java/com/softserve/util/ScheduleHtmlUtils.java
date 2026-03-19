package com.softserve.util;

import com.softserve.dto.TeacherDTO;

import java.time.DayOfWeek;
import java.util.Map;
import java.util.ResourceBundle;

/**
 * Shared utility methods and constants for schedule HTML builders.
 */
public final class ScheduleHtmlUtils {

    public static final Map<DayOfWeek, String> DAY_KEYS = Map.of(
            DayOfWeek.MONDAY, "schedule.monday",
            DayOfWeek.TUESDAY, "schedule.tuesday",
            DayOfWeek.WEDNESDAY, "schedule.wednesday",
            DayOfWeek.THURSDAY, "schedule.thursday",
            DayOfWeek.FRIDAY, "schedule.friday",
            DayOfWeek.SATURDAY, "schedule.saturday",
            DayOfWeek.SUNDAY, "schedule.sunday"
    );

    private ScheduleHtmlUtils() {
    }

    /**
     * Escapes HTML special characters.
     *
     * @param text the text to escape
     * @return escaped text safe for HTML
     */
    public static String esc(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace("\"", "&quot;");
    }

    /**
     * Returns localized day name from resource bundle.
     *
     * @param day    the day of week
     * @param bundle resource bundle with day name translations
     * @return localized day name
     */
    public static String getDayName(DayOfWeek day, ResourceBundle bundle) {
        String key = DAY_KEYS.get(day);
        if (key != null) {
            return bundle.getString(key);
        }
        return day.name();
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

    /**
     * Formats a teacher's full name: Surname Name Patronymic.
     *
     * @param teacher the teacher DTO
     * @return formatted full name
     */
    public static String formatTeacherFull(TeacherDTO teacher) {
        if (teacher == null) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        if (teacher.getSurname() != null) {
            sb.append(teacher.getSurname());
        }
        if (teacher.getName() != null) {
            sb.append(" ").append(teacher.getName());
        }
        if (teacher.getPatronymic() != null) {
            sb.append(" ").append(teacher.getPatronymic());
        }
        return sb.toString().trim();
    }

    /**
     * Builds a header with title and legend on separate lines.
     *
     * @param title  the schedule title (already escaped)
     * @param bundle resource bundle for localized labels
     * @return HTML string for the header block
     */
    public static String buildHeader(String title, ResourceBundle bundle) {
        return "<div class=\"header__title\">" + title + "</div>"
                + SchedulePdfStyles.legendHtml(bundle);
    }
}
