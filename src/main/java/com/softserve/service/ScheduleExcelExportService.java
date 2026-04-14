package com.softserve.service;

import com.softserve.dto.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.DayOfWeek;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Service for exporting schedule data to XLSX format.
 */
@Service
public class ScheduleExcelExportService {

    private static final Map<String, String> DAY_NAMES = Map.of(
            "MONDAY", "Понеділок", "TUESDAY", "Вівторок", "WEDNESDAY", "Середа",
            "THURSDAY", "Четвер", "FRIDAY", "П'ятниця", "SATURDAY", "Субота", "SUNDAY", "Неділя"
    );

    private static final Map<String, byte[]> LESSON_TYPE_COLORS = Map.of(
            "LECTURE", new byte[]{(byte) 0xB8, (byte) 0xD4, (byte) 0xE3},
            "PRACTICAL", new byte[]{(byte) 0xC8, (byte) 0xE6, (byte) 0xC9},
            "LABORATORY", new byte[]{(byte) 0xFF, (byte) 0xE0, (byte) 0xB2}
    );

    private static final Map<String, String> LESSON_TYPE_NAMES = new LinkedHashMap<>() {{
        put("LECTURE", "Лекція");
        put("PRACTICAL", "Практична");
        put("LABORATORY", "Лабораторна");
    }};

    private static final Map<String, String> POSITION_SHORT = Map.of(
            "професор", "проф.", "доцент", "доц.", "асистент", "ас.",
            "старший викладач", "ст.вик.", "викладач", "вик."
    );

    private static final Map<String, String> SPECIALTY_MAP = Map.ofEntries(
            Map.entry("01", "Комп'ютерні науки"),
            Map.entry("11", "Комп'ютерні науки"),
            Map.entry("21", "Комп'ютерні науки"),
            Map.entry("02", "Прикладна математика"),
            Map.entry("05", "Математика"),
            Map.entry("06", "Середня освіта (математика)"),
            Map.entry("07", "Системний аналіз"),
            Map.entry("08", "Середня освіта (інформатика)")
    );

    private String facultyName = "Фізико-математичний факультет";
    private String rectorName = "проф.Білоскурський Р.Р.";

    private static final int GC = 3;
    private static final int COL_WIDTH_CHARS = 16;

    private CellStyle headerStyle;
    private CellStyle dayStyle;
    private CellStyle periodStyle;
    private CellStyle weekStyle;
    private CellStyle subjStyle;
    private CellStyle teacherStyle;
    private CellStyle roomStyle;
    private CellStyle specStyle;
    private CellStyle smallFontStyle;
    private CellStyle smallBoldStyle;
    private CellStyle bigBoldStyle;
    private Map<String, CellStyle> subjColorStyles;
    private Map<String, CellStyle> teacherColorStyles;
    private Map<String, CellStyle> roomColorStyles;

    private final AtomicInteger emptyCounter = new AtomicInteger(0);

    /**
     * Default constructor.
     */
    public ScheduleExcelExportService() {
    }

    /**
     * Constructor with configurable faculty and rector names.
     *
     * @param facultyName the faculty name
     * @param rectorName  the rector name
     */
    public ScheduleExcelExportService(String facultyName, String rectorName) {
        this.facultyName = facultyName;
        this.rectorName = rectorName;
    }

    /**
     * Export schedule data to XLSX byte array.
     *
     * @param scheduleData the full schedule data
     * @return byte array containing the XLSX file
     * @throws IOException if writing fails
     */
    public byte[] exportToXlsx(ScheduleFullDTO scheduleData) throws IOException {
        emptyCounter.set(0);

        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            initStyles(wb);
            Sheet ws = wb.createSheet("Розклад");

            SemesterDTO semester = scheduleData.getSemester();
            List<ScheduleForGroupDTO> scheduleList = scheduleData.getSchedule();
            List<GroupDTO> groups = scheduleList.stream()
                    .map(ScheduleForGroupDTO::getGroup)
                    .collect(Collectors.toList());
            List<PeriodDTO> periods = new ArrayList<>(semester.getPeriods());
            periods.sort(Comparator.comparing(PeriodDTO::getStartTime));
            List<DayOfWeek> daysOrder = new ArrayList<>(semester.getDaysOfWeek());

            var lookup = buildLookup(scheduleList);
            int ng = groups.size();
            int lastCol = GC + ng - 1;

            writeHeader(ws, semester, groups, ng, lastCol);
            int row = writeScheduleData(ws, daysOrder, periods, groups, ng, lookup);

            writeLegend(ws, row);
            applyColumnWidths(ws, ng);
            applyAutoRowHeights(ws, 7, row, ng);
            ws.createFreezePane(GC, 7);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            wb.write(bos);
            return bos.toByteArray();
        }
    }

    // ========================= HEADER =========================

    /**
     * Write the document header: approval block, title, specialties, group names.
     *
     * @param ws      the sheet
     * @param semester semester data
     * @param groups  list of groups
     * @param ng      number of groups
     * @param lastCol last column index
     */
    private void writeHeader(Sheet ws, SemesterDTO semester, List<GroupDTO> groups,
                             int ng, int lastCol) {
        int midCol = (GC + lastCol) / 2;

        // Approval block
        mergeSafe(ws, 0, 0, midCol, lastCol);
        setCellValue(ws, 0, midCol, "\"ЗАТВЕРДЖУЮ\":", smallBoldStyle);

        mergeSafe(ws, 1, 1, midCol, lastCol);
        setCellValue(ws, 1, midCol,
                "Ректор університету                                          " + rectorName,
                smallFontStyle);

        mergeSafe(ws, 2, 2, midCol, lastCol);
        String year;
        if (semester.getYear() != 0) {
            year = String.valueOf(semester.getYear());
        } else {
            year = "";
        }
        setCellValue(ws, 2, midCol,
                "\"______\"_______________ " + year + "р.", smallFontStyle);

        // Title
        mergeSafe(ws, 4, 4, 0, lastCol);
        setCellValue(ws, 4, 0, String.format("РОЗКЛАД ЗАНЯТЬ  %s  %s (%s-%s)",
                facultyName, semester.getDescription(),
                semester.getStartDay(), semester.getEndDay()), bigBoldStyle);

        writeSpecialtiesRow(ws, groups, ng);
        writeGroupHeaders(ws, groups, ng);
    }

    /**
     * Write the specialties row with merged spans for same specialty.
     *
     * @param ws     the sheet
     * @param groups list of groups
     * @param ng     number of groups
     */
    private void writeSpecialtiesRow(Sheet ws, List<GroupDTO> groups, int ng) {
        int specRow = 5;
        mergeSafe(ws, specRow, specRow, 0, GC - 1);
        setCellValue(ws, specRow, 0, "спеціаль-\nність", specStyle);

        int gi = 0;
        while (gi < ng) {
            String specName = getSpecialtyName(groups.get(gi).getTitle());
            int gj = gi + 1;
            while (gj < ng && getSpecialtyName(groups.get(gj).getTitle()).equals(specName)) {
                gj++;
            }
            int c1 = GC + gi;
            int c2 = GC + gj - 1;
            if (c2 > c1) {
                mergeSafe(ws, specRow, specRow, c1, c2);
            }
            setCellValue(ws, specRow, c1, specName, specStyle);
            applyBorderRange(ws, specRow, c1, specRow, c2);
            gi = gj;
        }
    }

    /**
     * Write the group header row.
     *
     * @param ws     the sheet
     * @param groups list of groups
     * @param ng     number of groups
     */
    private void writeGroupHeaders(Sheet ws, List<GroupDTO> groups, int ng) {
        int hrow = 6;
        setCellValue(ws, hrow, 0, "День", headerStyle);
        setCellValue(ws, hrow, 1, "Пара", headerStyle);
        setCellValue(ws, hrow, 2, "Тиждень", headerStyle);
        for (int gi = 0; gi < ng; gi++) {
            setCellValue(ws, hrow, GC + gi, groups.get(gi).getTitle(), headerStyle);
        }
    }

    // ========================= SCHEDULE DATA =========================

    /**
     * Write all schedule data rows and return the next available row index.
     *
     * @param ws       the sheet
     * @param daysOrder ordered days of week
     * @param periods  sorted periods
     * @param groups   list of groups
     * @param ng       number of groups
     * @param lookup   schedule lookup map
     * @return the next row index after all data
     */
    private int writeScheduleData(Sheet ws, List<DayOfWeek> daysOrder, List<PeriodDTO> periods,
                                  List<GroupDTO> groups, int ng,
                                  Map<Long, Map<DayOfWeek, Map<Long,
                                          LessonInScheduleByWeekDTO>>> lookup) {
        int row = 7;
        List<Integer> periodRowStarts = new ArrayList<>();
        Set<Long> weekMidRows = new HashSet<>();

        for (DayOfWeek day : daysOrder) {
            int lastPi = findLastUsedPeriod(day, periods, groups, lookup);
            if (lastPi < 0) {
                lastPi = 0;
            }
            int dayStart = row;

            for (int pi = 0; pi <= lastPi; pi++) {
                PeriodDTO period = periods.get(pi);
                periodRowStarts.add(row);

                row = writePeriodBlock(ws, row, day, period, groups, ng, lookup,
                        weekMidRows);
            }

            writeDayColumn(ws, dayStart, row - 1, day);
        }

        applyFullGridThenFixPeriods(ws, 7, 0, row - 1, GC + ng - 1,
                periodRowStarts, GC, weekMidRows);
        return row;
    }

    /**
     * Write a single period block (6 rows) and return the next row index.
     *
     * @param ws          the sheet
     * @param row         current row
     * @param day         day of week
     * @param period      the period
     * @param groups      list of groups
     * @param ng          number of groups
     * @param lookup      schedule lookup map
     * @param weekMidRows set to track week mid-boundaries
     * @return the next row index (row + 6)
     */
    private int writePeriodBlock(Sheet ws, int row, DayOfWeek day, PeriodDTO period,
                                 List<GroupDTO> groups, int ng,
                                 Map<Long, Map<DayOfWeek, Map<Long,
                                         LessonInScheduleByWeekDTO>>> lookup,
                                 Set<Long> weekMidRows) {
        LessonsInScheduleDTO[] odd = new LessonsInScheduleDTO[ng];
        LessonsInScheduleDTO[] even = new LessonsInScheduleDTO[ng];
        boolean[] sameFlags = new boolean[ng];

        for (int gi = 0; gi < ng; gi++) {
            var weeks = lookup.getOrDefault(groups.get(gi).getId(), Map.of())
                    .getOrDefault(day, Map.of())
                    .get(period.getId());
            if (weeks != null) {
                odd[gi] = weeks.getOdd();
                even[gi] = weeks.getEven();
            } else {
                odd[gi] = null;
                even[gi] = null;
            }
            sameFlags[gi] = lessonsEqual(odd[gi], even[gi]);
        }

        writePeriodAndWeekLabels(ws, row, period);

        boolean[] mergedV = writeVerticallyMerged(ws, row, ng, odd, sameFlags);
        markWeekMidBoundaries(weekMidRows, row, ng, mergedV);

        writeWeekPass(ws, row, 0, ng, odd, mergedV, GC);
        writeWeekPass(ws, row, 3, ng, even, mergedV, GC);

        return row + 6;
    }

    /**
     * Write period number and week labels for a period block.
     *
     * @param ws     the sheet
     * @param row    starting row of the period
     * @param period the period
     */
    private void writePeriodAndWeekLabels(Sheet ws, int row, PeriodDTO period) {
        mergeSafe(ws, row, row + 5, 1, 1);
        setCellValue(ws, row, 1, period.getName(), periodStyle);
        applyBorderRange(ws, row, 1, row + 5, 1);

        mergeSafe(ws, row, row + 2, 2, 2);
        setCellValue(ws, row, 2, "1-й тижд.", weekStyle);
        applyBorderRange(ws, row, 2, row + 2, 2);

        mergeSafe(ws, row + 3, row + 5, 2, 2);
        setCellValue(ws, row + 3, 2, "2-й тижд.", weekStyle);
        applyBorderRange(ws, row + 3, 2, row + 5, 2);
    }

    /**
     * Write vertically merged cells for groups where odd == even.
     *
     * @param ws        the sheet
     * @param row       starting row of the period
     * @param ng        number of groups
     * @param odd       odd week lessons
     * @param sameFlags flags indicating odd == even
     * @return boolean array indicating which groups were vertically merged
     */
    private boolean[] writeVerticallyMerged(Sheet ws, int row, int ng,
                                            LessonsInScheduleDTO[] odd,
                                            boolean[] sameFlags) {
        boolean[] mergedV = new boolean[ng];
        int gi = 0;
        while (gi < ng) {
            if (!sameFlags[gi]) {
                gi++;
                continue;
            }
            String ki = lessonKey(odd[gi]);
            int gj = gi + 1;
            while (gj < ng && sameFlags[gj]
                    && Objects.equals(lessonKey(odd[gj]), ki)) {
                gj++;
            }

            var lesson = odd[gi];
            int c1 = GC + gi;
            int c2 = GC + gj - 1;
            String lt;
            String subj;
            String tch;
            String rm;
            if (lesson != null) {
                lt = lesson.getLessonType();
                subj = nullSafe(lesson.getSubjectForSite());
                tch = formatTeacher(lesson.getTeacher());
                rm = formatRoom(lesson.getRoom());
            } else {
                lt = null;
                subj = "";
                tch = "";
                rm = "";
            }

            applyFillRange(ws, row, c1, row + 5, c2, lt);
            mergeSafe(ws, row, row + 1, c1, c2);
            setCellValue(ws, row, c1, subj, getSubjStyle(lt));
            mergeSafe(ws, row + 2, row + 3, c1, c2);
            setCellValue(ws, row + 2, c1, tch, getTeacherStyle(lt));
            mergeSafe(ws, row + 4, row + 5, c1, c2);
            setCellValue(ws, row + 4, c1, rm, getRoomStyle(lt));

            for (int g = gi; g < gj; g++) {
                mergedV[g] = true;
            }
            gi = gj;
        }
        return mergedV;
    }

    /**
     * Mark week mid-boundary rows for non-vertically-merged groups.
     *
     * @param weekMidRows set to add boundaries to
     * @param row         starting row of the period
     * @param ng          number of groups
     * @param mergedV     flags indicating which groups are vertically merged
     */
    private void markWeekMidBoundaries(Set<Long> weekMidRows, int row, int ng,
                                       boolean[] mergedV) {
        for (int gidx = 0; gidx < ng; gidx++) {
            if (!mergedV[gidx]) {
                weekMidRows.add((long) (row + 3) * 100000L + (GC + gidx));
            }
        }
    }

    /**
     * Write the day name column merged across all periods.
     *
     * @param ws       the sheet
     * @param dayStart first row of the day
     * @param dayEnd   last row of the day
     * @param day      day of week
     */
    private void writeDayColumn(Sheet ws, int dayStart, int dayEnd, DayOfWeek day) {
        if (dayEnd > dayStart) {
            mergeSafe(ws, dayStart, dayEnd, 0, 0);
        }
        setCellValue(ws, dayStart, 0,
                DAY_NAMES.getOrDefault(day.name(), day.name()), dayStyle);
        applyBorderRange(ws, dayStart, 0, dayEnd, 0);
    }

    // ========================= LEGEND & FORMATTING =========================

    /**
     * Write the legend row below the schedule data.
     *
     * @param ws  the sheet
     * @param row the next available row
     */
    private void writeLegend(Sheet ws, int row) {
        int legendRow = row + 1;
        setCellValue(ws, legendRow, 0, "Легенда:", periodStyle);
        int col = 1;
        for (var e : LESSON_TYPE_NAMES.entrySet()) {
            setCellValue(ws, legendRow, col, e.getValue(), getSubjStyle(e.getKey()));
            col++;
        }
    }

    /**
     * Set column widths for all columns.
     *
     * @param ws the sheet
     * @param ng number of groups
     */
    private void applyColumnWidths(Sheet ws, int ng) {
        ws.setColumnWidth(0, 11 * 256);
        ws.setColumnWidth(1, (int) (4.5 * 256));
        ws.setColumnWidth(2, 9 * 256);
        for (int i = 0; i < ng; i++) {
            ws.setColumnWidth(GC + i, COL_WIDTH_CHARS * 256);
        }
    }

    /**
     * Auto-calculate row heights based on longest text in group columns.
     *
     * @param ws       the sheet
     * @param startRow first data row
     * @param endRow   row after last data row
     * @param ng       number of groups
     */
    private void applyAutoRowHeights(Sheet ws, int startRow, int endRow, int ng) {
        int charsPerLine = (int) (COL_WIDTH_CHARS * 1.1);
        for (int r = startRow; r < endRow; r++) {
            Row sheetRow = ws.getRow(r);
            if (sheetRow == null) {
                continue;
            }
            int maxLines = 1;
            for (int c = GC; c < GC + ng; c++) {
                Cell cell = sheetRow.getCell(c);
                if (cell != null && cell.getCellType() == CellType.STRING) {
                    String val = cell.getStringCellValue();
                    if (val != null && !val.isEmpty()) {
                        int linesNeeded = (val.length() + charsPerLine - 1) / charsPerLine;
                        maxLines = Math.max(maxLines, linesNeeded);
                    }
                }
            }
            sheetRow.setHeightInPoints(Math.max(13f, maxLines * 11f));
        }
    }

    // ========================= WEEK PASS HELPER =========================

    private void writeWeekPass(Sheet ws, int periodRow, int offset, int ng,
                               LessonsInScheduleDTO[] lessons, boolean[] mergedV, int gc) {
        int baseRow = periodRow + offset;
        int gi = 0;
        while (gi < ng) {
            if (mergedV[gi]) {
                gi++;
                continue;
            }
            var lesson = lessons[gi];
            String ki = lessonKey(lesson);
            int actualEnd = gi;
            for (int g = gi + 1; g < ng; g++) {
                if (mergedV[g]) {
                    break;
                }
                if (!Objects.equals(lessonKey(lessons[g]), ki)) {
                    break;
                }
                actualEnd = g;
            }

            int c1 = gc + gi;
            int c2 = gc + actualEnd;
            String lt;
            String subj;
            String tch;
            String rm;
            if (lesson != null) {
                lt = lesson.getLessonType();
                subj = nullSafe(lesson.getSubjectForSite());
                tch = formatTeacher(lesson.getTeacher());
                rm = formatRoom(lesson.getRoom());
            } else {
                lt = null;
                subj = "";
                tch = "";
                rm = "";
            }

            applyFillRange(ws, baseRow, c1, baseRow + 2, c2, lt);
            if (c2 > c1) {
                mergeSafe(ws, baseRow, baseRow, c1, c2);
                mergeSafe(ws, baseRow + 1, baseRow + 1, c1, c2);
                mergeSafe(ws, baseRow + 2, baseRow + 2, c1, c2);
            }
            setCellValue(ws, baseRow, c1, subj, getSubjStyle(lt));
            setCellValue(ws, baseRow + 1, c1, tch, getTeacherStyle(lt));
            setCellValue(ws, baseRow + 2, c1, rm, getRoomStyle(lt));

            gi = actualEnd + 1;
        }
    }

    // ========================= GRID BORDERS =========================

    private void applyFullGridThenFixPeriods(Sheet ws, int gridR1, int gridC1,
                                             int gridR2, int gridC2,
                                             List<Integer> periodRowStarts, int gc,
                                             Set<Long> weekMidRows) {
        // Step 1: full grid thin borders
        for (int r = gridR1; r <= gridR2; r++) {
            Row row = getOrCreateRow(ws, r);
            for (int c = gridC1; c <= gridC2; c++) {
                Cell cell = getOrCreateCell(row, c);
                applyThinBorder(ws, cell);
            }
        }

        // Step 2: remove horizontal internal lines in period blocks for group cols
        Set<Integer> boundaries = new HashSet<>(periodRowStarts);
        for (int r = gridR1; r <= gridR2; r++) {
            boolean isTop = boundaries.contains(r);
            boolean isBot = boundaries.contains(r + 1) || r == gridR2;

            Row row = ws.getRow(r);
            if (row == null) {
                continue;
            }
            for (int c = gc; c <= gridC2; c++) {
                boolean isMidTop = weekMidRows.contains((long) r * 100000L + c);
                boolean isMidBotAbove = weekMidRows.contains((long) (r + 1) * 100000L + c);

                boolean keepTop = isTop || isMidTop;
                boolean keepBot = isBot || isMidBotAbove;

                if (keepTop && keepBot) {
                    continue;
                }

                Cell cell = row.getCell(c);
                if (cell == null) {
                    continue;
                }
                CellStyle ns = ws.getWorkbook().createCellStyle();
                ns.cloneStyleFrom(cell.getCellStyle());
                if (keepTop) {
                    ns.setBorderTop(BorderStyle.THIN);
                } else {
                    ns.setBorderTop(BorderStyle.NONE);
                }
                if (keepBot) {
                    ns.setBorderBottom(BorderStyle.THIN);
                } else {
                    ns.setBorderBottom(BorderStyle.NONE);
                }
                cell.setCellStyle(ns);
            }
        }
    }

    // ========================= HELPERS =========================

    private void mergeSafe(Sheet ws, int r1, int r2, int c1, int c2) {
        if (r1 == r2 && c1 == c2) {
            return;
        }
        ws.addMergedRegion(new CellRangeAddress(r1, r2, c1, c2));
    }

    private void setCellValue(Sheet ws, int row, int col, String value, CellStyle style) {
        Cell cell = getOrCreateCell(getOrCreateRow(ws, row), col);
        if (value != null) {
            cell.setCellValue(value);
        } else {
            cell.setCellValue("");
        }
        if (style != null) {
            cell.setCellStyle(style);
        }
    }

    private void applyBorderRange(Sheet ws, int r1, int c1, int r2, int c2) {
        for (int r = r1; r <= r2; r++) {
            for (int c = c1; c <= c2; c++) {
                applyThinBorder(ws, getOrCreateCell(getOrCreateRow(ws, r), c));
            }
        }
    }

    private void applyThinBorder(Sheet ws, Cell cell) {
        CellStyle ns = ws.getWorkbook().createCellStyle();
        ns.cloneStyleFrom(cell.getCellStyle());
        ns.setBorderTop(BorderStyle.THIN);
        ns.setBorderBottom(BorderStyle.THIN);
        ns.setBorderLeft(BorderStyle.THIN);
        ns.setBorderRight(BorderStyle.THIN);
        cell.setCellStyle(ns);
    }

    private void applyFillRange(Sheet ws, int r1, int c1, int r2, int c2, String lt) {
        if (lt == null || !LESSON_TYPE_COLORS.containsKey(lt)) {
            return;
        }
        byte[] rgb = LESSON_TYPE_COLORS.get(lt);
        for (int r = r1; r <= r2; r++) {
            for (int c = c1; c <= c2; c++) {
                Cell cell = getOrCreateCell(getOrCreateRow(ws, r), c);
                CellStyle ns = ws.getWorkbook().createCellStyle();
                ns.cloneStyleFrom(cell.getCellStyle());
                ((XSSFCellStyle) ns).setFillForegroundColor(new XSSFColor(rgb, null));
                ns.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                cell.setCellStyle(ns);
            }
        }
    }

    private Row getOrCreateRow(Sheet ws, int r) {
        Row row = ws.getRow(r);
        if (row != null) {
            return row;
        }
        return ws.createRow(r);
    }

    private Cell getOrCreateCell(Row row, int c) {
        Cell cell = row.getCell(c);
        if (cell != null) {
            return cell;
        }
        return row.createCell(c);
    }

    // ========================= SPECIALTY =========================

    private static String getSpecialtyCode(String title) {
        String nums = title.replaceAll("[^\\d]", "");
        if (nums.length() >= 3) {
            return nums.substring(1, 3);
        }
        if (nums.length() >= 2) {
            return nums.substring(1);
        }
        return "";
    }

    private static String getSpecialtyName(String title) {
        return SPECIALTY_MAP.getOrDefault(getSpecialtyCode(title), "");
    }

    // ========================= FORMATTING =========================

    private String shortenPosition(String pos) {
        if (pos == null || pos.isBlank()) {
            return "";
        }
        return POSITION_SHORT.getOrDefault(pos.toLowerCase().trim(),
                pos.substring(0, Math.min(4, pos.length())) + ".");
    }

    private String formatTeacher(TeacherDTO teacher) {
        if (teacher == null) {
            return "";
        }
        String pos = shortenPosition(teacher.getPosition());
        String nameStr = nullSafe(teacher.getName());
        String patronymicStr = nullSafe(teacher.getPatronymic());
        String nameInitial = "";
        if (!nameStr.isEmpty()) {
            nameInitial = nameStr.charAt(0) + ".";
        }
        String patronymicInitial = "";
        if (!patronymicStr.isEmpty()) {
            patronymicInitial = patronymicStr.charAt(0) + ".";
        }
        return (pos + nullSafe(teacher.getSurname()) + " "
                + nameInitial + patronymicInitial).trim();
    }

    private String formatRoom(RoomForScheduleDTO room) {
        if (room == null) {
            return "";
        }
        return nullSafe(room.getName());
    }

    private String nullSafe(String s) {
        if (s != null) {
            return s;
        }
        return "";
    }

    // ========================= LESSON COMPARISON =========================

    private String lessonKey(LessonsInScheduleDTO l) {
        if (l == null) {
            return "__empty__" + emptyCounter.incrementAndGet();
        }
        String roomName = "";
        if (l.getRoom() != null) {
            roomName = nullSafe(l.getRoom().getName());
        }
        String teacherId = "";
        if (l.getTeacher() != null) {
            teacherId = String.valueOf(l.getTeacher().getId());
        }
        return nullSafe(l.getSubjectForSite()) + "|"
                + nullSafe(l.getLessonType()) + "|"
                + roomName + "|"
                + teacherId;
    }

    private boolean lessonsEqual(LessonsInScheduleDTO a, LessonsInScheduleDTO b) {
        if (a == null && b == null) {
            return true;
        }
        if (a == null || b == null) {
            return false;
        }
        String roomA = null;
        if (a.getRoom() != null) {
            roomA = a.getRoom().getName();
        }
        String roomB = null;
        if (b.getRoom() != null) {
            roomB = b.getRoom().getName();
        }
        Long teacherA = null;
        if (a.getTeacher() != null) {
            teacherA = a.getTeacher().getId();
        }
        Long teacherB = null;
        if (b.getTeacher() != null) {
            teacherB = b.getTeacher().getId();
        }
        return Objects.equals(a.getSubjectForSite(), b.getSubjectForSite())
                && Objects.equals(a.getLessonType(), b.getLessonType())
                && Objects.equals(roomA, roomB)
                && Objects.equals(teacherA, teacherB);
    }

    private int findLastUsedPeriod(DayOfWeek day, List<PeriodDTO> periods,
                                   List<GroupDTO> groups,
                                   Map<Long, Map<DayOfWeek, Map<Long,
                                           LessonInScheduleByWeekDTO>>> lookup) {
        int last = -1;
        for (int pi = 0; pi < periods.size(); pi++) {
            for (GroupDTO g : groups) {
                var w = lookup.getOrDefault(g.getId(), Map.of())
                        .getOrDefault(day, Map.of())
                        .get(periods.get(pi).getId());
                if (w != null && (w.getOdd() != null || w.getEven() != null)) {
                    last = pi;
                }
            }
        }
        return last;
    }

    // ========================= LOOKUP =========================

    private Map<Long, Map<DayOfWeek, Map<Long, LessonInScheduleByWeekDTO>>> buildLookup(
            List<ScheduleForGroupDTO> scheduleList) {
        Map<Long, Map<DayOfWeek, Map<Long, LessonInScheduleByWeekDTO>>> lookup = new HashMap<>();
        for (var sched : scheduleList) {
            var dayMap = new HashMap<DayOfWeek, Map<Long, LessonInScheduleByWeekDTO>>();
            for (var dayData : sched.getDays()) {
                var periodMap = new HashMap<Long, LessonInScheduleByWeekDTO>();
                for (var cls : dayData.getClasses()) {
                    periodMap.put(cls.getPeriod().getId(), cls.getWeeks());
                }
                dayMap.put(dayData.getDay(), periodMap);
            }
            lookup.put(sched.getGroup().getId(), dayMap);
        }
        return lookup;
    }

    // ========================= STYLES =========================

    private void initStyles(XSSFWorkbook wb) {
        smallFontStyle = createStyle(wb, false, (short) 8, HorizontalAlignment.LEFT, null);
        smallBoldStyle = createStyle(wb, true, (short) 8, HorizontalAlignment.LEFT, null);
        bigBoldStyle = createStyle(wb, true, (short) 10, HorizontalAlignment.CENTER, null);

        specStyle = createStyle(wb, true, (short) 7, HorizontalAlignment.CENTER, null);
        specStyle.setWrapText(true);
        specStyle.setBorderTop(BorderStyle.THIN);
        specStyle.setBorderBottom(BorderStyle.THIN);
        specStyle.setBorderLeft(BorderStyle.THIN);
        specStyle.setBorderRight(BorderStyle.THIN);

        XSSFFont headerFnt = wb.createFont();
        headerFnt.setBold(true);
        headerFnt.setFontHeightInPoints((short) 8);
        headerFnt.setFontName("Arial");
        headerFnt.setColor(IndexedColors.WHITE.getIndex());

        headerStyle = wb.createCellStyle();
        headerStyle.setFont(headerFnt);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        ((XSSFCellStyle) headerStyle).setFillForegroundColor(
                new XSSFColor(new byte[]{0x44, 0x72, (byte) 0xC4}, null));
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);

        dayStyle = createStyle(wb, true, (short) 8, HorizontalAlignment.CENTER,
                new byte[]{(byte) 0xD9, (byte) 0xE2, (byte) 0xF3});

        periodStyle = createStyle(wb, true, (short) 8, HorizontalAlignment.CENTER, null);
        weekStyle = createStyle(wb, false, (short) 7, HorizontalAlignment.CENTER, null);

        subjStyle = createStyle(wb, true, (short) 7, HorizontalAlignment.CENTER, null);
        subjStyle.setWrapText(true);
        teacherStyle = createStyle(wb, false, (short) 7, HorizontalAlignment.CENTER, null);

        XSSFFont roomFnt = wb.createFont();
        roomFnt.setFontHeightInPoints((short) 7);
        roomFnt.setFontName("Arial");
        roomFnt.setColor(new XSSFColor(new byte[]{0x44, 0x44, 0x44}, null));
        roomStyle = wb.createCellStyle();
        roomStyle.setFont(roomFnt);
        roomStyle.setAlignment(HorizontalAlignment.CENTER);
        roomStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        subjColorStyles = new HashMap<>();
        teacherColorStyles = new HashMap<>();
        roomColorStyles = new HashMap<>();
        for (var e : LESSON_TYPE_COLORS.entrySet()) {
            XSSFColor color = new XSSFColor(e.getValue(), null);
            subjColorStyles.put(e.getKey(), cloneWithFill(wb, subjStyle, color));
            teacherColorStyles.put(e.getKey(), cloneWithFill(wb, teacherStyle, color));
            roomColorStyles.put(e.getKey(), cloneWithFill(wb, roomStyle, color));
        }
    }

    private CellStyle createStyle(XSSFWorkbook wb, boolean bold, short size,
                                  HorizontalAlignment align, byte[] fillRgb) {
        XSSFFont fnt = wb.createFont();
        fnt.setBold(bold);
        fnt.setFontHeightInPoints(size);
        fnt.setFontName("Arial");
        CellStyle style = wb.createCellStyle();
        style.setFont(fnt);
        style.setAlignment(align);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        if (fillRgb != null) {
            ((XSSFCellStyle) style).setFillForegroundColor(new XSSFColor(fillRgb, null));
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }
        return style;
    }

    private CellStyle cloneWithFill(XSSFWorkbook wb, CellStyle base, XSSFColor color) {
        CellStyle s = wb.createCellStyle();
        s.cloneStyleFrom(base);
        ((XSSFCellStyle) s).setFillForegroundColor(color);
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return s;
    }

    private CellStyle getSubjStyle(String lt) {
        if (lt != null && subjColorStyles.containsKey(lt)) {
            return subjColorStyles.get(lt);
        }
        return subjStyle;
    }

    private CellStyle getTeacherStyle(String lt) {
        if (lt != null && teacherColorStyles.containsKey(lt)) {
            return teacherColorStyles.get(lt);
        }
        return teacherStyle;
    }

    private CellStyle getRoomStyle(String lt) {
        if (lt != null && roomColorStyles.containsKey(lt)) {
            return roomColorStyles.get(lt);
        }
        return roomStyle;
    }
}
