CREATE TABLE "contact" (
  "ulid" TEXT PRIMARY KEY,
  "name" "VARCHAR(100)" NOT NULL,
  "email" "VARCHAR(254)" UNIQUE,
  "phone" "VARCHAR(32)" UNIQUE NOT NULL,
  "student_ulid" text,
  "deleted" tinyint(1) DEFAULT 0,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "classDate" (
  "ulid" TEXT PRIMARY KEY,
  "dayOfWeek" tinyint(1) NOT NULL,
  "hour" tinyint(2) NOT NULL,
  "isFree" bool NOT NULL DEFAULT 0,
  "repeat" bool DEFAULT 0,
  "everyDays" tinyint(1) DEFAULT 0,
  "student_ulid" text,
  "deleted" tinyint(1) DEFAULT 0,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "cooperation" (
  "ulid" TEXT PRIMARY KEY,
  "type" tinyint NOT NULL,
  "paymentType" tinyint NOT NULL,
  "boardUrl" text,
  "registrationUrl" text,
  "student_ulid" text UNIQUE NOT NULL,
  "deleted" tinyint(1) DEFAULT 0,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "note" (
  "ulid" TEXT PRIMARY KEY,
  "type" tinyint DEFAULT 0,
  "note" text,
  "student_ulid" text,
  "deleted" tinyint(1) DEFAULT 0,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "student" (
  "ulid" TEXT PRIMARY KEY,
  "name" varchar(100),
  "number" integer,
  "price" integer,
  "rate" tinyint(1),
  "startDate" datetime,
  "deleted" tinyint(1) DEFAULT 0,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE INDEX ON "contact" ("name", "student_ulid");

CREATE INDEX ON "classDate" ("student_ulid");

CREATE INDEX ON "cooperation" ("student_ulid");

CREATE INDEX ON "note" ("type", "student_ulid");

CREATE INDEX ON "student" ("name", "number");

COMMENT ON TABLE "contact" IS 'lista kontaktów';

COMMENT ON TABLE "classDate" IS 'Zestaw terminów zajęć, możliwych do zarezerwowania';

COMMENT ON COLUMN "classDate"."dayOfWeek" IS 'termin dnia zajec od 1(pon) do 7(ndz)';

COMMENT ON COLUMN "classDate"."hour" IS 'godzina zajec';

COMMENT ON COLUMN "classDate"."isFree" IS 'czy ta godzina jest dostepna, 0-nie, 1-tak';

COMMENT ON COLUMN "classDate"."repeat" IS 'czy termin jest powtarzalny, 0-nie, 1-tak';

COMMENT ON COLUMN "classDate"."everyDays" IS 'co ile dni powtarzalne. możliwości: 0,7,14,21,28';

COMMENT ON TABLE "cooperation" IS 'tabela zawierajaca szczegóły o wspópracy z uczniem';

COMMENT ON COLUMN "cooperation"."type" IS '0-private, 1-bukiSchool, ps:moze byc tego wiecej';

COMMENT ON COLUMN "cooperation"."paymentType" IS '0-blik, 1-przelew, 2-przelew opóźniony';

COMMENT ON COLUMN "cooperation"."boardUrl" IS 'link do tablicy';

COMMENT ON COLUMN "cooperation"."registrationUrl" IS 'link do zgłoszenia';

COMMENT ON TABLE "note" IS 'tabela na wszelakie notatki';

COMMENT ON COLUMN "note"."type" IS '0-notatka, 1-dodatkowa notatka, moga dojsc nowe typy w razie potrzeb';

COMMENT ON TABLE "student" IS 'tabela uczniów';

COMMENT ON COLUMN "student"."number" IS 'numer zgłoszenia lub numer generatywny w zależności od typu współpracy';

COMMENT ON COLUMN "student"."price" IS 'cena zajęć';

COMMENT ON COLUMN "student"."rate" IS 'ocena po pierwszych zajeciach od 1 do 5';

COMMENT ON COLUMN "student"."startDate" IS 'data rozpoczecia zajec';

ALTER TABLE "contact" ADD FOREIGN KEY ("student_ulid") REFERENCES "student" ("ulid");

ALTER TABLE "classDate" ADD FOREIGN KEY ("student_ulid") REFERENCES "student" ("ulid");

ALTER TABLE "cooperation" ADD FOREIGN KEY ("student_ulid") REFERENCES "student" ("ulid");

ALTER TABLE "note" ADD FOREIGN KEY ("student_ulid") REFERENCES "student" ("ulid");
