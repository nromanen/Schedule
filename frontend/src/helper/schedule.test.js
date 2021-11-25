import { getColorByFullness } from './schedule';

const array = [
    {
        groups: [
            {
                group_id: 29,
                group_name: '12 (101-Б)',
            },
        ],
        subject_for_site: 'Web-дизайн',
        lesson_type: 'LECTURE',
        teacher_for_site: "Куб'як",
    },
];

describe('behavior of getColorByFullness function', () => {
    test('it add all items if search term length === 0', () => {
        expect(getColorByFullness([])).toBe('available');
    });
});
