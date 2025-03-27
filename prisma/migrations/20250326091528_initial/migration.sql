-- CreateTable
CREATE TABLE "Files" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createAt" INTEGER NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersFiles" (
    "userId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,

    CONSTRAINT "UsersFiles_pkey" PRIMARY KEY ("userId","fileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Files_name_key" ON "Files"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
