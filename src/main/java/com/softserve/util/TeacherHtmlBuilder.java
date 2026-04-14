package com.softserve.util;

import com.softserve.dto.*;
import com.softserve.entity.enums.LessonType;
import lombok.extern.slf4j.Slf4j;

import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Builds styled HTML for a teacher schedule using rowspan-based layout.
 *
 * <p>Key differences from group schedule:</p>
 * <ul>
 *   <li>Only days that have at least one lesson are shown as columns</li>
 *   <li>Only periods from the earliest occupied to the latest occupied are shown as rows</li>
 *   <li>Even/odd weeks are at the day level (not lesson level)</li>
 *   <li>Each period can have multiple lessons (teacher teaches several groups)</li>
 *   <li>Cards show group name instead of teacher name</li>
 * </ul>
 */
@Slf4j
public class TeacherHtmlBuilder {

    private ResourceBundle bundle;

    /**
     * Builds a complete HTML document for a teacher schedule.
     *
     * @param schedule the teacher schedule data
     * @param language the locale for labels and day names
     * @return HTML string ready for PDF rendering
     */
    public String buildHtml(ScheduleForTeacherDTO schedule, Locale language) {
        bundle = ResourceBundle.getBundle("messages", language);

        Map<DayOfWeek, DaysOfWeekWithClassesForTeacherDTO> dayMap = new LinkedHashMap<>();
        if (schedule.getDays() != null) {
            for (DaysOfWeekWithClassesForTeacherDTO day : schedule.getDays()) {
                dayMap.put(day.getDay(), day);
            }
        }

        List<DayOfWeek> activeDays = getActiveDays(dayMap);
        List<PeriodDTO> periods = trimPeriodsToOccupied(collectSortedPeriods(schedule), dayMap);

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html lang=\"").append(language.getLanguage()).append("\">");
        html.append("<head><meta charset=\"UTF-8\"/>");
        html.append("<style>").append(SchedulePdfStyles.get(false, activeDays.size())).append("</style>");
        html.append("</head><body>");

        html.append(ScheduleHtmlUtils.buildHeader(buildTeacherTitle(schedule), bundle));

        if (periods.isEmpty()) {
            html.append("<p class=\"empty-schedule\">")
                    .append(ScheduleHtmlUtils.esc(bundle.getString("schedule.empty")))
                    .append("</p>");
            html.append("</body></html>");
            return html.toString();
        }

        html.append("<table class=\"schedule\">");
        html.append("<thead><tr>");
        html.append("<th>")
                .append(ScheduleHtmlUtils.esc(bundle.getString("schedule.pair")))
                .append("</th>");
        for (DayOfWeek day : activeDays) {
            html.append("<th>")
                    .append(ScheduleHtmlUtils.esc(ScheduleHtmlUtils.getDayName(day, bundle)))
                    .append("</th>");
        }
        html.append("</tr></thead><tbody>");

        for (PeriodDTO period : periods) {
            appendWeekRow(html, "even", true, activeDays, dayMap, period);
            appendWeekRow(html, "odd", false, activeDays, dayMap, period);
        }

        html.append("</tbody></table></body></html>");
        return html.toString();
    }

    private void appendWeekRow(StringBuilder html, String weekClass, boolean even,
                               List<DayOfWeek> activeDays,
                               Map<DayOfWeek, DaysOfWeekWithClassesForTeacherDTO> dayMap,
                               PeriodDTO period) {
        html.append("<tr class=\"").append(weekClass).append("\">");
        if (even) {
            html.append(SchedulePdfStyles.timeCellHtml(period));
        }
        for (DayOfWeek dayOfWeek : activeDays) {
            DaysOfWeekWithClassesForTeacherDTO dayData = dayMap.get(dayOfWeek);
            List<LessonForTeacherScheduleDTO> lessons = findLessonsForPeriod(
                    dayData != null
                            ? (even ? dayData.getEvenWeek() : dayData.getOddWeek())
                            : null,
                    period);
            html.append("<td>").append(renderLessons(lessons)).append("</td>");
        }
        html.append("</tr>");
    }

    private String buildTeacherTitle(ScheduleForTeacherDTO schedule) {
        TeacherDTO teacher = schedule.getTeacher();
        StringBuilder title = new StringBuilder();
        title.append(ScheduleHtmlUtils.esc(bundle.getString("schedule.group.for")))
                .append(" ")
                .append(ScheduleHtmlUtils.esc(ScheduleHtmlUtils.formatTeacherFull(teacher)));
        if (teacher != null && teacher.getPosition() != null
                && !teacher.getPosition().isBlank()) {
            title.append(", ")
                    .append(ScheduleHtmlUtils.esc(teacher.getPosition()));
        }
        if (schedule.getSemester() != null
                && schedule.getSemester().getDescription() != null
                && !schedule.getSemester().getDescription().isBlank()) {
            title.append(" (")
                    .append(ScheduleHtmlUtils.esc(schedule.getSemester().getDescription()))
                    .append(")");
        }
        return title.toString();
    }

    // ==================== Rendering ====================

    /**
     * Merges multiple lessons for the same period into a single card.
     * Groups are listed comma-separated. If subjects differ, the most frequent one is used.
     *
     * @param lessons list of lessons for a single period
     * @return HTML string for the merged card
     */
    private String renderLessons(List<LessonForTeacherScheduleDTO> lessons) {
        if (lessons.isEmpty()) {
            return SchedulePdfStyles.emptyHtml();
        }

        // Pick subject: most frequent, or first if tie
        String subject = lessons.stream()
                .collect(Collectors.groupingBy(
                        l -> l.getSubjectForSite() != null ? l.getSubjectForSite() : "",
                        Collectors.counting()))
                .entrySet().stream()
                .max(Comparator.<Map.Entry<String, Long>, Long>comparing(Map.Entry::getValue)
                        .thenComparing(e -> -lessons.indexOf(
                                lessons.stream()
                                        .filter(l -> e.getKey().equals(l.getSubjectForSite()))
                                        .findFirst().orElse(null))))
                .map(Map.Entry::getKey)
                .orElse("");

        // Pick representative lesson: first with chosen subject, or just first
        LessonForTeacherScheduleDTO representative = lessons.stream()
                .filter(l -> subject.equals(l.getSubjectForSite()))
                .findFirst()
                .orElse(lessons.get(0));

        // Collect all group names
        String groups = lessons.stream()
                .filter(l -> l.getGroup() != null && l.getGroup().getTitle() != null)
                .map(l -> l.getGroup().getTitle())
                .distinct()
                .sorted()
                .collect(Collectors.joining(", "));

        String room = representative.getRoom();
        String link = representative.getLinkToMeeting();
        boolean hasRoom = room != null && !room.isBlank();
        boolean hasLink = link != null && !link.isBlank();

        String cssType = representative.getLessonType() != null
                ? representative.getLessonType().getCssClass()
                : LessonType.LECTURE.getCssClass();

        StringBuilder sb = new StringBuilder();
        sb.append("<div class=\"card card--").append(cssType).append("\">");
        sb.append("<div class=\"card__subject\">").append(ScheduleHtmlUtils.esc(subject)).append("</div>");
        if (!groups.isEmpty()) {
            sb.append("<div class=\"card__info\">").append(ScheduleHtmlUtils.esc(groups)).append("</div>");
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

    // ==================== Active days ====================

    /**
     * Returns only days of the week that have at least one lesson.
     *
     * @param dayMap map of day data keyed by day of week
     * @return ordered list of active days
     */
    private List<DayOfWeek> getActiveDays(Map<DayOfWeek, DaysOfWeekWithClassesForTeacherDTO> dayMap) {
        List<DayOfWeek> allDays = List.of(
                DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY
        );
        return allDays.stream()
                .filter(d -> {
                    DaysOfWeekWithClassesForTeacherDTO data = dayMap.get(d);
                    if (data == null) {
                        return false;
                    }
                    return hasLessons(data.getEvenWeek()) || hasLessons(data.getOddWeek());
                })
                .toList();
    }

    /**
     * Checks whether a week has any non-empty lessons.
     *
     * @param week week data (even or odd)
     * @return true if at least one lesson exists
     */
    private boolean hasLessons(ClassesInScheduleForTeacherDTO week) {
        if (week == null || week.getPeriods() == null) {
            return false;
        }
        return week.getPeriods().stream()
                .anyMatch(c -> c.getLessons() != null && c.getLessons().stream()
                        .anyMatch(l -> l.getSubjectForSite() != null && !l.getSubjectForSite().isBlank()));
    }

    // ==================== Period range ====================

    /**
     * Trims the full list of periods to only those from the earliest occupied
     * to the latest occupied (inclusive), keeping empty ones in between.
     *
     * @param allPeriods all sorted periods
     * @param dayMap     map of day data
     * @return sublist of periods from first occupied to last occupied
     */
    private List<PeriodDTO> trimPeriodsToOccupied(List<PeriodDTO> allPeriods,
                                                  Map<DayOfWeek, DaysOfWeekWithClassesForTeacherDTO> dayMap) {
        if (allPeriods.isEmpty()) {
            return allPeriods;
        }

        Set<Long> occupiedPeriodIds = new HashSet<>();
        for (DaysOfWeekWithClassesForTeacherDTO day : dayMap.values()) {
            collectOccupiedPeriodIds(day.getEvenWeek(), occupiedPeriodIds);
            collectOccupiedPeriodIds(day.getOddWeek(), occupiedPeriodIds);
        }

        int first = -1;
        int last = -1;
        for (int i = 0; i < allPeriods.size(); i++) {
            if (occupiedPeriodIds.contains(allPeriods.get(i).getId())) {
                if (first == -1) {
                    first = i;
                }
                last = i;
            }
        }

        if (first == -1) {
            return allPeriods;
        }
        return allPeriods.subList(first, last + 1);
    }

    /**
     * Collects period IDs that have at least one non-empty lesson.
     *
     * @param week week data (even or odd)
     * @param ids  set to collect occupied period IDs into
     */
    private void collectOccupiedPeriodIds(ClassesInScheduleForTeacherDTO week, Set<Long> ids) {
        if (week == null || week.getPeriods() == null) {
            return;
        }
        for (ClassForTeacherScheduleDTO cls : week.getPeriods()) {
            if (cls.getPeriod() != null && cls.getLessons() != null) {
                boolean hasLesson = cls.getLessons().stream()
                        .anyMatch(l -> l.getSubjectForSite() != null && !l.getSubjectForSite().isBlank());
                if (hasLesson) {
                    ids.add(cls.getPeriod().getId());
                }
            }
        }
    }

    // ==================== Helpers ====================

    /**
     * Finds all non-empty lessons for a given period within a week.
     *
     * @param weekData week data (even or odd)
     * @param period   the period to search for
     * @return list of lessons, or empty list
     */
    private List<LessonForTeacherScheduleDTO> findLessonsForPeriod(
            ClassesInScheduleForTeacherDTO weekData, PeriodDTO period) {
        if (weekData == null || weekData.getPeriods() == null) {
            return Collections.emptyList();
        }
        return weekData.getPeriods().stream()
                .filter(c -> c.getPeriod() != null && c.getPeriod().getId().equals(period.getId()))
                .flatMap(c -> c.getLessons() != null ? c.getLessons().stream() : java.util.stream.Stream.empty())
                .filter(l -> l.getSubjectForSite() != null && !l.getSubjectForSite().isBlank())
                .toList();
    }

    /**
     * Collects all unique periods from both even and odd weeks of all days.
     *
     * @param schedule the teacher schedule
     * @return sorted list of unique periods
     */
    private List<PeriodDTO> collectSortedPeriods(ScheduleForTeacherDTO schedule) {
        Map<Long, PeriodDTO> map = new LinkedHashMap<>();
        if (schedule.getDays() != null) {
            for (DaysOfWeekWithClassesForTeacherDTO day : schedule.getDays()) {
                collectPeriodsFromWeek(day.getEvenWeek(), map);
                collectPeriodsFromWeek(day.getOddWeek(), map);
            }
        }
        return map.values().stream()
                .sorted(Comparator.comparing(PeriodDTO::getStartTime))
                .toList();
    }

    /**
     * Adds periods from a single week into the collection map.
     *
     * @param week week data
     * @param map  map to collect periods into (keyed by period ID)
     */
    private void collectPeriodsFromWeek(ClassesInScheduleForTeacherDTO week, Map<Long, PeriodDTO> map) {
        if (week == null || week.getPeriods() == null) {
            return;
        }
        for (ClassForTeacherScheduleDTO cls : week.getPeriods()) {
            if (cls.getPeriod() != null) {
                map.putIfAbsent(cls.getPeriod().getId(), cls.getPeriod());
            }
        }
    }
}
