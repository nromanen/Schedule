import { makeFullSchedule } from './fullScheduleMapper';

describe('makeFullSchedule', () => {
    it('should return empty arrays when schedule is empty', () => {
        const input = {
            schedule: [],
            semester: {
                semester_days: ['MONDAY', 'TUESDAY'],
                semester_classes: [{ id: 1, class_name: '1' }],
            },
        };
        const result = makeFullSchedule(input);
        expect(result.groupList).toEqual([]);
        expect(result.resultArray).toEqual([]);
    });

    it('should return empty arrays when schedule is null', () => {
        const input = {
            schedule: null,
            semester: {
                semester_days: [],
                semester_classes: [],
            },
        };
        const result = makeFullSchedule(input);
        expect(result.groupList).toEqual([]);
        expect(result.resultArray).toEqual([]);
    });

    it('should parse schedule with one group and one day', () => {
        const classItem = { id: 1, class_name: '1', startTime: '08:20', endTime: '09:40' };
        const input = {
            schedule: [
                {
                    group: { id: 1, title: '101' },
                    days: [
                        {
                            day: 'MONDAY',
                            classes: [
                                {
                                    class: classItem,
                                    weeks: {
                                        odd: { subject: 'Math', teacher: 'T1' },
                                        even: null,
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
            semester: {
                semester_days: ['MONDAY'],
                semester_classes: [classItem],
            },
        };

        const result = makeFullSchedule(input);

        expect(result.groupList).toHaveLength(1);
        expect(result.groupList[0].title).toBe('101');
        expect(result.resultArray).toHaveLength(1);
        expect(result.resultArray[0].day).toBe('MONDAY');
        expect(result.resultArray[0].classes).toHaveLength(1);
        expect(result.resultArray[0].classes[0].cards.odd[0].card).toEqual({
            subject: 'Math',
            teacher: 'T1',
        });
        expect(result.resultArray[0].classes[0].cards.even[0].card).toBeNull();
    });

    it('should handle missing day in group schedule', () => {
        const classItem = { id: 1, class_name: '1', startTime: '08:20', endTime: '09:40' };
        const input = {
            schedule: [
                {
                    group: { id: 1, title: '101' },
                    days: [], // no days
                },
            ],
            semester: {
                semester_days: ['MONDAY'],
                semester_classes: [classItem],
            },
        };

        const result = makeFullSchedule(input);
        expect(result.resultArray[0].classes[0].cards.odd[0].card).toBeNull();
        expect(result.resultArray[0].classes[0].cards.even[0].card).toBeNull();
    });

    it('should handle missing class in day schedule', () => {
        const classItem1 = { id: 1, class_name: '1', startTime: '08:20', endTime: '09:40' };
        const classItem2 = { id: 2, class_name: '2', startTime: '09:50', endTime: '11:10' };
        const input = {
            schedule: [
                {
                    group: { id: 1, title: '101' },
                    days: [
                        {
                            day: 'MONDAY',
                            classes: [
                                {
                                    class: classItem1,
                                    weeks: { odd: { subject: 'Math' }, even: null },
                                },
                                // classItem2 is missing
                            ],
                        },
                    ],
                },
            ],
            semester: {
                semester_days: ['MONDAY'],
                semester_classes: [classItem1, classItem2],
            },
        };

        const result = makeFullSchedule(input);
        // First class has data
        expect(result.resultArray[0].classes[0].cards.odd[0].card).toBeTruthy();
        // Second class is null (missing)
        expect(result.resultArray[0].classes[1].cards.odd[0].card).toBeNull();
    });
});