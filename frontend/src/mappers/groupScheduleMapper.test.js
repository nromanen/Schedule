import { makeGroupSchedule } from './groupScheduleMapper';

describe('Group schedule mapper', () => {
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
            schedule: [
                {
                    group: {
                        id: 41,
                        disable: false,
                        title: '33 (322)',
                    },
                    days: [
                        {
                            day: 'MONDAY',
                            classes: [
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 19,
                                                disable: false,
                                                name: 'Ігор',
                                                surname: 'Скутар',
                                                patronymic: 'Дмитрович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Серверна мова РНР',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 63,
                                                name: '1 к. 31 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 19,
                                                disable: false,
                                                name: 'Ігор',
                                                surname: 'Скутар',
                                                patronymic: 'Дмитрович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Серверна мова РНР',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 63,
                                                name: '1 к. 31 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 1,
                                        startTime: '08:20',
                                        endTime: '09:40',
                                        class_name: '1',
                                    },
                                },
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 19,
                                                disable: false,
                                                name: 'Ігор',
                                                surname: 'Скутар',
                                                patronymic: 'Дмитрович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Серверна мова РНР',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 53,
                                                name: '1 к. 18 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 19,
                                                disable: false,
                                                name: 'Ігор',
                                                surname: 'Скутар',
                                                patronymic: 'Дмитрович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Серверна мова РНР',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 53,
                                                name: '1 к. 18 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 2,
                                        startTime: '09:50',
                                        endTime: '11:10',
                                        class_name: '2',
                                    },
                                },
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 52,
                                                disable: false,
                                                name: 'Микола',
                                                surname: 'Філіпчук',
                                                patronymic: 'Петрович',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Web-дизайн',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 53,
                                                name: '1 к. 18 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 52,
                                                disable: false,
                                                name: 'Микола',
                                                surname: 'Філіпчук',
                                                patronymic: 'Петрович',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Web-дизайн',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 53,
                                                name: '1 к. 18 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 3,
                                        startTime: '11:30',
                                        endTime: '12:50',
                                        class_name: '3',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: {
                                            teacher: {
                                                id: 52,
                                                disable: false,
                                                name: 'Микола',
                                                surname: 'Філіпчук',
                                                patronymic: 'Петрович',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Web-дизайн',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 60,
                                                name: '1 к. 27 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 4,
                                        startTime: '13:00',
                                        endTime: '14:20',
                                        class_name: '4',
                                    },
                                },
                            ],
                        },
                        {
                            day: 'TUESDAY',
                            classes: [
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 75,
                                                disable: false,
                                                name: 'Анастасія',
                                                surname: 'Юрійчук',
                                                patronymic: 'Олександрівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Розробка UI/UX дизайну',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 75,
                                                disable: false,
                                                name: 'Анастасія',
                                                surname: 'Юрійчук',
                                                patronymic: 'Олександрівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Розробка UI/UX дизайну',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 1,
                                        startTime: '08:20',
                                        endTime: '09:40',
                                        class_name: '1',
                                    },
                                },
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 65,
                                                disable: false,
                                                name: 'Ярослав',
                                                surname: 'Бігун',
                                                patronymic: 'Йосипович',
                                                position: 'професор',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Числові методи',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 65,
                                                disable: false,
                                                name: 'Ярослав',
                                                surname: 'Бігун',
                                                patronymic: 'Йосипович',
                                                position: 'професор',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Числові методи',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 2,
                                        startTime: '09:50',
                                        endTime: '11:10',
                                        class_name: '2',
                                    },
                                },
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 75,
                                                disable: false,
                                                name: 'Анастасія',
                                                surname: 'Юрійчук',
                                                patronymic: 'Олександрівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Розробка UI/UX дизайну',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 60,
                                                name: '1 к. 27 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 75,
                                                disable: false,
                                                name: 'Анастасія',
                                                surname: 'Юрійчук',
                                                patronymic: 'Олександрівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Розробка UI/UX дизайну',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 60,
                                                name: '1 к. 27 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 3,
                                        startTime: '11:30',
                                        endTime: '12:50',
                                        class_name: '3',
                                    },
                                },
                            ],
                        },
                        {
                            day: 'WEDNESDAY',
                            classes: [
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 61,
                                                disable: false,
                                                name: 'Андрій',
                                                surname: 'Перцов',
                                                patronymic: 'Сергійович',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Платформи корпоративних інформ.систем',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 61,
                                                disable: false,
                                                name: 'Андрій',
                                                surname: 'Перцов',
                                                patronymic: 'Сергійович',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Платформи корпоративних інформ.систем',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 1,
                                        startTime: '08:20',
                                        endTime: '09:40',
                                        class_name: '1',
                                    },
                                },
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 65,
                                                disable: false,
                                                name: 'Ярослав',
                                                surname: 'Бігун',
                                                patronymic: 'Йосипович',
                                                position: 'професор',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Числові методи',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 65,
                                                disable: false,
                                                name: 'Ярослав',
                                                surname: 'Бігун',
                                                patronymic: 'Йосипович',
                                                position: 'професор',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Числові методи',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 2,
                                        startTime: '09:50',
                                        endTime: '11:10',
                                        class_name: '2',
                                    },
                                },
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 62,
                                                disable: false,
                                                name: 'Наталія',
                                                surname: 'Романенко',
                                                patronymic: 'Вікторівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Контроль якості та тестування програмного забезпечення',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 62,
                                                disable: false,
                                                name: 'Наталія',
                                                surname: 'Романенко',
                                                patronymic: 'Вікторівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Контроль якості та тестування програмного забезпечення',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 3,
                                        startTime: '11:30',
                                        endTime: '12:50',
                                        class_name: '3',
                                    },
                                },
                            ],
                        },
                        {
                            day: 'THURSDAY',
                            classes: [
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 62,
                                                disable: false,
                                                name: 'Наталія',
                                                surname: 'Романенко',
                                                patronymic: 'Вікторівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Контроль якості та тестування програмного забезпечення',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 55,
                                                name: '1 к. 19 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 62,
                                                disable: false,
                                                name: 'Наталія',
                                                surname: 'Романенко',
                                                patronymic: 'Вікторівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Контроль якості та тестування програмного забезпечення',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 55,
                                                name: '1 к. 19 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 1,
                                        startTime: '08:20',
                                        endTime: '09:40',
                                        class_name: '1',
                                    },
                                },
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 71,
                                                disable: false,
                                                name: 'Тетяна',
                                                surname: 'Сопронюк',
                                                patronymic: 'Миколаївна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Системне програмування',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 55,
                                                name: '1 к. 19 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 71,
                                                disable: false,
                                                name: 'Тетяна',
                                                surname: 'Сопронюк',
                                                patronymic: 'Миколаївна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Системне програмування',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 55,
                                                name: '1 к. 19 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 2,
                                        startTime: '09:50',
                                        endTime: '11:10',
                                        class_name: '2',
                                    },
                                },
                            ],
                        },
                        {
                            day: 'FRIDAY',
                            classes: [
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 61,
                                                disable: false,
                                                name: 'Андрій',
                                                surname: 'Перцов',
                                                patronymic: 'Сергійович',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Платформи корпоративних інформ.систем',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 61,
                                                disable: false,
                                                name: 'Андрій',
                                                surname: 'Перцов',
                                                patronymic: 'Сергійович',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Платформи корпоративних інформ.систем',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 1,
                                        startTime: '08:20',
                                        endTime: '09:40',
                                        class_name: '1',
                                    },
                                },
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 71,
                                                disable: false,
                                                name: 'Тетяна',
                                                surname: 'Сопронюк',
                                                patronymic: 'Миколаївна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Системне програмування',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 71,
                                                disable: false,
                                                name: 'Тетяна',
                                                surname: 'Сопронюк',
                                                patronymic: 'Миколаївна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Системне програмування',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                    class: {
                                        id: 2,
                                        startTime: '09:50',
                                        endTime: '11:10',
                                        class_name: '2',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        const result = {
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
            oddArray: [
                undefined,
                {
                    class: {
                        id: 1,
                        startTime: '08:20',
                        endTime: '09:40',
                        class_name: '1',
                    },
                    lessons: [
                        {
                            card: {
                                teacher: {
                                    id: 19,
                                    disable: false,
                                    name: 'Ігор',
                                    surname: 'Скутар',
                                    patronymic: 'Дмитрович',
                                    position: 'асистент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Серверна мова РНР',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 63,
                                    name: '1 к. 31 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'MONDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 75,
                                    disable: false,
                                    name: 'Анастасія',
                                    surname: 'Юрійчук',
                                    patronymic: 'Олександрівна',
                                    position: 'асистент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Розробка UI/UX дизайну',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 65,
                                    name: '1 к. 33 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'TUESDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 61,
                                    disable: false,
                                    name: 'Андрій',
                                    surname: 'Перцов',
                                    patronymic: 'Сергійович',
                                    position: 'доцент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Платформи корпоративних інформ.систем',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 52,
                                    name: '1 к. 15 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'WEDNESDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 62,
                                    disable: false,
                                    name: 'Наталія',
                                    surname: 'Романенко',
                                    patronymic: 'Вікторівна',
                                    position: 'асистент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite:
                                    'Контроль якості та тестування програмного забезпечення',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 55,
                                    name: '1 к. 19 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'THURSDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 61,
                                    disable: false,
                                    name: 'Андрій',
                                    surname: 'Перцов',
                                    patronymic: 'Сергійович',
                                    position: 'доцент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Платформи корпоративних інформ.систем',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 68,
                                    name: '1 к. 39 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'FRIDAY',
                        },
                        {
                            day: 'SATURDAY',
                        },
                        {
                            day: 'SUNDAY',
                        },
                    ],
                },
                {
                    class: {
                        id: 2,
                        startTime: '09:50',
                        endTime: '11:10',
                        class_name: '2',
                    },
                    lessons: [
                        {
                            card: {
                                teacher: {
                                    id: 19,
                                    disable: false,
                                    name: 'Ігор',
                                    surname: 'Скутар',
                                    patronymic: 'Дмитрович',
                                    position: 'асистент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Серверна мова РНР',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 53,
                                    name: '1 к. 18 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'MONDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 65,
                                    disable: false,
                                    name: 'Ярослав',
                                    surname: 'Бігун',
                                    patronymic: 'Йосипович',
                                    position: 'професор',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Числові методи',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 52,
                                    name: '1 к. 15 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'TUESDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 65,
                                    disable: false,
                                    name: 'Ярослав',
                                    surname: 'Бігун',
                                    patronymic: 'Йосипович',
                                    position: 'професор',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Числові методи',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 65,
                                    name: '1 к. 33 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'WEDNESDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 71,
                                    disable: false,
                                    name: 'Тетяна',
                                    surname: 'Сопронюк',
                                    patronymic: 'Миколаївна',
                                    position: 'доцент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Системне програмування',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 55,
                                    name: '1 к. 19 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'THURSDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 71,
                                    disable: false,
                                    name: 'Тетяна',
                                    surname: 'Сопронюк',
                                    patronymic: 'Миколаївна',
                                    position: 'доцент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Системне програмування',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 68,
                                    name: '1 к. 39 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'FRIDAY',
                        },
                        {
                            day: 'SATURDAY',
                        },
                        {
                            day: 'SUNDAY',
                        },
                    ],
                },
                {
                    class: {
                        id: 3,
                        startTime: '11:30',
                        endTime: '12:50',
                        class_name: '3',
                    },
                    lessons: [
                        {
                            card: {
                                teacher: {
                                    id: 52,
                                    disable: false,
                                    name: 'Микола',
                                    surname: 'Філіпчук',
                                    patronymic: 'Петрович',
                                    position: 'доцент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Web-дизайн',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 53,
                                    name: '1 к. 18 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'MONDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 75,
                                    disable: false,
                                    name: 'Анастасія',
                                    surname: 'Юрійчук',
                                    patronymic: 'Олександрівна',
                                    position: 'асистент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Розробка UI/UX дизайну',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 60,
                                    name: '1 к. 27 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'TUESDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 62,
                                    disable: false,
                                    name: 'Наталія',
                                    surname: 'Романенко',
                                    patronymic: 'Вікторівна',
                                    position: 'асистент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite:
                                    'Контроль якості та тестування програмного забезпечення',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 68,
                                    name: '1 к. 39 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'WEDNESDAY',
                        },
                        {
                            day: 'THURSDAY',
                        },
                        {
                            day: 'FRIDAY',
                        },
                        {
                            day: 'SATURDAY',
                        },
                        {
                            day: 'SUNDAY',
                        },
                    ],
                },
                {
                    class: {
                        id: 4,
                        startTime: '13:00',
                        endTime: '14:20',
                        class_name: '4',
                    },
                    lessons: [
                        {
                            card: {
                                teacher: {
                                    id: 52,
                                    disable: false,
                                    name: 'Микола',
                                    surname: 'Філіпчук',
                                    patronymic: 'Петрович',
                                    position: 'доцент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Web-дизайн',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 60,
                                    name: '1 к. 27 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'MONDAY',
                        },
                        {
                            day: 'TUESDAY',
                        },
                        {
                            day: 'WEDNESDAY',
                        },
                        {
                            day: 'THURSDAY',
                        },
                        {
                            day: 'FRIDAY',
                        },
                        {
                            day: 'SATURDAY',
                        },
                        {
                            day: 'SUNDAY',
                        },
                    ],
                },
            ],
            evenArray: [
                undefined,
                {
                    class: {
                        id: 1,
                        startTime: '08:20',
                        endTime: '09:40',
                        class_name: '1',
                    },
                    lessons: [
                        {
                            card: {
                                teacher: {
                                    id: 19,
                                    disable: false,
                                    name: 'Ігор',
                                    surname: 'Скутар',
                                    patronymic: 'Дмитрович',
                                    position: 'асистент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Серверна мова РНР',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 63,
                                    name: '1 к. 31 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'MONDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 75,
                                    disable: false,
                                    name: 'Анастасія',
                                    surname: 'Юрійчук',
                                    patronymic: 'Олександрівна',
                                    position: 'асистент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Розробка UI/UX дизайну',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 65,
                                    name: '1 к. 33 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'TUESDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 61,
                                    disable: false,
                                    name: 'Андрій',
                                    surname: 'Перцов',
                                    patronymic: 'Сергійович',
                                    position: 'доцент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Платформи корпоративних інформ.систем',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 52,
                                    name: '1 к. 15 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'WEDNESDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 62,
                                    disable: false,
                                    name: 'Наталія',
                                    surname: 'Романенко',
                                    patronymic: 'Вікторівна',
                                    position: 'асистент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite:
                                    'Контроль якості та тестування програмного забезпечення',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 55,
                                    name: '1 к. 19 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'THURSDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 61,
                                    disable: false,
                                    name: 'Андрій',
                                    surname: 'Перцов',
                                    patronymic: 'Сергійович',
                                    position: 'доцент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Платформи корпоративних інформ.систем',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 68,
                                    name: '1 к. 39 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'FRIDAY',
                        },
                        {
                            day: 'SATURDAY',
                        },
                        {
                            day: 'SUNDAY',
                        },
                    ],
                },
                {
                    class: {
                        id: 2,
                        startTime: '09:50',
                        endTime: '11:10',
                        class_name: '2',
                    },
                    lessons: [
                        {
                            card: {
                                teacher: {
                                    id: 19,
                                    disable: false,
                                    name: 'Ігор',
                                    surname: 'Скутар',
                                    patronymic: 'Дмитрович',
                                    position: 'асистент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Серверна мова РНР',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 53,
                                    name: '1 к. 18 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'MONDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 65,
                                    disable: false,
                                    name: 'Ярослав',
                                    surname: 'Бігун',
                                    patronymic: 'Йосипович',
                                    position: 'професор',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Числові методи',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 52,
                                    name: '1 к. 15 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'TUESDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 65,
                                    disable: false,
                                    name: 'Ярослав',
                                    surname: 'Бігун',
                                    patronymic: 'Йосипович',
                                    position: 'професор',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Числові методи',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 65,
                                    name: '1 к. 33 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'WEDNESDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 71,
                                    disable: false,
                                    name: 'Тетяна',
                                    surname: 'Сопронюк',
                                    patronymic: 'Миколаївна',
                                    position: 'доцент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Системне програмування',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 55,
                                    name: '1 к. 19 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'THURSDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 71,
                                    disable: false,
                                    name: 'Тетяна',
                                    surname: 'Сопронюк',
                                    patronymic: 'Миколаївна',
                                    position: 'доцент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Системне програмування',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 68,
                                    name: '1 к. 39 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'FRIDAY',
                        },
                        {
                            day: 'SATURDAY',
                        },
                        {
                            day: 'SUNDAY',
                        },
                    ],
                },
                {
                    class: {
                        id: 3,
                        startTime: '11:30',
                        endTime: '12:50',
                        class_name: '3',
                    },
                    lessons: [
                        {
                            card: {
                                teacher: {
                                    id: 52,
                                    disable: false,
                                    name: 'Микола',
                                    surname: 'Філіпчук',
                                    patronymic: 'Петрович',
                                    position: 'доцент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Web-дизайн',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 53,
                                    name: '1 к. 18 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'MONDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 75,
                                    disable: false,
                                    name: 'Анастасія',
                                    surname: 'Юрійчук',
                                    patronymic: 'Олександрівна',
                                    position: 'асистент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite: 'Розробка UI/UX дизайну',
                                lessonType: 'LABORATORY',
                                room: {
                                    id: 60,
                                    name: '1 к. 27 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'TUESDAY',
                        },
                        {
                            card: {
                                teacher: {
                                    id: 62,
                                    disable: false,
                                    name: 'Наталія',
                                    surname: 'Романенко',
                                    patronymic: 'Вікторівна',
                                    position: 'асистент',
                                    email: null,
                                    department: null,
                                },
                                linkToMeeting: 'https://zoom.us/',
                                subjectForSite:
                                    'Контроль якості та тестування програмного забезпечення',
                                lessonType: 'LECTURE',
                                room: {
                                    id: 68,
                                    name: '1 к. 39 ауд.',
                                },
                                temporary_schedule: null,
                            },
                            day: 'WEDNESDAY',
                        },
                        {
                            day: 'THURSDAY',
                        },
                        {
                            day: 'FRIDAY',
                        },
                        {
                            day: 'SATURDAY',
                        },
                        {
                            day: 'SUNDAY',
                        },
                    ],
                },
            ],
            group: {
                id: 41,
                disable: false,
                title: '33 (322)',
            },
        };
        expect(makeGroupSchedule(inputData)).toEqual(result);
    });
    it('returns empty evenArray and oddArray arrays and group object if schedule is empty', () => {
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
            schedule: [],
        };
        expect(makeGroupSchedule(inputData).evenArray.length).toEqual(0);
        expect(makeGroupSchedule(inputData).oddArray.length).toEqual(0);
        expect(makeGroupSchedule(inputData).group).toEqual({});
    });
    it('returns semester without changes', () => {
        const inputData = {
            schedule: [],
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
        };
        expect(makeGroupSchedule(inputData).semester).toEqual(inputData.semester);
    });
});
