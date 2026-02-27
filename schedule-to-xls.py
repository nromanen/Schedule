import json
import os
import sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

DAY_NAMES = {
    "MONDAY": "Понеділок", "TUESDAY": "Вівторок", "WEDNESDAY": "Середа",
    "THURSDAY": "Четвер", "FRIDAY": "П'ятниця", "SATURDAY": "Субота", "SUNDAY": "Неділя",
}

LESSON_TYPE_COLORS = {
    "LECTURE": "B8D4E3",
    "PRACTICAL": "C8E6C9",
    "LABORATORY": "FFE0B2",
}

LESSON_TYPE_NAMES = {
    "LECTURE": "Лекція", "PRACTICAL": "Практична", "LABORATORY": "Лабораторна",
}

POSITION_SHORT = {
    "професор": "проф.", "доцент": "доц.", "асистент": "ас.",
    "старший викладач": "ст.вик.", "викладач": "вик.",
}

# Specialty code (2nd+3rd digit of group number) -> specialty name
# Multiple codes can map to the same specialty (e.g. 01,11,21 -> КН)
SPECIALTY_MAP = {
    "01": "Комп'ютерні науки",
    "11": "Комп'ютерні науки",
    "21": "Комп'ютерні науки",
    "02": "Прикладна математика",
    "05": "Математика",
    "06": "Середня освіта (математика)",
    "07": "Системний аналіз",
    "08": "Середня освіта (інформатика)",
}


def get_specialty_code(group_title):
    """Extract specialty code from group title: '101-А' -> '01', '111-Б' -> '11'."""
    import re
    nums = re.sub(r'[^\d]', '', group_title)
    return nums[1:3] if len(nums) >= 3 else nums[1:] if len(nums) >= 2 else ""


def get_specialty_name(group_title):
    code = get_specialty_code(group_title)
    return SPECIALTY_MAP.get(code, "")

thin = Side(style='thin')
none_side = Side(style=None)
thin_border = Border(left=thin, right=thin, top=thin, bottom=thin)
no_border = Border()

# Borders for rows inside a period block: only vertical lines, no horizontal
border_top = Border(left=thin, right=thin, top=thin, bottom=none_side)
border_mid = Border(left=thin, right=thin, top=none_side, bottom=none_side)
border_bot = Border(left=thin, right=thin, top=none_side, bottom=thin)

header_fill = PatternFill('solid', fgColor='4472C4')
header_font = Font(bold=True, color='FFFFFF', size=8, name='Arial')
day_fill = PatternFill('solid', fgColor='D9E2F3')
day_font = Font(bold=True, size=8, name='Arial')
period_font = Font(bold=True, size=8, name='Arial')
week_font = Font(size=7, name='Arial')
subj_font = Font(bold=True, size=7, name='Arial')
teacher_font = Font(size=7, name='Arial')
room_font = Font(size=7, name='Arial', color='444444')
title_font = Font(bold=True, size=11, name='Arial')

center = Alignment(horizontal='center', vertical='center', wrap_text=True)
left_center = Alignment(horizontal='left', vertical='center', wrap_text=True)


def shorten_position(pos):
    if not pos:
        return ""
    pl = pos.lower().strip()
    return POSITION_SHORT.get(pl, pos[:4] + ".")


def format_teacher(teacher):
    if not teacher:
        return ""
    pos = shorten_position(teacher.get('position', ''))
    s = teacher.get('surname', '')
    n = teacher.get('name', '')
    p = teacher.get('patronymic', '')
    initials = (n[0] + '.' if n else '') + (p[0] + '.' if p else '')
    return f"{pos}{s} {initials}".strip()


def format_room(room):
    if not room:
        return ""
    name = room.get('name', '')
    # Shorten: "1 к. 40 ауд." -> "І-40" style
    # Keep as-is since the format varies
    return name


_empty_counter = 0

def lesson_key(lesson):
    global _empty_counter
    if not lesson:
        # Each empty cell gets a unique key so they never merge horizontally
        _empty_counter += 1
        return ('__empty__', _empty_counter)
    return (
        lesson.get('subjectForSite'),
        lesson.get('lessonType'),
        (lesson.get('room') or {}).get('name'),
        (lesson.get('teacher') or {}).get('id'),
    )


def lessons_equal(a, b):
    """Compare two lessons for odd/even week merging. Two Nones are equal."""
    if a is None and b is None:
        return True
    if a is None or b is None:
        return False
    return (
        a.get('subjectForSite') == b.get('subjectForSite') and
        a.get('lessonType') == b.get('lessonType') and
        (a.get('room') or {}).get('name') == (b.get('room') or {}).get('name') and
        (a.get('teacher') or {}).get('id') == (b.get('teacher') or {}).get('id')
    )


def cell_set(ws, r, c, value, font=teacher_font, fill=None, align=center, border=None):
    cell = ws.cell(row=r, column=c, value=value)
    cell.font = font
    cell.alignment = align
    if border is not None:
        cell.border = border
    if fill:
        cell.fill = fill
    return cell


def border_range(ws, r1, c1, r2, c2):
    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            ws.cell(row=r, column=c).border = thin_border


def fill_range(ws, r1, c1, r2, c2, fill):
    if not fill:
        return
    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            ws.cell(row=r, column=c).fill = fill


def apply_full_grid_then_fix_merges(ws, grid_r1, grid_c1, grid_r2, grid_c2,
                                     period_row_starts, gc, week_mid_rows):
    """
    1) Put thin borders on ALL cells in the data grid.
    2) For group columns: remove horizontal internal borders within each
       3-row sub-block (subject/teacher/room).
       Keep horizontal lines at:
       - period boundaries (top of each 6-row block)
       - week boundaries (between week1 and week2) where odd != even
    """
    # Step 1: full grid
    for r in range(grid_r1, grid_r2 + 1):
        for c in range(grid_c1, grid_c2 + 1):
            ws.cell(row=r, column=c).border = thin_border

    # Step 2: boundary rows = period starts + mid-week lines
    period_tops = set(period_row_starts)

    for r in range(grid_r1, grid_r2 + 1):
        is_period_top = r in period_tops
        is_period_bottom = (r + 1) in period_tops or r == grid_r2

        for c in range(gc, grid_c2 + 1):
            # Check if this row is a week mid-boundary for this column
            is_mid_top = (r, c) in week_mid_rows  # row+3 of period, this col has different odd/even
            is_mid_bottom_above = (r + 1, c) in week_mid_rows  # next row is mid-top

            keep_top = is_period_top or is_mid_top
            keep_bot = is_period_bottom or is_mid_bottom_above

            if not keep_top or not keep_bot:
                cell = ws.cell(row=r, column=c)
                cur = cell.border
                new_top = cur.top if keep_top else none_side
                new_bot = cur.bottom if keep_bot else none_side
                cell.border = Border(
                    top=new_top, bottom=new_bot,
                    left=cur.left, right=cur.right,
                )


def get_fill(lesson):
    lt = (lesson or {}).get('lessonType', '')
    if lt in LESSON_TYPE_COLORS:
        return PatternFill('solid', fgColor=LESSON_TYPE_COLORS[lt])
    return None


def find_last_used_period(day, periods, groups, lookup):
    last = -1
    for pi, period in enumerate(periods):
        for g in groups:
            weeks = lookup.get(g['id'], {}).get(day, {}).get(period['id'], {})
            if weeks.get('odd') or weeks.get('even'):
                last = pi
    return last


def export_xlsx(data, output_path, config=None):
    if config is None:
        config = {}
    semester = data['semester']
    groups = [s['group'] for s in data['schedule']]
    periods = sorted(semester['semester_classes'], key=lambda p: p['startTime'])
    days_order = semester['semester_days']

    # Build lookup
    lookup = {}
    for sched in data['schedule']:
        gid = sched['group']['id']
        lookup[gid] = {}
        for day_data in sched['days']:
            lookup[gid][day_data['day']] = {}
            for cls in day_data['classes']:
                lookup[gid][day_data['day']][cls['class']['id']] = cls['weeks']

    wb = Workbook()
    ws = wb.active
    ws.title = "Розклад"

    ng = len(groups)
    gc = 4  # group columns start at D (col 4): A=day, B=period, C=week
    last_col = gc + ng - 1
    mid_col = (gc + last_col) // 2  # middle column for centered text

    # ======================== CONFIGURABLE HEADER ========================
    faculty_name = config.get('faculty', 'Фізико-математичний факультет')
    rector_name = config.get('rector', 'проф.Білоскурський Р.Р.')
    semester_desc = semester['description']
    year = semester.get('year', '')
    # ====================================================================

    small_font = Font(size=8, name='Arial')
    small_bold = Font(bold=True, size=8, name='Arial')
    big_bold = Font(bold=True, size=10, name='Arial')
    right_align = Alignment(horizontal='right', vertical='center')
    left_align_v = Alignment(horizontal='left', vertical='center')

    # === Row 1: "ЗАТВЕРДЖУЮ:" (right side) ===
    ws.merge_cells(start_row=1, start_column=mid_col, end_row=1, end_column=last_col)
    cell_set(ws, 1, mid_col, '"ЗАТВЕРДЖУЮ":', font=small_bold, align=left_align_v)

    # === Row 2: "Ректор університету ... ПІБ" ===
    ws.merge_cells(start_row=2, start_column=mid_col, end_row=2, end_column=last_col)
    cell_set(ws, 2, mid_col, f'Ректор університету                                          {rector_name}',
             font=small_font, align=left_align_v)

    # === Row 3: date line ===
    ws.merge_cells(start_row=3, start_column=mid_col, end_row=3, end_column=last_col)
    cell_set(ws, 3, mid_col, f'"______"_______________ {year}р.', font=small_font, align=left_align_v)

    # === Row 4: empty spacer ===

    # === Row 5: Title - "РОЗКЛАД ЗАНЯТЬ faculty_name semester_desc" ===
    ws.merge_cells(start_row=5, start_column=1, end_row=5, end_column=last_col)
    cell_set(ws, 5, 1, f"РОЗКЛАД ЗАНЯТЬ  {faculty_name}  {semester_desc} ({semester['startDay']}-{semester['endDay']})",
             font=big_bold, align=center)

    # === Row 6: Specialties (merged spans) ===
    spec_row = 6
    spec_font = Font(bold=True, size=7, name='Arial')
    ws.merge_cells(start_row=spec_row, start_column=1, end_row=spec_row, end_column=gc - 1)
    cell_set(ws, spec_row, 1, "спеціаль-\nність", font=spec_font, border=thin_border)

    # Build specialty spans: consecutive groups with same specialty get merged
    gi = 0
    while gi < ng:
        spec_name = get_specialty_name(groups[gi]['title'])
        gj = gi + 1
        while gj < ng and get_specialty_name(groups[gj]['title']) == spec_name:
            gj += 1
        c1 = gc + gi
        c2 = gc + gj - 1
        if c2 > c1:
            ws.merge_cells(start_row=spec_row, start_column=c1, end_row=spec_row, end_column=c2)
        cell_set(ws, spec_row, c1, spec_name, font=spec_font, border=thin_border)
        border_range(ws, spec_row, c1, spec_row, c2)
        gi = gj

    # === Row 7: Group headers ===
    hrow = 7
    cell_set(ws, hrow, 1, "День", font=header_font, fill=header_fill, border=thin_border)
    cell_set(ws, hrow, 2, "Пара", font=header_font, fill=header_fill, border=thin_border)
    cell_set(ws, hrow, 3, "Тиждень", font=header_font, fill=header_fill, border=thin_border)
    for gi, g in enumerate(groups):
        cell_set(ws, hrow, gc + gi, g['title'], font=header_font, fill=header_fill, border=thin_border)

    row = 8
    period_row_starts = []  # track where each period block starts
    week_mid_rows = set()   # (row, col) pairs where week1/week2 boundary needs h-line

    for day in days_order:
        last_pi = find_last_used_period(day, periods, groups, lookup)
        if last_pi < 0:
            last_pi = 0
        active_periods = periods[:last_pi + 1]
        day_start = row
        rows_per_period = 6  # 3 sub-rows per week × 2 weeks

        for period in active_periods:
            period_row_starts.append(row)
            # Gather lessons for all groups
            group_odd = []
            group_even = []
            for g in groups:
                weeks = lookup.get(g['id'], {}).get(day, {}).get(period['id'], {})
                group_odd.append(weeks.get('odd'))
                group_even.append(weeks.get('even'))

            same_flags = [lessons_equal(group_odd[i], group_even[i]) for i in range(ng)]

            # 6 rows for this period:
            # row+0: week1 subject
            # row+1: week1 teacher
            # row+2: week1 room
            # row+3: week2 subject
            # row+4: week2 teacher
            # row+5: week2 room

            # Period number cell (merged 6 rows)
            ws.merge_cells(start_row=row, start_column=2, end_row=row + 5, end_column=2)
            cell_set(ws, row, 2, int(float(period['class_name'])) if period['class_name'].replace('.','').isdigit() else period['class_name'],
                     font=period_font)
            border_range(ws, row, 2, row + 5, 2)

            # Week labels in column C
            ws.merge_cells(start_row=row, start_column=3, end_row=row + 2, end_column=3)
            cell_set(ws, row, 3, "1-й тижд.", font=week_font)
            border_range(ws, row, 3, row + 2, 3)

            ws.merge_cells(start_row=row + 3, start_column=3, end_row=row + 5, end_column=3)
            cell_set(ws, row + 3, 3, "2-й тижд.", font=week_font)
            border_range(ws, row + 3, 3, row + 5, 3)

            # Process groups with horizontal merging
            # For each week-row-type (subj/teacher/room), find horizontal spans

            def write_lesson_rows(base_row, lessons, week_num):
                """Write 3 rows (subject, teacher, room) for a list of lessons with h-merging."""
                gi = 0
                while gi < ng:
                    ki = lesson_key(lessons[gi])
                    gj = gi + 1
                    while gj < ng and lesson_key(lessons[gj]) == ki:
                        gj += 1

                    lesson = lessons[gi]
                    c1 = gc + gi
                    c2 = gc + gj - 1
                    fill = get_fill(lesson)

                    if lesson:
                        subj = lesson.get('subjectForSite', '')
                        teacher = format_teacher(lesson.get('teacher'))
                        room = format_room(lesson.get('room'))
                    else:
                        subj = teacher = room = ''

                    # Subject row
                    if c2 > c1:
                        ws.merge_cells(start_row=base_row, start_column=c1, end_row=base_row, end_column=c2)
                    cell_set(ws, base_row, c1, subj, font=subj_font, fill=fill)
                    if fill:
                        fill_range(ws, base_row, c1, base_row, c2, fill)

                    # Teacher row
                    if c2 > c1:
                        ws.merge_cells(start_row=base_row + 1, start_column=c1, end_row=base_row + 1, end_column=c2)
                    cell_set(ws, base_row + 1, c1, teacher, font=teacher_font, fill=fill)
                    if fill:
                        fill_range(ws, base_row + 1, c1, base_row + 1, c2, fill)

                    # Room row
                    if c2 > c1:
                        ws.merge_cells(start_row=base_row + 2, start_column=c1, end_row=base_row + 2, end_column=c2)
                    cell_set(ws, base_row + 2, c1, room, font=room_font, fill=fill)
                    if fill:
                        fill_range(ws, base_row + 2, c1, base_row + 2, c2, fill)

                    gi = gj

            # Check if we can merge week1 and week2 vertically for groups where same
            # Strategy: for groups where odd==even, merge all 6 rows vertically
            # For others, write separately

            # First pass: find groups where odd==even and can be merged with adjacent same groups
            gi = 0
            merged_v = [False] * ng
            while gi < ng:
                if not same_flags[gi]:
                    gi += 1
                    continue
                ki = lesson_key(group_odd[gi])
                gj = gi + 1
                while gj < ng and same_flags[gj] and lesson_key(group_odd[gj]) == ki:
                    gj += 1

                # Merge all 6 rows for this span
                lesson = group_odd[gi]
                c1 = gc + gi
                c2 = gc + gj - 1
                fill = get_fill(lesson)

                if lesson:
                    subj = lesson.get('subjectForSite', '')
                    teacher = format_teacher(lesson.get('teacher'))
                    room = format_room(lesson.get('room'))
                else:
                    subj = teacher = room = ''

                # Apply block borders FIRST (before merge, so all cells are regular)
                if fill:
                    fill_range(ws, row, c1, row + 5, c2, fill)

                # Subject (merge rows 0-1)
                ws.merge_cells(start_row=row, start_column=c1, end_row=row + 1, end_column=c2)
                cell_set(ws, row, c1, subj, font=subj_font, fill=fill)

                # Teacher (merge rows 2-3)
                ws.merge_cells(start_row=row + 2, start_column=c1, end_row=row + 3, end_column=c2)
                cell_set(ws, row + 2, c1, teacher, font=teacher_font, fill=fill)

                # Room (merge rows 4-5)
                ws.merge_cells(start_row=row + 4, start_column=c1, end_row=row + 5, end_column=c2)
                cell_set(ws, row + 4, c1, room, font=room_font, fill=fill)

                for g in range(gi, gj):
                    merged_v[g] = True
                gi = gj

            # Second pass: write week1 and week2 separately for non-merged groups
            # Mark week mid-boundary for groups where odd != even
            for gidx in range(ng):
                if not merged_v[gidx]:
                    # row+3 is the start of week2 — needs top h-line
                    col = gc + gidx
                    week_mid_rows.add((row + 3, col))

            # Week 1 (odd)
            remaining_odd = [group_odd[i] if not merged_v[i] else None for i in range(ng)]
            remaining_even = [group_even[i] if not merged_v[i] else None for i in range(ng)]

            # Write remaining odd lessons (skip None placeholder groups)
            gi = 0
            while gi < ng:
                if merged_v[gi]:
                    gi += 1
                    continue
                lesson = remaining_odd[gi]
                ki = lesson_key(lesson)
                gj = gi + 1
                while gj < ng and not merged_v[gj] and lesson_key(remaining_odd[gj]) == ki:
                    gj += 1
                # But stop at merged_v boundary
                actual_end = gi
                for g in range(gi + 1, gj):
                    if merged_v[g]:
                        break
                    actual_end = g

                c1 = gc + gi
                c2 = gc + actual_end
                fill = get_fill(lesson)

                subj = lesson.get('subjectForSite', '') if lesson else ''
                teacher = format_teacher(lesson.get('teacher')) if lesson else ''
                room = format_room(lesson.get('room')) if lesson else ''

                if fill:
                    fill_range(ws, row, c1, row + 2, c2, fill)
                if c2 > c1:
                    ws.merge_cells(start_row=row, start_column=c1, end_row=row, end_column=c2)
                    ws.merge_cells(start_row=row + 1, start_column=c1, end_row=row + 1, end_column=c2)
                    ws.merge_cells(start_row=row + 2, start_column=c1, end_row=row + 2, end_column=c2)
                cell_set(ws, row, c1, subj, font=subj_font, fill=fill)
                cell_set(ws, row + 1, c1, teacher, font=teacher_font, fill=fill)
                cell_set(ws, row + 2, c1, room, font=room_font, fill=fill)

                gi = actual_end + 1

            # Write remaining even lessons
            gi = 0
            while gi < ng:
                if merged_v[gi]:
                    gi += 1
                    continue
                lesson = remaining_even[gi]
                ki = lesson_key(lesson)
                gj = gi + 1
                while gj < ng and not merged_v[gj] and lesson_key(remaining_even[gj]) == ki:
                    gj += 1
                actual_end = gi
                for g in range(gi + 1, gj):
                    if merged_v[g]:
                        break
                    actual_end = g

                c1 = gc + gi
                c2 = gc + actual_end
                fill = get_fill(lesson)

                subj = lesson.get('subjectForSite', '') if lesson else ''
                teacher = format_teacher(lesson.get('teacher')) if lesson else ''
                room = format_room(lesson.get('room')) if lesson else ''

                if fill:
                    fill_range(ws, row + 3, c1, row + 5, c2, fill)
                if c2 > c1:
                    ws.merge_cells(start_row=row + 3, start_column=c1, end_row=row + 3, end_column=c2)
                    ws.merge_cells(start_row=row + 4, start_column=c1, end_row=row + 4, end_column=c2)
                    ws.merge_cells(start_row=row + 5, start_column=c1, end_row=row + 5, end_column=c2)
                cell_set(ws, row + 3, c1, subj, font=subj_font, fill=fill)
                cell_set(ws, row + 4, c1, teacher, font=teacher_font, fill=fill)
                cell_set(ws, row + 5, c1, room, font=room_font, fill=fill)

                gi = actual_end + 1

            row += 6

        # Merge day column
        day_end = row - 1
        if day_end > day_start:
            ws.merge_cells(start_row=day_start, start_column=1, end_row=day_end, end_column=1)
        cell_set(ws, day_start, 1, DAY_NAMES.get(day, day), font=day_font, fill=day_fill)
        border_range(ws, day_start, 1, day_end, 1)
        fill_range(ws, day_start, 1, day_end, 1, day_fill)

    # ========== FINAL STEP: full grid borders, then fix merged cells ==========
    data_last_row = row - 1
    apply_full_grid_then_fix_merges(ws, 8, 1, data_last_row, gc + ng - 1,
                                     period_row_starts, gc, week_mid_rows)

    # Legend
    row += 1
    cell_set(ws, row, 1, "Легенда:", font=Font(bold=True, size=8, name='Arial'))
    col = 2
    for lt, name in LESSON_TYPE_NAMES.items():
        cell_set(ws, row, col, name, font=Font(size=8, name='Arial'),
                 fill=PatternFill('solid', fgColor=LESSON_TYPE_COLORS[lt]))
        col += 1

    # Column widths
    col_width = 16  # character units for group columns
    ws.column_dimensions['A'].width = 11
    ws.column_dimensions['B'].width = 4.5
    ws.column_dimensions['C'].width = 9
    for gi in range(ng):
        ws.column_dimensions[get_column_letter(gc + gi)].width = col_width

    # Row heights: auto-calculate based on longest text in group columns
    # Font size 7pt ≈ 10px line height. Column width 16 chars ≈ fits ~16 chars per line.
    chars_per_line = int(col_width * 1.1)  # approximate chars that fit in one line
    min_row_height = 13
    line_height = 11  # points per line of text at font size 7

    for r in range(8, row):
        max_lines = 1
        for c in range(gc, gc + ng):
            cell = ws.cell(r, c)
            val = cell.value
            if val and isinstance(val, str) and len(val) > 0:
                # Calculate how many lines this text needs
                lines_needed = max(1, -(-len(val) // chars_per_line))  # ceil division
                max_lines = max(max_lines, lines_needed)
        ws.row_dimensions[r].height = max(min_row_height, max_lines * line_height)

    ws.freeze_panes = 'D8'
    ws.sheet_properties.pageSetUpPr = None

    wb.save(output_path)
    print(f"Saved: {output_path}")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python schedule_to_xlsx.py <input.json> [output.xlsx]")
        print("  input.json  - JSON file with schedule data from API")
        print("  output.xlsx - output file (default: <input>.xlsx)")
        print()
        print("Environment variables (optional):")
        print("  FACULTY  - faculty name (default: Фізико-математичний факультет)")
        print("  RECTOR   - rector name  (default: проф.Білоскурський Р.Р.)")
        sys.exit(1)

    input_path = sys.argv[1]
    if len(sys.argv) > 2:
        output_path = sys.argv[2]
    else:
        output_path = os.path.splitext(input_path)[0] + '.xlsx'

    with open(input_path, encoding='utf-8') as f:
        data = json.load(f)

    config = {
        'faculty': os.environ.get('FACULTY', 'Фізико-математичний факультет'),
        'rector': os.environ.get('RECTOR', 'проф.Білоскурський Р.Р.'),
    }

    export_xlsx(data, output_path, config)