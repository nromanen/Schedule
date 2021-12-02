import { makeFullSchedule } from './fullScheduleMapper';

describe('Full schedule mapper', () => {
    it('mapper result should match for the given output', () => {
        const inputData = {
            schedule: [
                {
                    group: {
                        id: 5,
                        disable: false,
                        title: '13 (111-А)',
                    },
                    days: [
                        {
                            day: 'MONDAY',
                            classes: [
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
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
                                                id: 21,
                                                disable: false,
                                                name: 'Володимир',
                                                surname: 'Михайлюк',
                                                patronymic: 'Васильович',
                                                position: 'професор',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 21,
                                                disable: false,
                                                name: 'Володимир',
                                                surname: 'Михайлюк',
                                                patronymic: 'Васильович',
                                                position: 'професор',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
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
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 41,
                                                disable: false,
                                                name: 'Тетяна',
                                                surname: 'Караванова',
                                                patronymic: 'Петрівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 41,
                                                disable: false,
                                                name: 'Тетяна',
                                                surname: 'Караванова',
                                                patronymic: 'Петрівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
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
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 88,
                                                disable: false,
                                                name: 'Марія',
                                                surname: 'Шенько',
                                                patronymic: 'Миколаївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Німецька мова',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 51,
                                                name: '1 к.  11 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 88,
                                                disable: false,
                                                name: 'Марія',
                                                surname: 'Шенько',
                                                patronymic: 'Миколаївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Німецька мова',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 51,
                                                name: '1 к.  11 ауд.',
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
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 7,
                                        startTime: '14:40',
                                        endTime: '16:00',
                                        class_name: '5',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 8,
                                        startTime: '16:10',
                                        endTime: '17:30',
                                        class_name: '6',
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
                                                id: 53,
                                                disable: false,
                                                name: 'Олександра',
                                                surname: 'Мудра',
                                                patronymic: 'Володимирівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Іноземна мова (за професійним спрямуванням)',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 61,
                                                name: '1 к. 28 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 53,
                                                disable: false,
                                                name: 'Олександра',
                                                surname: 'Мудра',
                                                patronymic: 'Володимирівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Іноземна мова (за професійним спрямуванням)',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 61,
                                                name: '1 к. 28 ауд.',
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
                                                id: 43,
                                                disable: false,
                                                name: 'Руслана',
                                                surname: 'Колісник',
                                                patronymic: 'Степанівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Алгебра і геометрія',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 43,
                                                disable: false,
                                                name: 'Руслана',
                                                surname: 'Колісник',
                                                patronymic: 'Степанівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Алгебра і геометрія',
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
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 60,
                                                disable: false,
                                                name: 'Іван',
                                                surname: 'Данилюк',
                                                patronymic: 'Михайлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Архітектура обчислювальних систем',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 60,
                                                disable: false,
                                                name: 'Іван',
                                                surname: 'Данилюк',
                                                patronymic: 'Михайлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Архітектура обчислювальних систем',
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
                                {
                                    weeks: {
                                        even: null,
                                        odd: {
                                            teacher: {
                                                id: 63,
                                                disable: false,
                                                name: 'Світлана',
                                                surname: 'Іліка',
                                                patronymic: 'Анатоліївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Пакети прикладних програм',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
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
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 7,
                                        startTime: '14:40',
                                        endTime: '16:00',
                                        class_name: '5',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 8,
                                        startTime: '16:10',
                                        endTime: '17:30',
                                        class_name: '6',
                                    },
                                },
                            ],
                        },
                        {
                            day: 'WEDNESDAY',
                            classes: [
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
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
                                                id: 63,
                                                disable: false,
                                                name: 'Світлана',
                                                surname: 'Іліка',
                                                patronymic: 'Анатоліївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Пакети прикладних програм',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 63,
                                                disable: false,
                                                name: 'Світлана',
                                                surname: 'Іліка',
                                                patronymic: 'Анатоліївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Пакети прикладних програм',
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
                                                id: 102,
                                                disable: false,
                                                name: 'Наталія',
                                                surname: 'Попович',
                                                patronymic: 'Михайлівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Українська  мова (за професійним спрямуванням)',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 102,
                                                disable: false,
                                                name: 'Наталія',
                                                surname: 'Попович',
                                                patronymic: 'Михайлівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Українська  мова (за професійним спрямуванням)',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
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
                                        even: {
                                            teacher: {
                                                id: 60,
                                                disable: false,
                                                name: 'Іван',
                                                surname: 'Данилюк',
                                                patronymic: 'Михайлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Архітектура обчислювальних систем',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 56,
                                                name: '1 к. 21 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 60,
                                                disable: false,
                                                name: 'Іван',
                                                surname: 'Данилюк',
                                                patronymic: 'Михайлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Архітектура обчислювальних систем',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 56,
                                                name: '1 к. 21 ауд.',
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
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 7,
                                        startTime: '14:40',
                                        endTime: '16:00',
                                        class_name: '5',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 8,
                                        startTime: '16:10',
                                        endTime: '17:30',
                                        class_name: '6',
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
                                                id: 32,
                                                disable: false,
                                                name: 'Тоня',
                                                surname: 'Фратавчан',
                                                patronymic: 'Михайлівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Олімпіадні задачі з інформаційних технологій',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 32,
                                                disable: false,
                                                name: 'Тоня',
                                                surname: 'Фратавчан',
                                                patronymic: 'Михайлівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Олімпіадні задачі з інформаційних технологій',
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
                                                id: 42,
                                                disable: false,
                                                name: 'Андрій',
                                                surname: 'Дорош',
                                                patronymic: 'Богданович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 42,
                                                disable: false,
                                                name: 'Андрій',
                                                surname: 'Дорош',
                                                patronymic: 'Богданович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
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
                                                id: 105,
                                                disable: false,
                                                name: 'Денис',
                                                surname: 'Онипа',
                                                patronymic: 'Павлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: null,
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
                                        odd: null,
                                    },
                                    class: {
                                        id: 4,
                                        startTime: '13:00',
                                        endTime: '14:20',
                                        class_name: '4',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 7,
                                        startTime: '14:40',
                                        endTime: '16:00',
                                        class_name: '5',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 8,
                                        startTime: '16:10',
                                        endTime: '17:30',
                                        class_name: '6',
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
                                                id: 50,
                                                disable: false,
                                                name: 'Жана',
                                                surname: 'Довгей',
                                                patronymic: 'Ілінічна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Алгебра і геометрія',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 50,
                                                disable: false,
                                                name: 'Жана',
                                                surname: 'Довгей',
                                                patronymic: 'Ілінічна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Алгебра і геометрія',
                                            lessonType: 'PRACTICAL',
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
                                                id: 105,
                                                disable: false,
                                                name: 'Денис',
                                                surname: 'Онипа',
                                                patronymic: 'Павлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 105,
                                                disable: false,
                                                name: 'Денис',
                                                surname: 'Онипа',
                                                patronymic: 'Павлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'PRACTICAL',
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
                                                id: 33,
                                                disable: false,
                                                name: 'Галина',
                                                surname: 'Івасюк',
                                                patronymic: 'Петрівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 33,
                                                disable: false,
                                                name: 'Галина',
                                                surname: 'Івасюк',
                                                patronymic: 'Петрівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
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
                                        odd: null,
                                    },
                                    class: {
                                        id: 4,
                                        startTime: '13:00',
                                        endTime: '14:20',
                                        class_name: '4',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 7,
                                        startTime: '14:40',
                                        endTime: '16:00',
                                        class_name: '5',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 8,
                                        startTime: '16:10',
                                        endTime: '17:30',
                                        class_name: '6',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
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
            schedule: [
                {
                    group: {
                        id: 5,
                        disable: false,
                        title: '13 (111-А)',
                    },
                    days: [
                        {
                            day: 'MONDAY',
                            classes: [
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
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
                                                id: 21,
                                                disable: false,
                                                name: 'Володимир',
                                                surname: 'Михайлюк',
                                                patronymic: 'Васильович',
                                                position: 'професор',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 21,
                                                disable: false,
                                                name: 'Володимир',
                                                surname: 'Михайлюк',
                                                patronymic: 'Васильович',
                                                position: 'професор',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
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
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 41,
                                                disable: false,
                                                name: 'Тетяна',
                                                surname: 'Караванова',
                                                patronymic: 'Петрівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 41,
                                                disable: false,
                                                name: 'Тетяна',
                                                surname: 'Караванова',
                                                patronymic: 'Петрівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
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
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 88,
                                                disable: false,
                                                name: 'Марія',
                                                surname: 'Шенько',
                                                patronymic: 'Миколаївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Німецька мова',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 51,
                                                name: '1 к.  11 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 88,
                                                disable: false,
                                                name: 'Марія',
                                                surname: 'Шенько',
                                                patronymic: 'Миколаївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Німецька мова',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 51,
                                                name: '1 к.  11 ауд.',
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
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 7,
                                        startTime: '14:40',
                                        endTime: '16:00',
                                        class_name: '5',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 8,
                                        startTime: '16:10',
                                        endTime: '17:30',
                                        class_name: '6',
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
                                                id: 53,
                                                disable: false,
                                                name: 'Олександра',
                                                surname: 'Мудра',
                                                patronymic: 'Володимирівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Іноземна мова (за професійним спрямуванням)',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 61,
                                                name: '1 к. 28 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 53,
                                                disable: false,
                                                name: 'Олександра',
                                                surname: 'Мудра',
                                                patronymic: 'Володимирівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Іноземна мова (за професійним спрямуванням)',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 61,
                                                name: '1 к. 28 ауд.',
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
                                                id: 43,
                                                disable: false,
                                                name: 'Руслана',
                                                surname: 'Колісник',
                                                patronymic: 'Степанівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Алгебра і геометрія',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 43,
                                                disable: false,
                                                name: 'Руслана',
                                                surname: 'Колісник',
                                                patronymic: 'Степанівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Алгебра і геометрія',
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
                                {
                                    weeks: {
                                        even: {
                                            teacher: {
                                                id: 60,
                                                disable: false,
                                                name: 'Іван',
                                                surname: 'Данилюк',
                                                patronymic: 'Михайлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Архітектура обчислювальних систем',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 60,
                                                disable: false,
                                                name: 'Іван',
                                                surname: 'Данилюк',
                                                patronymic: 'Михайлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Архітектура обчислювальних систем',
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
                                {
                                    weeks: {
                                        even: null,
                                        odd: {
                                            teacher: {
                                                id: 63,
                                                disable: false,
                                                name: 'Світлана',
                                                surname: 'Іліка',
                                                patronymic: 'Анатоліївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Пакети прикладних програм',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
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
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 7,
                                        startTime: '14:40',
                                        endTime: '16:00',
                                        class_name: '5',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 8,
                                        startTime: '16:10',
                                        endTime: '17:30',
                                        class_name: '6',
                                    },
                                },
                            ],
                        },
                        {
                            day: 'WEDNESDAY',
                            classes: [
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
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
                                                id: 63,
                                                disable: false,
                                                name: 'Світлана',
                                                surname: 'Іліка',
                                                patronymic: 'Анатоліївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Пакети прикладних програм',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 63,
                                                disable: false,
                                                name: 'Світлана',
                                                surname: 'Іліка',
                                                patronymic: 'Анатоліївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Пакети прикладних програм',
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
                                                id: 102,
                                                disable: false,
                                                name: 'Наталія',
                                                surname: 'Попович',
                                                patronymic: 'Михайлівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Українська  мова (за професійним спрямуванням)',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 102,
                                                disable: false,
                                                name: 'Наталія',
                                                surname: 'Попович',
                                                patronymic: 'Михайлівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Українська  мова (за професійним спрямуванням)',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
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
                                        even: {
                                            teacher: {
                                                id: 60,
                                                disable: false,
                                                name: 'Іван',
                                                surname: 'Данилюк',
                                                patronymic: 'Михайлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Архітектура обчислювальних систем',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 56,
                                                name: '1 к. 21 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 60,
                                                disable: false,
                                                name: 'Іван',
                                                surname: 'Данилюк',
                                                patronymic: 'Михайлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Архітектура обчислювальних систем',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 56,
                                                name: '1 к. 21 ауд.',
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
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 7,
                                        startTime: '14:40',
                                        endTime: '16:00',
                                        class_name: '5',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 8,
                                        startTime: '16:10',
                                        endTime: '17:30',
                                        class_name: '6',
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
                                                id: 32,
                                                disable: false,
                                                name: 'Тоня',
                                                surname: 'Фратавчан',
                                                patronymic: 'Михайлівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Олімпіадні задачі з інформаційних технологій',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 32,
                                                disable: false,
                                                name: 'Тоня',
                                                surname: 'Фратавчан',
                                                patronymic: 'Михайлівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Олімпіадні задачі з інформаційних технологій',
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
                                                id: 42,
                                                disable: false,
                                                name: 'Андрій',
                                                surname: 'Дорош',
                                                patronymic: 'Богданович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 42,
                                                disable: false,
                                                name: 'Андрій',
                                                surname: 'Дорош',
                                                patronymic: 'Богданович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
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
                                                id: 105,
                                                disable: false,
                                                name: 'Денис',
                                                surname: 'Онипа',
                                                patronymic: 'Павлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: null,
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
                                        odd: null,
                                    },
                                    class: {
                                        id: 4,
                                        startTime: '13:00',
                                        endTime: '14:20',
                                        class_name: '4',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 7,
                                        startTime: '14:40',
                                        endTime: '16:00',
                                        class_name: '5',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 8,
                                        startTime: '16:10',
                                        endTime: '17:30',
                                        class_name: '6',
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
                                                id: 50,
                                                disable: false,
                                                name: 'Жана',
                                                surname: 'Довгей',
                                                patronymic: 'Ілінічна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Алгебра і геометрія',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 50,
                                                disable: false,
                                                name: 'Жана',
                                                surname: 'Довгей',
                                                patronymic: 'Ілінічна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Алгебра і геометрія',
                                            lessonType: 'PRACTICAL',
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
                                                id: 105,
                                                disable: false,
                                                name: 'Денис',
                                                surname: 'Онипа',
                                                patronymic: 'Павлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 105,
                                                disable: false,
                                                name: 'Денис',
                                                surname: 'Онипа',
                                                patronymic: 'Павлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'PRACTICAL',
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
                                                id: 33,
                                                disable: false,
                                                name: 'Галина',
                                                surname: 'Івасюк',
                                                patronymic: 'Петрівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                        odd: {
                                            teacher: {
                                                id: 33,
                                                disable: false,
                                                name: 'Галина',
                                                surname: 'Івасюк',
                                                patronymic: 'Петрівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
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
                                        odd: null,
                                    },
                                    class: {
                                        id: 4,
                                        startTime: '13:00',
                                        endTime: '14:20',
                                        class_name: '4',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 7,
                                        startTime: '14:40',
                                        endTime: '16:00',
                                        class_name: '5',
                                    },
                                },
                                {
                                    weeks: {
                                        even: null,
                                        odd: null,
                                    },
                                    class: {
                                        id: 8,
                                        startTime: '16:10',
                                        endTime: '17:30',
                                        class_name: '6',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
            semesterClasses: [
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
            semesterDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            groupsCount: 1,
            groupList: [
                {
                    id: 5,
                    disable: false,
                    title: '13 (111-А)',
                },
            ],
            resultArray: [
                {
                    day: 'MONDAY',
                    classes: [
                        {
                            class: {
                                id: 1,
                                startTime: '08:20',
                                endTime: '09:40',
                                class_name: '1',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 2,
                                startTime: '09:50',
                                endTime: '11:10',
                                class_name: '2',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 21,
                                                disable: false,
                                                name: 'Володимир',
                                                surname: 'Михайлюк',
                                                patronymic: 'Васильович',
                                                position: 'професор',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 21,
                                                disable: false,
                                                name: 'Володимир',
                                                surname: 'Михайлюк',
                                                patronymic: 'Васильович',
                                                position: 'професор',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 3,
                                startTime: '11:30',
                                endTime: '12:50',
                                class_name: '3',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 41,
                                                disable: false,
                                                name: 'Тетяна',
                                                surname: 'Караванова',
                                                patronymic: 'Петрівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 41,
                                                disable: false,
                                                name: 'Тетяна',
                                                surname: 'Караванова',
                                                patronymic: 'Петрівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 4,
                                startTime: '13:00',
                                endTime: '14:20',
                                class_name: '4',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 88,
                                                disable: false,
                                                name: 'Марія',
                                                surname: 'Шенько',
                                                patronymic: 'Миколаївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Німецька мова',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 51,
                                                name: '1 к.  11 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 88,
                                                disable: false,
                                                name: 'Марія',
                                                surname: 'Шенько',
                                                patronymic: 'Миколаївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Німецька мова',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 51,
                                                name: '1 к.  11 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 7,
                                startTime: '14:40',
                                endTime: '16:00',
                                class_name: '5',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 8,
                                startTime: '16:10',
                                endTime: '17:30',
                                class_name: '6',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    day: 'TUESDAY',
                    classes: [
                        {
                            class: {
                                id: 1,
                                startTime: '08:20',
                                endTime: '09:40',
                                class_name: '1',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 53,
                                                disable: false,
                                                name: 'Олександра',
                                                surname: 'Мудра',
                                                patronymic: 'Володимирівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Іноземна мова (за професійним спрямуванням)',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 61,
                                                name: '1 к. 28 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 53,
                                                disable: false,
                                                name: 'Олександра',
                                                surname: 'Мудра',
                                                patronymic: 'Володимирівна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Іноземна мова (за професійним спрямуванням)',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 61,
                                                name: '1 к. 28 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 2,
                                startTime: '09:50',
                                endTime: '11:10',
                                class_name: '2',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 43,
                                                disable: false,
                                                name: 'Руслана',
                                                surname: 'Колісник',
                                                patronymic: 'Степанівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Алгебра і геометрія',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 43,
                                                disable: false,
                                                name: 'Руслана',
                                                surname: 'Колісник',
                                                patronymic: 'Степанівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Алгебра і геометрія',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 3,
                                startTime: '11:30',
                                endTime: '12:50',
                                class_name: '3',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 60,
                                                disable: false,
                                                name: 'Іван',
                                                surname: 'Данилюк',
                                                patronymic: 'Михайлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Архітектура обчислювальних систем',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 60,
                                                disable: false,
                                                name: 'Іван',
                                                surname: 'Данилюк',
                                                patronymic: 'Михайлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Архітектура обчислювальних систем',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 4,
                                startTime: '13:00',
                                endTime: '14:20',
                                class_name: '4',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 63,
                                                disable: false,
                                                name: 'Світлана',
                                                surname: 'Іліка',
                                                patronymic: 'Анатоліївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Пакети прикладних програм',
                                            lessonType: 'LECTURE',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 7,
                                startTime: '14:40',
                                endTime: '16:00',
                                class_name: '5',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 8,
                                startTime: '16:10',
                                endTime: '17:30',
                                class_name: '6',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    day: 'WEDNESDAY',
                    classes: [
                        {
                            class: {
                                id: 1,
                                startTime: '08:20',
                                endTime: '09:40',
                                class_name: '1',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 2,
                                startTime: '09:50',
                                endTime: '11:10',
                                class_name: '2',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 63,
                                                disable: false,
                                                name: 'Світлана',
                                                surname: 'Іліка',
                                                patronymic: 'Анатоліївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Пакети прикладних програм',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 63,
                                                disable: false,
                                                name: 'Світлана',
                                                surname: 'Іліка',
                                                patronymic: 'Анатоліївна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Пакети прикладних програм',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 3,
                                startTime: '11:30',
                                endTime: '12:50',
                                class_name: '3',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 102,
                                                disable: false,
                                                name: 'Наталія',
                                                surname: 'Попович',
                                                patronymic: 'Михайлівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Українська  мова (за професійним спрямуванням)',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 102,
                                                disable: false,
                                                name: 'Наталія',
                                                surname: 'Попович',
                                                patronymic: 'Михайлівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Українська  мова (за професійним спрямуванням)',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 4,
                                startTime: '13:00',
                                endTime: '14:20',
                                class_name: '4',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 60,
                                                disable: false,
                                                name: 'Іван',
                                                surname: 'Данилюк',
                                                patronymic: 'Михайлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Архітектура обчислювальних систем',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 56,
                                                name: '1 к. 21 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 60,
                                                disable: false,
                                                name: 'Іван',
                                                surname: 'Данилюк',
                                                patronymic: 'Михайлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Архітектура обчислювальних систем',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 56,
                                                name: '1 к. 21 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 7,
                                startTime: '14:40',
                                endTime: '16:00',
                                class_name: '5',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 8,
                                startTime: '16:10',
                                endTime: '17:30',
                                class_name: '6',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    day: 'THURSDAY',
                    classes: [
                        {
                            class: {
                                id: 1,
                                startTime: '08:20',
                                endTime: '09:40',
                                class_name: '1',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 32,
                                                disable: false,
                                                name: 'Тоня',
                                                surname: 'Фратавчан',
                                                patronymic: 'Михайлівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Олімпіадні задачі з інформаційних технологій',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 32,
                                                disable: false,
                                                name: 'Тоня',
                                                surname: 'Фратавчан',
                                                patronymic: 'Михайлівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite:
                                                'Олімпіадні задачі з інформаційних технологій',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 2,
                                startTime: '09:50',
                                endTime: '11:10',
                                class_name: '2',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 42,
                                                disable: false,
                                                name: 'Андрій',
                                                surname: 'Дорош',
                                                patronymic: 'Богданович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 42,
                                                disable: false,
                                                name: 'Андрій',
                                                surname: 'Дорош',
                                                patronymic: 'Богданович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'LABORATORY',
                                            room: {
                                                id: 52,
                                                name: '1 к. 15 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 3,
                                startTime: '11:30',
                                endTime: '12:50',
                                class_name: '3',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 105,
                                                disable: false,
                                                name: 'Денис',
                                                surname: 'Онипа',
                                                patronymic: 'Павлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 68,
                                                name: '1 к. 39 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 4,
                                startTime: '13:00',
                                endTime: '14:20',
                                class_name: '4',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 7,
                                startTime: '14:40',
                                endTime: '16:00',
                                class_name: '5',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 8,
                                startTime: '16:10',
                                endTime: '17:30',
                                class_name: '6',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    day: 'FRIDAY',
                    classes: [
                        {
                            class: {
                                id: 1,
                                startTime: '08:20',
                                endTime: '09:40',
                                class_name: '1',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 50,
                                                disable: false,
                                                name: 'Жана',
                                                surname: 'Довгей',
                                                patronymic: 'Ілінічна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Алгебра і геометрія',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 50,
                                                disable: false,
                                                name: 'Жана',
                                                surname: 'Довгей',
                                                patronymic: 'Ілінічна',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Алгебра і геометрія',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 2,
                                startTime: '09:50',
                                endTime: '11:10',
                                class_name: '2',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 105,
                                                disable: false,
                                                name: 'Денис',
                                                surname: 'Онипа',
                                                patronymic: 'Павлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 105,
                                                disable: false,
                                                name: 'Денис',
                                                surname: 'Онипа',
                                                patronymic: 'Павлович',
                                                position: 'асистент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Математичний аналіз',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 3,
                                startTime: '11:30',
                                endTime: '12:50',
                                class_name: '3',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 33,
                                                disable: false,
                                                name: 'Галина',
                                                surname: 'Івасюк',
                                                patronymic: 'Петрівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: {
                                            teacher: {
                                                id: 33,
                                                disable: false,
                                                name: 'Галина',
                                                surname: 'Івасюк',
                                                patronymic: 'Петрівна',
                                                position: 'доцент',
                                                email: null,
                                                department: null,
                                            },
                                            linkToMeeting: 'https://zoom.us/',
                                            subjectForSite: 'Програмування',
                                            lessonType: 'PRACTICAL',
                                            room: {
                                                id: 65,
                                                name: '1 к. 33 ауд.',
                                            },
                                            temporary_schedule: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 4,
                                startTime: '13:00',
                                endTime: '14:20',
                                class_name: '4',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 7,
                                startTime: '14:40',
                                endTime: '16:00',
                                class_name: '5',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                        {
                            class: {
                                id: 8,
                                startTime: '16:10',
                                endTime: '17:30',
                                class_name: '6',
                            },
                            cards: {
                                odd: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                                even: [
                                    {
                                        group: {
                                            id: 5,
                                            disable: false,
                                            title: '13 (111-А)',
                                        },
                                        card: null,
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        };
        expect(makeFullSchedule(inputData)).toEqual(result);
    });
    it('returns empty groupList and resultArray arrays, groupCount = 0 if schedule is empty', () => {
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
        expect(makeFullSchedule(inputData).resultArray.length).toEqual(0);
        expect(makeFullSchedule(inputData).groupList.length).toEqual(0);
        expect(makeFullSchedule(inputData).groupsCount).toEqual(0);
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
        expect(makeFullSchedule(inputData).semester).toEqual(inputData.semester);
    });
});
