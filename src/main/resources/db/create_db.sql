
CREATE TABLE "semester" (
  "id" serial PRIMARY KEY,
  "year" int NOT NULL,
  "number" int NOT NULL
);

CREATE TABLE "lesson" (
  "id" serial PRIMARY KEY,
  "teacher_id" bigint NOT NULL,
  "subject_id" bigint NOT NULL,
  "group_id" bigint NOT NULL,
  "hours" int NOT NULL,
  "teacher_for_site" varchar,
  "subject_for_site" varchar,
  "type" varchar
);

CREATE TABLE "schedule" (
  "id" serial PRIMARY KEY,
  "semestr_id" bigint NOT NULL,
  "room_id" bigint NOT NULL,
  "class_id" bigint,
  "day_of_the_week" varchar NOT NULL,
  "even_odd" varchar NOT NULL,
  "lesson_id" bigint NOT NULL
);

CREATE TABLE "class" (
  "id" serial PRIMARY KEY,
  "start_time" timestamp NOT NULL,
  "end_time" timestamp NOT NULL,
  "number" int NOT NULL
);

CREATE TABLE "user" (
  "id" serial PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "role" varchar
);

CREATE TABLE "teacher" (
  "id" serial PRIMARY KEY,
  "user_id" bigint UNIQUE,
  "name" varchar NOT NULL,
  "position" varchar NOT NULL
);

CREATE TABLE "teacher_wishes" (
  "id" serial PRIMARY KEY,
  "teacher_id" bigint NOT NULL,
  "semestr_id" bigint NOT NULL,
  "wishlist" json
);

CREATE TABLE "subject" (
  "id" serial PRIMARY KEY,
  "name" varchar NOT NULL,
  "type" varchar NOT NULL
);

CREATE TABLE "group" (
  "id" serial PRIMARY KEY,
  "title" varchar NOT NULL
);

CREATE TABLE "room" (
  "id" serial PRIMARY KEY,
  "size" varchar NOT NULL,
  "name" varchar NOT NULL
);


ALTER TABLE "user" ADD FOREIGN KEY ("id") REFERENCES "teacher" ("user_id");

ALTER TABLE "schedule" ADD FOREIGN KEY ("semestr_id") REFERENCES "semester" ("id");

ALTER TABLE "schedule" ADD FOREIGN KEY ("room_id") REFERENCES "room" ("id");

ALTER TABLE "schedule" ADD FOREIGN KEY ("class_id") REFERENCES "class" ("id");

ALTER TABLE "schedule" ADD FOREIGN KEY ("lesson_id") REFERENCES "lesson" ("id");

ALTER TABLE "lesson" ADD FOREIGN KEY ("teacher_id") REFERENCES "teacher" ("id");

ALTER TABLE "lesson" ADD FOREIGN KEY ("group_id") REFERENCES "group" ("id");

ALTER TABLE "lesson" ADD FOREIGN KEY ("subject_id") REFERENCES "subject" ("id");

ALTER TABLE "teacher_wishes" ADD FOREIGN KEY ("semestr_id") REFERENCES "semester" ("id");

ALTER TABLE "teacher_wishes" ADD FOREIGN KEY ("teacher_id") REFERENCES "teacher" ("id");
