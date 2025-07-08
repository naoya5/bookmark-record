-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "emoji" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "topicId" TEXT NOT NULL,
    CONSTRAINT "Bookmark_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Topic_createdAt_idx" ON "Topic"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Topic_updatedAt_idx" ON "Topic"("updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Topic_title_idx" ON "Topic"("title");

-- CreateIndex
CREATE INDEX "Bookmark_topicId_idx" ON "Bookmark"("topicId");

-- CreateIndex
CREATE INDEX "Bookmark_createdAt_idx" ON "Bookmark"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Bookmark_updatedAt_idx" ON "Bookmark"("updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Bookmark_topicId_createdAt_idx" ON "Bookmark"("topicId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Bookmark_topicId_updatedAt_idx" ON "Bookmark"("topicId", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Bookmark_url_idx" ON "Bookmark"("url");
