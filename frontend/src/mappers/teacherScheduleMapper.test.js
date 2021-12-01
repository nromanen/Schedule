import { makeTeacherSchedule } from './teacherScheduleMapper';

describe('Teacher schedule mapper', () => {
    it('mapper result should match for the given output', () => {
        const inputData = {
            semester: {
                id: 12,
                description: '2 2020- 2021',
                year: 2021,
                startDay: '01/02/2021',
                endDay: '15/05/2021',
                currentSemester: false,
                defaultSemester: true,
                disable: false,
                semester_days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
                semester_classes: [
                    {
                        id: 1,
                        startTime: '08:20',
                        endTime: '09:40',
                        class_name: '1',
                    },
                    {
                        id: 2,
                        startTime: '09:50',
                        endTime: '11:10',
                        class_name: '2',
                    },
                    {
                        id: 3,
                        startTime: '11:30',
                        endTime: '12:50',
                        class_name: '3',
                    },
                    {
                        id: 4,
                        startTime: '13:00',
                        endTime: '14:20',
                        class_name: '4',
                    },
                    {
                        id: 7,
                        startTime: '14:40',
                        endTime: '16:00',
                        class_name: '5',
                    },
                    {
                        id: 8,
                        startTime: '16:10',
                        endTime: '17:30',
                        class_name: '6',
                    },
                ],
            },
            teacher: {
                id: 83,
                disable: false,
                name: 'Іван',
                surname: 'Житарюк',
                patronymic: 'Васильович',
                position: 'професор',
                email: null,
                department: null,
            },
            days: [
                {
                    day: 'THURSDAY',
                    even: {
                        classes: [
                            {
                                lessons: [
                                    {
                                        id: 1319,
                                        linkToMeeting: 'https://zoom.us/',
                                        subjectForSite: 'Задачі з параметрами',
                                        lessonType: 'LECTURE',
                                        group: {
                                            id: 62,
                                            disable: false,
                                            title: '53 (506)',
                                        },
                                        room: '1 к. 23 ауд.',
                                        temporary_schedule: null,
                                    },
                                ],
                                class: {
                                    id: 1,
                                    startTime: '08:20',
                                    endTime: '09:40',
                                    class_name: '1',
                                },
                            },
                        ],
                    },
                    odd: {
                        classes: [
                            {
                                lessons: [
                                    {
                                        id: 1319,
                                        linkToMeeting: 'https://zoom.us/',
                                        subjectForSite: 'Задачі з параметрами',
                                        lessonType: 'LECTURE',
                                        group: {
                                            id: 62,
                                            disable: false,
                                            title: '53 (506)',
                                        },
                                        room: '1 к. 32 ауд.',
                                        temporary_schedule: null,
                                    },
                                ],
                                class: {
                                    id: 1,
                                    startTime: '08:20',
                                    endTime: '09:40',
                                    class_name: '1',
                                },
                            },
                            {
                                lessons: [
                                    {
                                        id: 1320,
                                        linkToMeeting: 'https://zoom.us/',
                                        subjectForSite: 'Задачі з параметрами',
                                        lessonType: 'PRACTICAL',
                                        group: {
                                            id: 62,
                                            disable: false,
                                            title: '53 (506)',
                                        },
                                        room: '1 к. 23 ауд.',
                                        temporary_schedule: null,
                                    },
                                ],
                                class: {
                                    id: 2,
                                    startTime: '09:50',
                                    endTime: '11:10',
                                    class_name: '2',
                                },
                            },
                        ],
                    },
                },
            ],
        };
        const result = {
            teacher: {
                id: 83,
                disable: false,
                name: 'Іван',
                surname: 'Житарюк',
                patronymic: 'Васильович',
                position: 'професор',
                email: null,
                department: null,
            },
            semester: {
                id: 12,
                description: '2 2020- 2021',
                year: 2021,
                startDay: '01/02/2021',
                endDay: '15/05/2021',
                currentSemester: false,
                defaultSemester: true,
                disable: false,
                semester_days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
                semester_classes: [
                    {
                        id: 1,
                        startTime: '08:20',
                        endTime: '09:40',
                        class_name: '1',
                    },
                    {
                        id: 2,
                        startTime: '09:50',
                        endTime: '11:10',
                        class_name: '2',
                    },
                    {
                        id: 3,
                        startTime: '11:30',
                        endTime: '12:50',
                        class_name: '3',
                    },
                    {
                        id: 4,
                        startTime: '13:00',
                        endTime: '14:20',
                        class_name: '4',
                    },
                    {
                        id: 7,
                        startTime: '14:40',
                        endTime: '16:00',
                        class_name: '5',
                    },
                    {
                        id: 8,
                        startTime: '16:10',
                        endTime: '17:30',
                        class_name: '6',
                    },
                ],
            },
            odd: {
                days: ['THURSDAY'],
                classes: [
                    {
                        id: 1,
                        startTime: '08:20',
                        endTime: '09:40',
                        class_name: '1',
                    },
                    {
                        id: 2,
                        startTime: '09:50',
                        endTime: '11:10',
                        class_name: '2',
                    },
                ],
                cards: [
                    undefined,
                    [
                        {
                            day: 'THURSDAY',
                            cards: [
                                {
                                    id: 1319,
                                    linkToMeeting: 'https://zoom.us/',
                                    subjectForSite: 'Задачі з параметрами',
                                    lessonType: 'LECTURE',
                                    group: {
                                        id: 62,
                                        disable: false,
                                        title: '53 (506)',
                                    },
                                    room: '1 к. 32 ауд.',
                                    temporary_schedule: null,
                                },
                            ],
                        },
                    ],
                    [
                        {
                            day: 'THURSDAY',
                            cards: [
                                {
                                    id: 1320,
                                    linkToMeeting: 'https://zoom.us/',
                                    subjectForSite: 'Задачі з параметрами',
                                    lessonType: 'PRACTICAL',
                                    group: {
                                        id: 62,
                                        disable: false,
                                        title: '53 (506)',
                                    },
                                    room: '1 к. 23 ауд.',
                                    temporary_schedule: null,
                                },
                            ],
                        },
                    ],
                ],
            },
            even: {
                days: ['THURSDAY'],
                classes: [
                    {
                        id: 1,
                        startTime: '08:20',
                        endTime: '09:40',
                        class_name: '1',
                    },
                ],
                cards: [
                    undefined,
                    [
                        {
                            day: 'THURSDAY',
                            cards: [
                                {
                                    id: 1319,
                                    linkToMeeting: 'https://zoom.us/',
                                    subjectForSite: 'Задачі з параметрами',
                                    lessonType: 'LECTURE',
                                    group: {
                                        id: 62,
                                        disable: false,
                                        title: '53 (506)',
                                    },
                                    room: '1 к. 23 ауд.',
                                    temporary_schedule: null,
                                },
                            ],
                        },
                    ],
                ],
            },
        };
        expect(makeTeacherSchedule(inputData)).toEqual(result);
    });
    it('returns empty odd and even objects if days is empty', () => {
        const inputData = {
            semester: {
                id: 12,
                description: '2 2020- 2021',
                year: 2021,
                startDay: '01/02/2021',
                endDay: '15/05/2021',
                currentSemester: false,
                defaultSemester: true,
                disable: false,
                semester_days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
                semester_classes: [
                    {
                        id: 1,
                        startTime: '08:20',
                        endTime: '09:40',
                        class_name: '1',
                    },
                    {
                        id: 2,
                        startTime: '09:50',
                        endTime: '11:10',
                        class_name: '2',
                    },
                    {
                        id: 3,
                        startTime: '11:30',
                        endTime: '12:50',
                        class_name: '3',
                    },
                    {
                        id: 4,
                        startTime: '13:00',
                        endTime: '14:20',
                        class_name: '4',
                    },
                    {
                        id: 7,
                        startTime: '14:40',
                        endTime: '16:00',
                        class_name: '5',
                    },
                    {
                        id: 8,
                        startTime: '16:10',
                        endTime: '17:30',
                        class_name: '6',
                    },
                ],
            },
            teacher: {
                id: 83,
                disable: false,
                name: 'Іван',
                surname: 'Житарюк',
                patronymic: 'Васильович',
                position: 'професор',
                email: null,
                department: null,
            },
            days: [],
        };
        expect(makeTeacherSchedule(inputData).odd).toEqual({});
        expect(makeTeacherSchedule(inputData).even).toEqual({});
    });
    it('returns semester and teacher without changes', () => {
        const inputData = {
            semester: {
                id: 12,
                description: '2 2020- 2021',
                year: 2021,
                startDay: '01/02/2021',
                endDay: '15/05/2021',
                currentSemester: false,
                defaultSemester: true,
                disable: false,
                semester_days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
                semester_classes: [
                    {
                        id: 1,
                        startTime: '08:20',
                        endTime: '09:40',
                        class_name: '1',
                    },
                    {
                        id: 2,
                        startTime: '09:50',
                        endTime: '11:10',
                        class_name: '2',
                    },
                    {
                        id: 3,
                        startTime: '11:30',
                        endTime: '12:50',
                        class_name: '3',
                    },
                    {
                        id: 4,
                        startTime: '13:00',
                        endTime: '14:20',
                        class_name: '4',
                    },
                    {
                        id: 7,
                        startTime: '14:40',
                        endTime: '16:00',
                        class_name: '5',
                    },
                    {
                        id: 8,
                        startTime: '16:10',
                        endTime: '17:30',
                        class_name: '6',
                    },
                ],
            },
            teacher: {
                id: 83,
                disable: false,
                name: 'Іван',
                surname: 'Житарюк',
                patronymic: 'Васильович',
                position: 'професор',
                email: null,
                department: null,
            },
            days: [],
        };
        expect(makeTeacherSchedule(inputData).semester).toEqual(inputData.semester);
        expect(makeTeacherSchedule(inputData).teacher).toEqual(inputData.teacher);
    });
});
