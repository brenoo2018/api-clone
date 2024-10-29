-- CreateTable
CREATE TABLE "events_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,
    "deleted_at" INTEGER,
    CONSTRAINT "events_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "events_categories_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "events_themes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "theme_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,
    "deleted_at" INTEGER,
    CONSTRAINT "events_themes_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "events_themes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "events_modalities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modality_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,
    "deleted_at" INTEGER,
    CONSTRAINT "events_modalities_modality_id_fkey" FOREIGN KEY ("modality_id") REFERENCES "modalities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "events_modalities_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "idx_events_category_id" ON "events_categories"("category_id");

-- CreateIndex
CREATE INDEX "idx_events_event_id" ON "events_categories"("event_id");

-- CreateIndex
CREATE INDEX "idx_events_theme_id" ON "events_themes"("theme_id");

-- CreateIndex
CREATE INDEX "idx_events_modality_id" ON "events_modalities"("modality_id");

