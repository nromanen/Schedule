import { useMemo } from 'react';
import { getWeekKeyForSemester } from '../utils/dateUtils';

const DAYS_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const useMergedBusyRooms = (combinedBusyRooms, activeSemesterIds) => {
    return useMemo(() => {
        if (!combinedBusyRooms?.roomsBySemesterId || !combinedBusyRooms?.semesters) {
            return [];
        }

        const { semesters, roomsBySemesterId } = combinedBusyRooms;
        const activeSemesters = semesters.filter(s => activeSemesterIds.includes(s.id));
        if (!activeSemesters.length) return [];

        const referenceSemester = activeSemesters[0];
        const baseRooms = roomsBySemesterId[String(referenceSemester.id)] || [];

        if (activeSemesters.length === 1) return baseRooms;

        const result = JSON.parse(JSON.stringify(baseRooms));

        result.forEach(room => {
            room.schedules.forEach(schedule => {
                schedule.classes.forEach(cls => {
                    cls.even.forEach(slot => {
                        slot.lessons = slot.lessons.map(l => ({ ...l, _semesterIndex: 0 }));
                    });
                    cls.odd.forEach(slot => {
                        slot.lessons = slot.lessons.map(l => ({ ...l, _semesterIndex: 0 }));
                    });
                });
            });
        });

        const resultByRoomId = Object.fromEntries(result.map(r => [r.room_id, r]));

        activeSemesters.slice(1).forEach((semester, extraIndex) => {
            const getWeekKey = getWeekKeyForSemester(semester, { semester: referenceSemester });
            const semesterRooms = roomsBySemesterId[String(semester.id)] || [];

            semesterRooms.forEach(room => {
                const baseRoom = resultByRoomId[room.room_id];
                if (!baseRoom) return;

                const baseDayMap = Object.fromEntries(
                    baseRoom.schedules.map(d => [d.day, d])
                );

                room.schedules.forEach(schedule => {
                    if (baseDayMap[schedule.day]) {
                        const baseClasses = baseDayMap[schedule.day].classes[0];
                        const extraClasses = schedule.classes[0];

                        const evenKey = getWeekKey('even');
                        const oddKey = getWeekKey('odd');

                        const extraEven = extraClasses[evenKey] || [];
                        const extraOdd = extraClasses[oddKey] || [];

                        baseClasses.even.forEach(slot => {
                            const match = extraEven.find(s => s.class_id === slot.class_id);
                            if (match) {
                                const tagged = match.lessons.map(l => ({ ...l, _semesterIndex: extraIndex + 1 }));
                                slot.lessons.push(...tagged);
                            }
                        });

                        baseClasses.odd.forEach(slot => {
                            const match = extraOdd.find(s => s.class_id === slot.class_id);
                            if (match) {
                                const tagged = match.lessons.map(l => ({ ...l, _semesterIndex: extraIndex + 1 }));
                                slot.lessons.push(...tagged);
                            }
                        });
                    } else {
                        baseRoom.schedules.push(schedule);
                        baseRoom.schedules.sort((a, b) =>
                            DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
                        );
                    }
                });
            });
        });

        return result;
    }, [combinedBusyRooms, activeSemesterIds]);
};