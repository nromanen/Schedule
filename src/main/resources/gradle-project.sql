CREATE TABLE "employee" (
  "id" serial PRIMARY KEY,
  "name" varchar,
  "position" varchar
);

CREATE TABLE "car" (
  "id" serial PRIMARY KEY,
  "name" varchar,
  "owner_id" bigint
);

ALTER TABLE "car" ADD FOREIGN KEY ("owner_id") REFERENCES "employee" ("id");
