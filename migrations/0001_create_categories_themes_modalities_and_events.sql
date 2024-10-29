-- CreateTable
CREATE TABLE "categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT COLLATE NOCASE NOT NULL,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "themes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT COLLATE NOCASE NOT NULL,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "modalities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT COLLATE NOCASE NOT NULL,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER,
    "org_name" TEXT COLLATE NOCASE,
    "active" BOOLEAN,
    "title" TEXT COLLATE NOCASE NOT NULL,
    "description" TEXT COLLATE NOCASE,
    "speaker" TEXT COLLATE NOCASE,
    "state" TEXT COLLATE NOCASE NOT NULL,
    "city" TEXT COLLATE NOCASE NOT NULL,
    "local" TEXT COLLATE NOCASE,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "start_at" INTEGER NOT NULL,
    "end_at" INTEGER NOT NULL,
    "url_event" TEXT COLLATE NOCASE NOT NULL,
    "url_image" TEXT COLLATE NOCASE NOT NULL,
    "rate" INTEGER DEFAULT 0,
    "provider" TEXT COLLATE NOCASE,
    "free" BOOLEAN NOT NULL DEFAULT false,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,
    "deleted_at" INTEGER
);

-- CreateIndex
CREATE INDEX "idx_categories_id" ON "categories"("id");

-- CreateIndex
CREATE INDEX "idx_categories_title" ON "categories"("title");

-- CreateIndex
CREATE INDEX "idx_themes_id" ON "themes"("id");

-- CreateIndex
CREATE INDEX "idx_themes_title" ON "themes"("title");

-- CreateIndex
CREATE INDEX "idx_modalities_id" ON "modalities"("id");

-- CreateIndex
CREATE INDEX "idx_modalities_title" ON "modalities"("title");

-- CreateIndex
CREATE INDEX "idx_events_id" ON "events"("id");

-- CreateIndex
CREATE INDEX "idx_events_title" ON "events"("title");

-- CreateIndex
CREATE INDEX "idx_events_description" ON "events"("description");

-- CreateIndex
CREATE INDEX "idx_events_speaker" ON "events"("speaker");

-- CreateIndex
CREATE INDEX "idx_events_state" ON "events"("state");

-- CreateIndex
CREATE INDEX "idx_events_city" ON "events"("city");

-- CreateIndex
CREATE INDEX "idx_events_start_at" ON "events"("start_at");

