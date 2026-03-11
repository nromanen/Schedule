package com.softserve.util;

import com.softserve.dto.*;
import lombok.extern.slf4j.Slf4j;

import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Builds styled HTML for a group schedule using rowspan-based layout.
 * Each period = 2 table rows (even week + odd week), time cell uses rowspan="2".
 */
@Slf4j
public class GroupHtmlBuilder {

    private static final List<DayOfWeek> WEEKDAYS = List.of(
            DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY
    );

    private static final Map<DayOfWeek, String> DAY_KEYS = Map.of(
            DayOfWeek.MONDAY, "schedule.monday",
            DayOfWeek.TUESDAY, "schedule.tuesday",
            DayOfWeek.WEDNESDAY, "schedule.wednesday",
            DayOfWeek.THURSDAY, "schedule.thursday",
            DayOfWeek.FRIDAY, "schedule.friday",
            DayOfWeek.SATURDAY, "schedule.saturday",
            DayOfWeek.SUNDAY, "schedule.sunday"
    );

    /**
     * Builds a complete HTML document for a group schedule.
     *
     * @param schedule the group schedule data
     * @param language the locale for labels and day names
     * @return HTML string ready for PDF rendering
     */
    public String buildHtml(ScheduleForGroupDTO schedule, Locale language) {
        ResourceBundle bundle = ResourceBundle.getBundle("messages", language);

        Map<DayOfWeek, DaysOfWeekWithClassesForGroupDTO> dayMap = new LinkedHashMap<>();
        if (schedule.getDays() != null) {
            for (DaysOfWeekWithClassesForGroupDTO day : schedule.getDays()) {
                dayMap.put(day.getDay(), day);
            }
        }

        List<PeriodDTO> periods = collectSortedPeriods(schedule);

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html lang=\"").append(language.getLanguage()).append("\">");
        html.append("<head><meta charset=\"UTF-8\"/>");
        html.append("<style>").append(SchedulePdfStyles.get()).append("</style>");
        html.append("</head><body>");

        // Header
        html.append("<div class=\"header__title\">")
                .append(esc(bundle.getString("schedule.group.for")))
                .append(" ")
                .append(esc(schedule.getGroup().getTitle()))
                .append("</div>");

        // Legend
        html.append(SchedulePdfStyles.legendHtml(bundle));

        // Table
        html.append("<table class=\"schedule\">");
        html.append("<colgroup><col class=\"col-time\"/>");
        for (int i = 0; i < WEEKDAYS.size(); i++) {
            html.append("<col/>");
        }
        html.append("</colgroup>");

        html.append("<thead><tr>");
        html.append("<th>").append(esc(bundle.getString("schedule.pair"))).append("</th>");
        for (DayOfWeek day : WEEKDAYS) {
            html.append("<th>").append(esc(getDayName(day, bundle))).append("</th>");
        }
        html.append("</tr></thead><tbody>");

        // Each period = 2 rows
        for (PeriodDTO period : periods) {
            // Row 1: even week
            html.append("<tr class=\"even\">");
            html.append(SchedulePdfStyles.timeCellHtml(period));

            for (DayOfWeek dayOfWeek : WEEKDAYS) {
                html.append("<td>");
                LessonsInScheduleDTO even = getLesson(dayMap.get(dayOfWeek), period, true);
                html.append(SchedulePdfStyles.lessonCardHtml(even, bundle));
                html.append("</td>");
            }
            html.append("</tr>");

            // Row 2: odd week (no time cell - covered by rowspan)
            html.append("<tr class=\"odd\">");
            for (DayOfWeek dayOfWeek : WEEKDAYS) {
                html.append("<td>");
                LessonsInScheduleDTO odd = getLesson(dayMap.get(dayOfWeek), period, false);
                html.append(SchedulePdfStyles.lessonCardHtml(odd, bundle));
                html.append("</td>");
            }
            html.append("</tr>");
        }

        html.append("</tbody></table></body></html>");
        return html.toString();
    }

    // ==================== Helpers ====================

    /**
     * Gets even or odd lesson for a given day and period.
     *
     * @param dayData day data containing classes
     * @param period  the period to look up
     * @param even    true for even week, false for odd week
     * @return the lesson DTO, or null if not found
     */
    private LessonsInScheduleDTO getLesson(DaysOfWeekWithClassesForGroupDTO dayData,
                                           PeriodDTO period, boolean even) {
        if (dayData == null || dayData.getClasses() == null) {
            return null;
        }

        ClassesInScheduleForGroupDTO cls = dayData.getClasses().stream()
                .filter(c -> c.getPeriod() != null && c.getPeriod().getId().equals(period.getId()))
                .findFirst().orElse(null);

        if (cls == null || cls.getWeeks() == null) {
            return null;
        }

        return even ? cls.getWeeks().getEven() : cls.getWeeks().getOdd();
    }

    /**
     * Collects all unique periods from all days and sorts them by start time.
     *
     * @param schedule the group schedule
     * @return sorted list of unique periods
     */
    private List<PeriodDTO> collectSortedPeriods(ScheduleForGroupDTO schedule) {
        Map<Long, PeriodDTO> map = new LinkedHashMap<>();
        if (schedule.getDays() != null) {
            for (DaysOfWeekWithClassesForGroupDTO day : schedule.getDays()) {
                if (day.getClasses() != null) {
                    for (ClassesInScheduleForGroupDTO cls : day.getClasses()) {
                        if (cls.getPeriod() != null) {
                            map.putIfAbsent(cls.getPeriod().getId(), cls.getPeriod());
                        }
                    }
                }
            }
        }
        return map.values().stream()
                .sorted(Comparator.comparing(PeriodDTO::getStartTime))
                .collect(Collectors.toList());
    }

    /**
     * Returns localized day name from resource bundle.
     *
     * @param day    the day of week
     * @param bundle resource bundle with day name translations
     * @return localized day name
     */
    private static String getDayName(DayOfWeek day, ResourceBundle bundle) {
        String key = DAY_KEYS.get(day);
        if (key != null) {
            return bundle.getString(key);
        }
        return day.name();
    }

    /**
     * Escapes HTML special characters.
     *
     * @param text the text to escape
     * @return escaped text safe for HTML
     */
    private static String esc(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace("\"", "&quot;");
    }
}
