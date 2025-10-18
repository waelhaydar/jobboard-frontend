-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'ONLINE', 'REMOTE');

-- CreateEnum
CREATE TYPE "public"."SalaryType" AS ENUM ('ANNUAL', 'MONTHLY', 'HOURLY');

-- CreateEnum
CREATE TYPE "public"."Experience" AS ENUM ('ENTRY_LEVEL', 'ASSOCIATE', 'MID_SENIOR_LEVEL', 'DIRECTOR', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "public"."JobStatus" AS ENUM ('ACTIVE', 'OPEN', 'CLOSED', 'FILLED', 'LIMIT_REACHED');

-- CreateEnum
CREATE TYPE "public"."JobCategory" AS ENUM ('FOOD_RETAIL', 'FASHION_RETAIL', 'AUTOMOTIVE_RETAIL', 'RESTAURANTS', 'HOTELS', 'ELECTRONICS', 'HOME_DIY', 'SCHOOLS');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'VIEWED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."NewsPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "public"."NewsAudience" AS ENUM ('ALL', 'CANDIDATES', 'EMPLOYERS');

-- CreateEnum
CREATE TYPE "public"."NewsPosition" AS ENUM ('BANNER', 'SIDEBAR', 'MODAL');

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Candidate" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "resumeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "address" TEXT,
    "dob" TIMESTAMP(3),
    "lastJobLocation" TEXT,
    "lastJobPosition" TEXT,
    "mobileNumber" TEXT,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Employer" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT,
    "about" TEXT,

    CONSTRAINT "Employer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Job" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "jobType" "public"."JobType" NOT NULL DEFAULT 'FULL_TIME',
    "salaryType" "public"."SalaryType" NOT NULL DEFAULT 'ANNUAL',
    "salary" INTEGER NOT NULL,
    "salaryRange" TEXT,
    "vacancies" INTEGER NOT NULL DEFAULT 1,
    "experience" "public"."Experience" NOT NULL DEFAULT 'ENTRY_LEVEL',
    "status" "public"."JobStatus" NOT NULL DEFAULT 'ACTIVE',
    "category" "public"."JobCategory" NOT NULL DEFAULT 'FOOD_RETAIL',
    "applicantLimit" INTEGER NOT NULL DEFAULT 100,
    "applicationsCount" INTEGER NOT NULL DEFAULT 0,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employerId" INTEGER NOT NULL,
    "hiringFrom" TEXT,
    "basicMonthlySalaryUSD" INTEGER,
    "transportation" BOOLEAN NOT NULL DEFAULT false,
    "accommodation" BOOLEAN NOT NULL DEFAULT false,
    "freeMeals" BOOLEAN NOT NULL DEFAULT false,
    "bonuses" BOOLEAN NOT NULL DEFAULT false,
    "companyCar" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER,
    "employerId" INTEGER NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "resumePath" TEXT NOT NULL,
    "extractedText" TEXT,
    "extractedName" TEXT,
    "extractedEmail" TEXT,
    "extractedPhone" TEXT,
    "extractedLinkedIn" TEXT,
    "extractedSkills" TEXT,
    "yearsExperience" INTEGER,
    "careerLevel" TEXT,
    "experienceRelatedToJob" DOUBLE PRECISION,
    "last3Positions" TEXT,
    "educationLevel" TEXT,
    "totalSkills" INTEGER,
    "hardSkills" TEXT,
    "softSkills" TEXT,
    "topKeywords" TEXT,
    "textPreview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" DOUBLE PRECISION,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employerId" INTEGER,
    "candidateId" INTEGER,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "jobId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Settings" (
    "id" SERIAL NOT NULL,
    "cryptoCurrenciesCount" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NewsItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priority" "public"."NewsPriority" NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT,
    "expiresAt" TIMESTAMP(3),
    "targetAudience" "public"."NewsAudience" NOT NULL DEFAULT 'ALL',
    "displayPosition" "public"."NewsPosition" NOT NULL DEFAULT 'BANNER',
    "imageUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CvData" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "skills" TEXT,
    "text" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CvData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "public"."Candidate"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employer_email_key" ON "public"."Employer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "public"."Job"("slug");

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "public"."Employer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "public"."Employer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "public"."Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
