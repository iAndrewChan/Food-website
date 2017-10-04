PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE cities (name text, imagePath text);
INSERT INTO "cities" VALUES('Bristol','/images/index_1.jpg');
INSERT INTO "cities" VALUES('Manchester','/images/index_3.jpg');
INSERT INTO "cities" VALUES('London','/images/index_4.jpg');
COMMIT;
