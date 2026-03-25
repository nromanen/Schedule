import { SEMESTER_COLORS } from '../constants/semesterColors';
import {getReferenceSemester, getWeekKeyForSemester} from "../utils/dateUtils";


const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

// Collects all unique day names across all semesters, sorted by day of week
export const getAllDays = (schedules) => [
    ...new Set(schedules.flatMap(s => [
        ...(s.odd?.days ?? []),
        ...(s.even?.days ?? []),
    ]))
].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));

// Collects all unique classes across all semesters, sorted by start time
export const getAllClasses = (schedules) => Object.values(
    schedules
        .flatMap(s => [
            ...(s.odd?.classes ?? []),
            ...(s.even?.classes ?? []),
        ])
        .reduce((acc, cls) => {
            acc[cls.id] = cls;
            return acc;
        }, {})
).sort((a, b) => a.startTime.localeCompare(b.startTime));

// Merges cards from all semesters for a given week key (odd/even).
// Applies semester color to each lesson card.
// Swaps odd/even for semesters whose parity differs from the reference semester.
export const mergeCards = (schedules, targetKey, referenceSemester) => {
    const merged = {};
    const isSingleSemester = schedules.length === 1;

    schedules.forEach(({ semester, odd, even }, index) => {
        const getWeekKey = getWeekKeyForSemester(semester, referenceSemester);
        const sourceKey = getWeekKey(targetKey);
        const week = sourceKey === 'odd' ? odd : even;

        if (!week?.cards) return;
        const color = SEMESTER_COLORS[index % SEMESTER_COLORS.length];

        Object.entries(week.cards).forEach(([classId, dayCards]) => {
            if (!merged[classId]) merged[classId] = [];
            dayCards.forEach(({ day, cards }) => {
                const existing = merged[classId].find(d => d.day === day);
                const coloredCards = cards.map(c => ({
                    ...c,
                    semesterColor: isSingleSemester ? null : color,
                }));
                if (existing) {
                    existing.cards = [...existing.cards, ...coloredCards];
                } else {
                    merged[classId].push({ day, cards: coloredCards });
                }
            });
        });
    });

    return merged;
};

// Builds merged odd and even schedule objects from all semesters
export const buildMergedTeacherSchedule = (schedules) => {
    const referenceSemester = getReferenceSemester(schedules);
    const days = getAllDays(schedules);
    const classes = getAllClasses(schedules);

    return {
        odd: {
            days,
            classes,
            cards: mergeCards(schedules, 'odd', referenceSemester),
        },
        even: {
            days,
            classes,
            cards: mergeCards(schedules, 'even', referenceSemester),
        },
        referenceSemester,
    };
};