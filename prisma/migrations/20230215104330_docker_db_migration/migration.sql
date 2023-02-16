-- CreateTable
CREATE TABLE "ReportedPost" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportedPost_pkey" PRIMARY KEY ("userId","postId")
);

-- AddForeignKey
ALTER TABLE "ReportedPost" ADD CONSTRAINT "ReportedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportedPost" ADD CONSTRAINT "ReportedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
