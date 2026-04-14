import { getSemesterTitle} from './titlesUtil';

const semester = {
    id: 1,
    description: '1 2020- 2021',
    endDay: '31/12/2020',
    startDay: '31/08/2020',
};

const semesterTitle = '1 2020- 2021 (31/08/2020-31/12/2020) : ';

describe('getSemesterTitle function', () => {
    it('should return semester title', () => {
        expect(getSemesterTitle(semester)).toBe(semesterTitle);
    });

    it('should return empty string if no semester', () => {
        expect(getSemesterTitle(!semester)).toBe('');
    });
});

