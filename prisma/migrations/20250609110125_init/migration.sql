-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);
