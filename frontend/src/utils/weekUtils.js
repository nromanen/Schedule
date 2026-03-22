export const transformSemesterDate = (date) => {
    const [day, month, year] = date.split('/');
    const endDateString = `${month}/${day}/${year}`;

    return new Date(endDateString);
};

export function isWeekOdd(num) {
    return num % 2 === 1;
}

export const getWeekParity = (startDate, currentDate = new Date()) => {
    const semesterStart = startDate instanceof Date ? startDate : new Date(transformSemesterDate(startDate));
    const targetDate = currentDate instanceof Date ? currentDate : new Date(transformSemesterDate(currentDate));

    semesterStart.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < semesterStart) return 0;

    const startDay = semesterStart.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // Find the first Monday AFTER the first week
    // If semester starts on Monday - next boundary is 7 days later
    // If semester starts on other day - boundary is next Monday
    const firstWeekEnd = new Date(semesterStart);
    const daysUntilNextMonday = startDay === 0 ? 1 : startDay === 1 ? 7 : 8 - startDay;
    firstWeekEnd.setDate(semesterStart.getDate() + daysUntilNextMonday);

    if (targetDate < firstWeekEnd) return 1;

    const diffTime = targetDate - firstWeekEnd;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const additionalWeeks = Math.floor(diffDays / 7) + 1;

    return additionalWeeks + 1;
};

// Returns the reference semester — the one that started earliest
export const getReferenceSemester = (schedules) => {
    return schedules.reduce((earliest, s) =>
            transformSemesterDate(s.semester.startDay) < transformSemesterDate(earliest.semester.startDay)
                ? s
                : earliest
        , schedules[0]);
};

// Returns a function that maps a week key (odd/even) for a given semester
// relative to the reference semester's parity.
// If parities match — returns the original key unchanged.
// If parities differ — swaps odd↔even.
export const getWeekKeyForSemester = (semester, referenceSemester, currentDate = new Date()) => (originalKey) => {
    const semesterWeekIsOdd = getWeekParity(semester.startDay, currentDate) % 2 === 1;
    const referenceWeekIsOdd = getWeekParity(referenceSemester.semester.startDay, currentDate) % 2 === 1;
    const isSynced = semesterWeekIsOdd === referenceWeekIsOdd;
    if (isSynced) return originalKey;
    return originalKey === 'odd' ? 'even' : 'odd';
};