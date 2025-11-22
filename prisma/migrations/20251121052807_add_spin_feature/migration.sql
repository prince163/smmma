-- CreateTable
CREATE TABLE "SpinConfiguration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "platform" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SpinSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "configId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "rewardType" TEXT NOT NULL,
    "rewardLabel" TEXT NOT NULL,
    "platform" TEXT,
    "serviceId" TEXT,
    "rewardValue" INTEGER,
    "discountType" TEXT,
    "probability" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SpinSlot_configId_fkey" FOREIGN KEY ("configId") REFERENCES "SpinConfiguration" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SpinSlot_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSpin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "rewardType" TEXT NOT NULL,
    "rewardLabel" TEXT NOT NULL,
    "rewardValue" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "orderId" TEXT,
    "discountCode" TEXT,
    "claimData" TEXT,
    "expiresAt" DATETIME,
    "spunAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimedAt" DATETIME,
    CONSTRAINT "UserSpin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserSpin_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SpinSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "spinFrequencyHrs" INTEGER NOT NULL DEFAULT 24,
    "requireLogin" BOOLEAN NOT NULL DEFAULT true,
    "claimWindowHrs" INTEGER NOT NULL DEFAULT 24,
    "rulesText" TEXT NOT NULL DEFAULT '1 spin per user every 24 hours. Rewards are non-transferable. Service rewards must be claimed within 24 hours. Discount rewards are valid only on the next order within 24 hours.',
    "platformMode" TEXT NOT NULL DEFAULT 'RANDOM',
    "activeConfigId" TEXT,
    "showOnHomepage" BOOLEAN NOT NULL DEFAULT true,
    "showOnDashboard" BOOLEAN NOT NULL DEFAULT true,
    "enableSounds" BOOLEAN NOT NULL DEFAULT true,
    "enableConfetti" BOOLEAN NOT NULL DEFAULT true,
    "floatingIconText" TEXT NOT NULL DEFAULT 'Daily Spin',
    "popupTitle" TEXT NOT NULL DEFAULT 'Daily Spin & Win',
    "popupSubtitle" TEXT NOT NULL DEFAULT 'Spin the wheel for amazing rewards!',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "SpinSlot_configId_idx" ON "SpinSlot"("configId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSpin_orderId_key" ON "UserSpin"("orderId");

-- CreateIndex
CREATE INDEX "UserSpin_userId_idx" ON "UserSpin"("userId");

-- CreateIndex
CREATE INDEX "UserSpin_status_idx" ON "UserSpin"("status");

-- CreateIndex
CREATE INDEX "UserSpin_spunAt_idx" ON "UserSpin"("spunAt");
