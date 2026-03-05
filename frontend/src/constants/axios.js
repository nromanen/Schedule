// Auth
export const LOGIN_URL = 'auth/sign-in';
export const GOOGLE_LOGIN_URL = 'auth/google';
export const LOGOUT_URL = 'auth/sign-out';
export const REGISTRATION_URL = 'auth/sign-up';
export const RESET_PASSWORD_URL = 'auth/reset-password';
export const ACTIVATE_ACCOUNT_URL = 'auth/activation-account';

// Users
export const USERS_URL = 'users/with-role-user';
export const USER_PROFILE = 'users/profile';
export const UPDATE_USER_PROFILE = 'users/change-profile';

// Teachers
export const TEACHER_URL = 'teachers';
export const DISABLED_TEACHERS_URL = 'teachers/disabled';
export const TEACHERS_WITH_EMAIL_URL = 'teachers/with-email';
export const TEACHER_SCHEDULE_URL = 'schedules/full/teachers?semesterId=';
export const TEACHER_TEMPORARY_SCHEDULE = 'schedules/full/teachers/date-range';
export const FOR_TEACHER_SCHEDULE_URL = 'schedules/teacher';
export const LESSON_BY_TEACHER_URL = '/lessons/teacher';
export const MY_LESSONS_URL = 'lessons/teacher/my-lessons';

// Groups
export const GROUP_URL = 'groups';
export const GROUPS_URL = 'groups';
export const GROUPS_AFTER_URL = '/groups/after';
export const DISABLED_GROUPS_URL = 'groups/disabled';
export const GROUPS_FOR_CURRENT_SCHEDULE = '/semesters/current/groups';

// Students
export const STUDENT_URL = 'students';
export const MOVE_STUDENTS_URL = 'students/move-to-group';
export const STUDENTS_TO_GROUP_FILE = 'students/import?groupId=';
export const WITH_STUDENTS = '/with-students';

// Rooms
export const ROOM_URL = 'rooms';
export const ROOM_AFTER_URL = 'rooms/after';
export const ROOM_ORDERED_URL = 'rooms/ordered';
export const ROOM_TYPES_URL = 'room-types';
export const FREE_ROOMS_URL = 'rooms/free';
export const DISABLED_ROOMS_URL = 'rooms/disabled';
export const ROOMS_AVAILABILITY = 'rooms/available';
export const BUSY_ROOMS = 'schedules/full/rooms';

// Lessons
export const LESSON_URL = 'lessons';
export const LESSON_TYPES_URL = 'lessons/types';
export const COPY_LESSON_URL = '/lessons/copy-lesson-for-groups';
export const LESSONS_FROM_SEMESTER_COPY_URL = '/lessons/copy-lessons';

// Subjects
export const SUBJECT_URL = 'subjects';
export const DISABLED_SUBJECTS_URL = 'subjects/disabled';

// Semesters
export const SEMESTERS_URL = 'semesters';
export const CURRENT_SEMESTER_URL = 'semesters/current';
export const DEFAULT_SEMESTER_URL = 'semesters/default';
export const DISABLED_SEMESTERS_URL = 'semesters/disabled';
export const ARCHIVE_SEMESTER = '/archive';
export const ARCHIVED_SEMESTERS_URL = '/archive/all-semesters';

// Schedules
export const SCHEDULE_ITEMS_URL = 'schedules';
export const SCHEDULE_SEMESTER_ITEMS_URL = 'schedules/semester';
export const SCHEDULE_CHECK_AVAILABILITY_URL = 'schedules/data-before';
export const FULL_SCHEDULE_URL = 'schedules/full/semester?semesterId=';
export const GROUP_SCHEDULE_URL = 'schedules/full/groups?semesterId=';
export const SEMESTER_COPY_URL = '/schedules/copy-schedule';
export const CLEAR_SCHEDULE_URL = '/schedules/delete-schedules';
export const SCHEDULE_ITEM_ROOM_CHANGE = '/schedules/by-room';
export const EXPORT_SCHEDULE_XLSX_URL = 'schedules/export/xlsx?semesterId=';

// Classes
export const CLASS_URL = 'classes';

// Departments
export const DEPARTMENT_URL = 'departments';

// Public
export const PUBLIC_CLASSES_URL = 'public/classes';
export const PUBLIC_TEACHER_URL = 'public/teachers';
export const PUBLIC_SEMESTERS_URL = 'public/semesters';

// Downloads & Email
export const SEND_PDF_TO_EMAIL = 'send-pdf-to-email';
export const PUBLIC_DOWNLOAD_GROUP_SCHEDULE_URL = 'download/schedule-for-group-in-pdf';
export const PUBLIC_DOWNLOAD_TEACHER_SCHEDULE_URL = 'download/schedule-for-teacher-in-pdf';

// Temporary Schedules
export const TEMPORARY_SCHEDULE_URL = 'temporary-schedules';
export const TEMPORARY_SCHEDULE_RANGE_URL = 'temporary-schedules/add-range';