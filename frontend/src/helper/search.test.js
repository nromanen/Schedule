import { search } from './search';

const items = [
    {
        id: 55,
        name: '1 к. 19 аудиторія',
        disable: false,
        type: {
            id: 26,
            description: 'Практична',
        },
    },
    {
        id: 56,
        name: '1 к. 21 ауд.',
        disable: false,
        type: {
            id: 25,
            description: 'Лекційна',
        },
    },
];
const term = 'аудиторія';
const deepTerm = 'Лекційна';
const arr = ['name', 'type.description'];

describe('behavior of search function', () => {
    test('it shows all items if search term length === 0', () => {
        expect(search(items, '', arr).length).toBe(items.length);
    });

    test('it shows items which include search term', () => {
        expect(search(items, term, arr)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: expect.stringContaining(term) }),
            ]),
        );
    });

    test('it shows items which include search term in deep object', () => {
        expect(search(items, deepTerm, arr)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    type: expect.objectContaining({
                        description: expect.stringContaining(deepTerm),
                    }),
                }),
            ]),
        );
    });

    test('it does not show items which exclude search term', () => {
        expect(search(items, '1909', arr)).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({ name: expect.stringContaining('1909') }),
            ]),
        );
    });
});
