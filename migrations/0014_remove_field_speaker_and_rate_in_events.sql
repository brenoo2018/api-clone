-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER,
    "org_name" TEXT,
    "is_active" BOOLEAN,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "local" TEXT,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "start_at" INTEGER NOT NULL,
    "end_at" INTEGER NOT NULL,
    "url_event" TEXT NOT NULL,
    "url_image" TEXT NOT NULL,
    "provider" TEXT,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "amount_inscription" INTEGER DEFAULT 0,
    "amount_view" INTEGER DEFAULT 0,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,
    "deleted_at" INTEGER,
    "reason" TEXT,
    "is_checked_christian" BOOLEAN DEFAULT false,
    "is_checked_nsfw" BOOLEAN DEFAULT false,
    "is_checked_tags" BOOLEAN DEFAULT false,
    "is_pending" BOOLEAN DEFAULT false
);
INSERT INTO "new_events" ("amount_inscription", "amount_view", "city", "created_at", "deleted_at", "description", "end_at", "external_id", "id", "is_active", "is_checked_christian", "is_checked_nsfw", "is_checked_tags", "is_free", "is_pending", "latitude", "local", "longitude", "org_name", "provider", "reason", "start_at", "state", "title", "updated_at", "url_event", "url_image") SELECT "amount_inscription", "amount_view", "city", "created_at", "deleted_at", "description", "end_at", "external_id", "id", "is_active", "is_checked_christian", "is_checked_nsfw", "is_checked_tags", "is_free", "is_pending", "latitude", "local", "longitude", "org_name", "provider", "reason", "start_at", "state", "title", "updated_at", "url_event", "url_image" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
CREATE INDEX "idx_events_id" ON "events"("id");
CREATE INDEX "idx_events_title" ON "events"("title");
CREATE INDEX "idx_events_description" ON "events"("description");
CREATE INDEX "idx_events_state" ON "events"("state");
CREATE INDEX "idx_events_city" ON "events"("city");
CREATE INDEX "idx_events_start_at" ON "events"("start_at");
CREATE INDEX "idx_events_end_at" ON "events"("end_at");
CREATE INDEX "idx_events_latitude" ON "events"("latitude");
CREATE INDEX "idx_events_longitude" ON "events"("longitude");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

