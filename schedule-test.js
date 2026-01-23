// schedule-test.js
import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE_URL = 'http://fmi-schedule.chnu.edu.ua';

export const options = {
    stages: [
        { duration: '30s', target: 20 },  // warm-up: 0 → 20 users
        { duration: '1m', target: 50 },   // load: 50 users
        { duration: '30s', target: 100 }, // peak: 100 users
        { duration: '30s', target: 0 },   // ramp-down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
        http_req_failed: ['rate<0.01'],   // < 1% errors
    },
};

export default function () {

    group('1. Home page', () => {
        const res = http.get(`${BASE_URL}/`);
        check(res, { 'home: status 200': (r) => r.status === 200 });
        sleep(1);
    });

    group('2. Get default semester', () => {
        const res = http.get(`${BASE_URL}/semesters/default`);
        check(res, { 'semester: status 200': (r) => r.status === 200 });
        sleep(0.5);
    });

    group('3. Check publish status', () => {
        const res = http.get(`${BASE_URL}/schedules/public/status`);
        check(res, { 'status: status 200': (r) => r.status === 200 });
        sleep(0.5);
    });

    group('4. Full semester schedule', () => {
        const res = http.get(`${BASE_URL}/schedule?semester=57`);
        check(res, { 'full schedule: status 200': (r) => r.status === 200 });
        sleep(2);
    });

    group('5. Group schedule', () => {
        const res = http.get(`${BASE_URL}/schedule?semester=57&group=37`);
        check(res, { 'group schedule: status 200': (r) => r.status === 200 });
        sleep(2);
    });

    group('6. Teacher schedule', () => {
        const res = http.get(`${BASE_URL}/schedule?semester=57&teacher=34`);
        check(res, { 'teacher schedule: status 200': (r) => r.status === 200 });
        sleep(2);
    });

    sleep(1);
}