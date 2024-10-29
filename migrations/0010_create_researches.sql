-- CreateTable
CREATE TABLE "researches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "query" TEXT COLLATE NOCASE,
    "filter" TEXT COLLATE NOCASE,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "city" TEXT COLLATE NOCASE,
    "state" TEXT COLLATE NOCASE,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,
    "deleted_at" INTEGER
);

-- CreateIndex
CREATE INDEX "idx_research_id" ON "researches"("id");

-- CreateIndex
CREATE INDEX "idx_research_query" ON "researches"("query");

-- CreateIndex
CREATE INDEX "idx_research_city" ON "researches"("city");

-- CreateIndex
CREATE INDEX "idx_research_state" ON "researches"("state");

