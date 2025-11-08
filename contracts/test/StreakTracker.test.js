const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("StreakTracker", function () {
  let streakTracker;
  let owner;
  let user1;
  let user2;
  
  const ACTIVATION_FEE = ethers.parseEther("0.000005");
  const ONE_HOUR = 3600;
  const ONE_DAY = 86400;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const StreakTracker = await ethers.getContractFactory("StreakTracker");
    streakTracker = await StreakTracker.deploy();
    await streakTracker.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await streakTracker.owner()).to.equal(owner.address);
    });

    it("Should have correct constants", async function () {
      expect(await streakTracker.ACTIVATION_FEE()).to.equal(ACTIVATION_FEE);
      expect(await streakTracker.STREAK_WINDOW()).to.equal(ONE_DAY);
    });
  });

  describe("Check-in", function () {
    it("Should activate streak on first check-in", async function () {
      await expect(
        streakTracker.connect(user1).checkIn({ value: ACTIVATION_FEE })
      ).to.emit(streakTracker, "StreakActivated");

      const streak = await streakTracker.getStreak(user1.address);
      expect(streak.count).to.equal(1n);
      expect(streak.isActive).to.equal(true);
    });

    it("Should fail with insufficient payment", async function () {
      await expect(
        streakTracker.connect(user1).checkIn({ value: ethers.parseEther("0.00001") })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should continue streak after 1 hour", async function () {
      await streakTracker.connect(user1).checkIn({ value: ACTIVATION_FEE });
      
      await time.increase(ONE_HOUR);
      
      await expect(
        streakTracker.connect(user1).checkIn({ value: ACTIVATION_FEE })
      ).to.emit(streakTracker, "StreakContinued");

      const streak = await streakTracker.getStreak(user1.address);
      expect(streak.count).to.equal(2n);
    });

    it("Should reject check-in within 1 hour", async function () {
      await streakTracker.connect(user1).checkIn({ value: ACTIVATION_FEE });
      
      await expect(
        streakTracker.connect(user1).checkIn({ value: ACTIVATION_FEE })
      ).to.be.revertedWith("Already checked in recently");
    });

    it("Should break streak after 24 hours", async function () {
      await streakTracker.connect(user1).checkIn({ value: ACTIVATION_FEE });
      
      await time.increase(ONE_DAY + 1);
      
      await expect(
        streakTracker.connect(user1).checkIn({ value: ACTIVATION_FEE })
      ).to.emit(streakTracker, "StreakBroken");

      const streak = await streakTracker.getStreak(user1.address);
      expect(streak.count).to.equal(1n);
    });
  });

  describe("Get Streak", function () {
    it("Should return correct streak data", async function () {
      await streakTracker.connect(user1).checkIn({ value: ACTIVATION_FEE });
      
      const streak = await streakTracker.getStreak(user1.address);
      expect(streak.count).to.equal(1n);
      expect(streak.isActive).to.equal(true);
      expect(streak.isExpired).to.equal(false);
    });

    it("Should detect expired streaks", async function () {
      await streakTracker.connect(user1).checkIn({ value: ACTIVATION_FEE });
      
      await time.increase(ONE_DAY + 1);
      
      const streak = await streakTracker.getStreak(user1.address);
      expect(streak.isExpired).to.equal(true);
    });
  });

  describe("Withdraw", function () {
    it("Should allow owner to withdraw", async function () {
      await streakTracker.connect(user1).checkIn({ value: ACTIVATION_FEE });
      await streakTracker.connect(user2).checkIn({ value: ACTIVATION_FEE });
      
      const balanceBefore = await ethers.provider.getBalance(owner.address);
      await streakTracker.connect(owner).withdraw();
      const balanceAfter = await ethers.provider.getBalance(owner.address);
      
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Should reject non-owner withdrawal", async function () {
      await expect(
        streakTracker.connect(user1).withdraw()
      ).to.be.revertedWith("Only owner");
    });
  });

  describe("Multiple Users", function () {
    it("Should track streaks independently", async function () {
      await streakTracker.connect(user1).checkIn({ value: ACTIVATION_FEE });
      await time.increase(ONE_HOUR);
      await streakTracker.connect(user1).checkIn({ value: ACTIVATION_FEE });
      
      await streakTracker.connect(user2).checkIn({ value: ACTIVATION_FEE });
      
      const streak1 = await streakTracker.getStreak(user1.address);
      const streak2 = await streakTracker.getStreak(user2.address);
      
      expect(streak1.count).to.equal(2n);
      expect(streak2.count).to.equal(1n);
    });
  });
});
