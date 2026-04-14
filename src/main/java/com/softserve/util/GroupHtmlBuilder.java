package com.softserve.util;

import com.softserve.dto.*;
import lombok.extern.slf4j.Slf4j;

import java.time.DayOfWeek;
import java.util.*;

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

    private ResourceBundle bundle;

    /**
     * Builds a complete HTML document for a group schedule.
     *
     * @param schedule the group schedule data
     * @param language the locale for labels and day names
     * @return HTML string ready for PDF rendering
     */
    public String buildHtml(ScheduleForGroupDTO schedule, Locale language) {
        bundle = ResourceBundle.getBundle("messages", language);

        Map<DayOfWeek, DaysOfWeekWithClassesForGroupDTO> dayMap = new LinkedHashMap<>();
        if (schedule.getDays() != null) {
            for (DaysOfWeekWithClassesForGroupDTO day : schedule.getDays()) {
                dayMap.put(day.getDay(), day);
            }
        }

        List<PeriodDTO> periods = collectSortedPeriods(schedule);
        List<DayOfWeek> activeDays = getActiveDays(dayMap);

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html lang=\"").append(language.getLanguage()).append("\">");
        html.append("<head><meta charset=\"UTF-8\"/>");
        html.append("<style>").append(SchedulePdfStyles.get(true, activeDays.size())).append("</style>");
        html.append("</head><body>");

        String title = ScheduleHtmlUtils.esc(bundle.getString("schedule.group.for"))
                + " " + ScheduleHtmlUtils.esc(schedule.getGroup().getTitle());
        html.append(ScheduleHtmlUtils.buildHeader(title, bundle));

        if (periods.isEmpty()) {
            html.append("<p class=\"empty-schedule\">")
                    .append(ScheduleHtmlUtils.esc(bundle.getString("schedule.empty")))
                    .append("</p>");
            html.append("</body></html>");
            return html.toString();
        }

        html.append("<table class=\"schedule\">");
        html.append("<colgroup><col class=\"col-time\"/>");
        html.append("<thead><tr>");
        html.append("<th>").append(ScheduleHtmlUtils.esc(bundle.getString("schedule.pair"))).append("</th>");
        for (DayOfWeek day : activeDays) {
            html.append("<th>").append(ScheduleHtmlUtils.esc(ScheduleHtmlUtils.getDayName(day, bundle))).append("</th>");
        }
        html.append("</tr></thead><tbody>");

        for (PeriodDTO period : periods) {
            html.append("<tbody style=\"page-break-inside: avoid;\">");
            appendWeekRow(html, "even", true, activeDays, dayMap, period);
            appendWeekRow(html, "odd", false, activeDays, dayMap, period);
            html.append("</tbody>");
        }

        html.append("</tbody></table></body></html>");
        return html.toString();
    }

    /**
     * Appends a single week row (even or odd) to the HTML.
     *
     * @param html      the string builder to append to
     * @param weekClass CSS class for the row ("even" or "odd")
     * @param even      true for even week, false for odd week
     * @param activeDays list of active days
     * @param dayMap    map of day data
     * @param period    the period to render
     */
    private void appendWeekRow(StringBuilder html, String weekClass, boolean even,
                               List<DayOfWeek> activeDays,
                               Map<DayOfWeek, DaysOfWeekWithClassesForGroupDTO> dayMap,
                               PeriodDTO period) {
        html.append("<tr class=\"").append(weekClass).append("\">");
        if (even) {
            html.append(SchedulePdfStyles.timeCellHtml(period));
        }
        for (DayOfWeek dayOfWeek : activeDays) {
            LessonsInScheduleDTO lesson = getLesson(dayMap.get(dayOfWeek), period, even);
            html.append("<td>")
                    .append(SchedulePdfStyles.lessonCardHtml(lesson, bundle))
                    .append("</td>");
        }
        html.append("</tr>");
    }

    /**
     * Returns only days that have at least one lesson in either even or odd week.
     *
     * @param dayMap map of day data keyed by day of week
     * @return ordered list of active days
     */
    private List<DayOfWeek> getActiveDays(Map<DayOfWeek, DaysOfWeekWithClassesForGroupDTO> dayMap) {
        return WEEKDAYS.stream()
                .filter(day -> {
                    DaysOfWeekWithClassesForGroupDTO dayData = dayMap.get(day);
                    if (dayData == null || dayData.getClasses() == null) {
                        return false;
                    }
                    return dayData.getClasses().stream()
                            .anyMatch(cls -> cls.getWeeks() != null
                                    && (cls.getWeeks().getEven() != null
                                    || cls.getWeeks().getOdd() != null));
                })
                .toList();
    }

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
                .toList();
    }
}
