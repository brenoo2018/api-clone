-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_events_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,
    CONSTRAINT "events_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "events_categories_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_events_categories" ("category_id", "created_at", "event_id", "id", "updated_at") SELECT "category_id", "created_at", "event_id", "id", "updated_at" FROM "events_categories";
DROP TABLE "events_categories";
ALTER TABLE "new_events_categories" RENAME TO "events_categories";
CREATE INDEX "idx_events_category_id" ON "events_categories"("category_id");
CREATE INDEX "idx_events_event_id" ON "events_categories"("event_id");
CREATE TABLE "new_events_modalities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modality_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,
    CONSTRAINT "events_modalities_modality_id_fkey" FOREIGN KEY ("modality_id") REFERENCES "modalities" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "events_modalities_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_events_modalities" ("created_at", "event_id", "id", "modality_id", "updated_at") SELECT "created_at", "event_id", "id", "modality_id", "updated_at" FROM "events_modalities";
DROP TABLE "events_modalities";
ALTER TABLE "new_events_modalities" RENAME TO "events_modalities";
CREATE INDEX "idx_events_modality_id" ON "events_modalities"("modality_id");
CREATE TABLE "new_events_themes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "theme_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,
    CONSTRAINT "events_themes_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "events_themes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_events_themes" ("created_at", "event_id", "id", "theme_id", "updated_at") SELECT "created_at", "event_id", "id", "theme_id", "updated_at" FROM "events_themes";
DROP TABLE "events_themes";
ALTER TABLE "new_events_themes" RENAME TO "events_themes";
CREATE INDEX "idx_events_theme_id" ON "events_themes"("theme_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

